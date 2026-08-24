import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";

export const loginSchema = z.object({
  email: z.string().min(1, "Username atau Email wajib diisi"),
  password: z.string().min(1, "Kata sandi wajib diisi"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export function useAuthLogin() {
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (values: LoginFormValues) => {
    const rawInput = values.email.trim();
    const isEmail = rawInput.includes("@");
    let authResponse;

    if (isEmail) {
      authResponse = await authService.signInWithEmail(rawInput, values.password);
    } else {
      authResponse = await authService.signInWithUsername(rawInput, values.password);

      // Guardrail Keamanan: Administrator dan Petugas dilarang login via username
      if (authResponse?.data?.user) {
        const userRole = (authResponse.data.user as { role?: string }).role;
        if (userRole === "ADMIN" || userRole === "PETUGAS") {
          await authService.signOutUser();
          toast.error(
            "Akun Administrator dan Petugas wajib masuk menggunakan Alamat Email.",
            { duration: 5000 }
          );
          return;
        }
      }
    }

    if (authResponse.error) {
      toast.error(
        authResponse.error.message || "Gagal masuk. Periksa kembali akun Anda.",
        { duration: 4500 }
      );
    } else {
      setIsRedirecting(true);
      const user = authResponse.data?.user;
      const firstName = user?.name ? user.name.trim().split(" ")[0] : "Pengguna";

      toast.success("Berhasil Masuk!", {
        description: `Selamat datang, ${firstName}!`,
        duration: 3500,
      });

      const role = (user as { role?: string })?.role;
      const targetUrl =
        role === "ADMIN"
          ? "/admin"
          : role === "PETUGAS"
          ? "/petugas/sirkulasi"
          : "/mahasiswa";

      setTimeout(() => {
        window.location.href = targetUrl;
      }, 2000);
    }
  };

  return {
    form,
    isRegisterOpen,
    setRegisterOpen,
    showPassword,
    togglePasswordVisibility,
    isRedirecting,
    onLogin: form.handleSubmit(handleLogin),
  };
}

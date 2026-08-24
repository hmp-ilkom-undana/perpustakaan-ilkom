import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";

export const registerSchema = z
  .object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    username: z
      .string()
      .min(3, "Username minimal 3 karakter")
      .regex(/^[a-zA-Z0-9_]+$/, "Hanya boleh huruf, angka, dan underscore"),
    nim: z.string().length(10, "NIM harus 10 karakter"),
    wa_number: z
      .string()
      .min(10, "Nomor WA minimal 10 digit")
      .max(14, "Nomor WA terlalu panjang"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

interface UseAuthRegisterOptions {
  onOpenChange: (open: boolean) => void;
}

export function useAuthRegister({ onOpenChange }: UseAuthRegisterOptions) {
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      nim: "",
      wa_number: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleDialogChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      form.reset();
      setRegisterError(null);
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  };

  const handleRegister = async (values: RegisterFormValues) => {
    setRegisterError(null);
    try {
      const { error } = await authService.signUpStudent({
        email: values.email.trim().toLowerCase(),
        password: values.password,
        name: values.name.trim(),
        nim: values.nim.trim(),
        username: values.username.trim().toLowerCase(),
        wa_number: values.wa_number.trim(),
      });

      if (error) {
        setRegisterError(
          error.message || "Gagal mendaftar. Email atau NIM mungkin sudah terdaftar."
        );
      } else {
        handleDialogChange(false);
        toast.success(
          "Pendaftaran akun berhasil! Silakan masuk menggunakan akun baru Anda."
        );
      }
    } catch {
      setRegisterError("Koneksi ke server gagal. Coba beberapa saat lagi.");
    }
  };

  return {
    form,
    registerError,
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleDialogChange,
    onSubmit: form.handleSubmit(handleRegister),
  };
}

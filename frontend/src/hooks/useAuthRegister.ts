import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Nama lengkap minimal 3 karakter")
      .max(100, "Nama lengkap maksimal 100 karakter")
      .regex(
        /^[a-zA-Z\s'.]+$/,
        "Nama hanya boleh mengandung huruf, spasi, titik, dan petik"
      ),
    nim: z
      .string()
      .trim()
      .regex(/^\d{10}$/, "NIM harus berupa 10 digit angka"),
    username: z
      .string()
      .trim()
      .min(3, "Username minimal 3 karakter")
      .max(20, "Username maksimal 20 karakter")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username hanya boleh mengandung huruf, angka, dan underscore (_)"
      ),
    wa_number: z
      .string()
      .trim()
      .regex(
        /^(08|628)\d{8,11}$/,
        "Nomor WhatsApp harus valid diawali 08 atau 628 (10-14 digit)"
      ),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Format alamat email tidak valid"),
    password: z
      .string()
      .min(8, "Kata sandi minimal 8 karakter")
      .regex(/[A-Z]/, "Kata sandi wajib mengandung huruf besar (A-Z)")
      .regex(/[a-z]/, "Kata sandi wajib mengandung huruf kecil (a-z)")
      .regex(/[0-9]/, "Kata sandi wajib mengandung angka (0-9)"),
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
    mode: "onChange",
    reValidateMode: "onChange",
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
          error.message ||
            "Gagal mendaftar. Email, NIM, atau username mungkin sudah terdaftar."
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

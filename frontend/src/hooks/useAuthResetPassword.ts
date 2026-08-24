import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Kata sandi minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function useAuthResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetSuccess, setIsResetSuccess] = useState(false);

  // Ambil token dari query param URL secara aman
  const token = useMemo(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      return searchParams.get("token") || "";
    }
    return "";
  }, []);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleResetPassword = async (values: ResetPasswordFormValues) => {
    if (!token) {
      toast.error("Token verifikasi tidak ditemukan atau tidak valid.");
      return;
    }

    try {
      const { error } = await authService.resetPassword(values.password, token);
      if (error) {
        toast.error(error.message || "Tautan reset kata sandi sudah kedaluwarsa atau tidak valid.");
      } else {
        setIsResetSuccess(true);
        toast.success("Kata sandi berhasil diperbarui!", {
          description: "Silakan masuk kembali menggunakan kata sandi baru Anda.",
          duration: 3500,
        });

        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch {
      toast.error("Gagal mengatur ulang kata sandi. Coba beberapa saat lagi.");
    }
  };

  return {
    form,
    token,
    hasToken: Boolean(token),
    showPassword,
    showConfirmPassword,
    isResetSuccess,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    onSubmit: form.handleSubmit(handleResetPassword),
  };
}

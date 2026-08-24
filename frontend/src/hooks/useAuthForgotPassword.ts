import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Alamat email wajib diisi").email("Format email tidak valid"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function useAuthForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [countdown, setCountdown] = useState(0);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  const handleSendEmail = async (values: ForgotPasswordFormValues) => {
    const targetEmail = values.email.trim().toLowerCase();
    try {
      const { error } = await authService.forgotPassword(targetEmail, "/reset-sandi");
      if (error) {
        toast.error(error.message || "Gagal memproses permintaan reset kata sandi.");
      } else {
        setSubmittedEmail(targetEmail);
        setIsSubmitted(true);
        setCountdown(60);
        toast.success("Tautan reset kata sandi berhasil dikirim!", {
          description: `Periksa kotak masuk atau spam di ${targetEmail}`,
        });
      }
    } catch {
      toast.error("Terjadi kendala koneksi ke server. Silakan coba lagi.");
    }
  };

  const handleResendEmail = async () => {
    if (countdown > 0 || !submittedEmail) return;
    try {
      const { error } = await authService.forgotPassword(submittedEmail, "/reset-sandi");
      if (error) {
        toast.error(error.message || "Gagal mengirim ulang email reset.");
      } else {
        setCountdown(60);
        toast.success("Tautan reset baru telah dikirimkan ulang!", {
          description: `Periksa kotak masuk ${submittedEmail}`,
        });
      }
    } catch {
      toast.error("Gagal mengirim ulang email. Coba beberapa saat lagi.");
    }
  };

  const resetFormState = () => {
    setIsSubmitted(false);
    setSubmittedEmail("");
    setCountdown(0);
    form.reset();
  };

  return {
    form,
    isSubmitted,
    submittedEmail,
    countdown,
    resetFormState,
    handleResendEmail,
    onSubmit: form.handleSubmit(handleSendEmail),
  };
}

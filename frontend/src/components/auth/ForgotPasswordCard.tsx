import { Link } from "@tanstack/react-router";
import { KeyRound, Mail, ArrowLeft, Loader2, Send, CheckCircle2, RotateCw, HelpCircle } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { ForgotPasswordFormValues } from "@/hooks/useAuthForgotPassword";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ForgotPasswordCardProps {
  form: UseFormReturn<ForgotPasswordFormValues>;
  isSubmitted: boolean;
  submittedEmail: string;
  countdown: number;
  onResendEmail: () => void;
  onResetForm: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export function ForgotPasswordCard({
  form,
  isSubmitted,
  submittedEmail,
  countdown,
  onResendEmail,
  onResetForm,
  onSubmit,
}: ForgotPasswordCardProps) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <Card className="w-full max-w-md bg-white border-4 border-blue-900 shadow-[8px_8px_0px_#1E3A8A] rounded-2xl overflow-hidden relative">
      {/* HEADER */}
      <CardHeader className="space-y-3 text-center pt-8 pb-4 px-6 border-b-2 border-blue-900">
        <div className="flex justify-center">
          <div className="p-3 rounded-xl bg-amber-50 border-2 border-blue-900 shadow-[3px_3px_0px_#1E3A8A] flex items-center justify-center">
            {isSubmitted ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            ) : (
              <KeyRound className="w-8 h-8 text-blue-900" />
            )}
          </div>
        </div>
        <div>
          <CardTitle className="text-lg sm:text-xl font-black tracking-tight text-blue-950 uppercase leading-snug">
            {isSubmitted ? "Tautan Terkirim!" : "Lupa Kata Sandi"}
          </CardTitle>
          <p className="text-xs text-slate-500 font-bold tracking-wider uppercase pt-1">
            Sistem Informasi Perpustakaan ILKOM
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-6 pb-8 px-6 space-y-5">
        {isSubmitted ? (
          /* ================================================================= */
          /* MODE: KONFIRMASI EMAIL TERKIRIM                                  */
          /* ================================================================= */
          <div className="space-y-5 text-center">
            <div className="p-4 bg-emerald-50 border-2 border-blue-900 rounded-xl shadow-[3px_3px_0px_#1E3A8A] text-left space-y-2">
              <p className="text-xs font-bold text-slate-700 leading-relaxed">
                Instruksi reset kata sandi telah dikirimkan ke alamat email:
              </p>
              <p className="text-xs font-black text-blue-950 bg-white p-2 rounded border border-blue-900/30 break-all">
                {submittedEmail}
              </p>
              <p className="text-[11px] font-semibold text-slate-500 pt-1">
                Silakan periksa kotak masuk (*Inbox*) atau folder *Spam*. Tautan berlaku selama 1 jam.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <Button
                type="button"
                variant="outline"
                disabled={countdown > 0}
                onClick={onResendEmail}
                className="w-full border-2 border-blue-900 font-bold text-xs h-11 shadow-[2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCw className={`w-3.5 h-3.5 ${countdown > 0 ? "animate-spin" : ""}`} />
                {countdown > 0 ? `Kirim Ulang (${countdown}s)` : "Kirim Ulang Tautan"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={onResetForm}
                className="text-xs font-bold text-slate-600 hover:text-blue-950"
              >
                Gunakan Email Lain
              </Button>
            </div>

            <div className="border-t-2 border-blue-900 pt-4">
              <Link to="/login">
                <Button
                  type="button"
                  variant="default"
                  className="w-full font-black text-xs h-11 border-2 border-blue-900 shadow-[3px_3px_0px_#1E3A8A] uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Halaman Login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* ================================================================= */
          /* MODE: FORMULIR INPUT EMAIL                                       */
          /* ================================================================= */
          <form onSubmit={onSubmit} className="space-y-4">
            {/* CALLOUT INFO */}
            <div className="p-3.5 bg-amber-50 border-2 border-blue-900 rounded-xl shadow-[2px_2px_0px_#1E3A8A] flex items-start gap-2.5 text-xs text-blue-950 leading-relaxed font-medium">
              <HelpCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <span>
                Masukkan email yang terhubung dengan akun Anda. Kami akan mengirimkan tautan untuk membuat kata sandi baru.
              </span>
            </div>

            {/* FIELD EMAIL */}
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-blue-900" />
                Alamat Email Terdaftar
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com..."
                autoCapitalize="none"
                autoComplete="email"
                className="h-11 text-sm bg-slate-50 border-2 border-blue-900 text-slate-900 placeholder:text-slate-400 font-bold rounded-lg shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:bg-white"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-600 text-xs font-bold mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* TOMBOL SUBMIT */}
            <Button
              type="submit"
              variant="default"
              size="lg"
              disabled={isSubmitting}
              className="w-full font-black text-sm h-11 border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] uppercase tracking-wider mt-5 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  Mengirim Tautan...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-1" />
                  Kirim Tautan Reset
                </>
              )}
            </Button>

            {/* NAVIGASI KEMBALI */}
            <div className="pt-3 border-t-2 border-blue-900 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-black text-blue-900 hover:text-orange-500 transition-colors uppercase tracking-wider"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Kembali ke Halaman Login
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

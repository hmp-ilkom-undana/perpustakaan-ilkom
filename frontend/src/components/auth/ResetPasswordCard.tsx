import { Link } from "@tanstack/react-router";
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { ResetPasswordFormValues } from "@/hooks/useAuthResetPassword";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResetPasswordCardProps {
  form: UseFormReturn<ResetPasswordFormValues>;
  hasToken: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  isResetSuccess: boolean;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export function ResetPasswordCard({
  form,
  hasToken,
  showPassword,
  showConfirmPassword,
  isResetSuccess,
  onTogglePassword,
  onToggleConfirmPassword,
  onSubmit,
}: ResetPasswordCardProps) {
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
            {!hasToken ? (
              <AlertTriangle className="w-8 h-8 text-rose-600" />
            ) : isResetSuccess ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            ) : (
              <ShieldCheck className="w-8 h-8 text-blue-900" />
            )}
          </div>
        </div>
        <div>
          <CardTitle className="text-lg sm:text-xl font-black tracking-tight text-blue-950 uppercase leading-snug">
            {!hasToken
              ? "Tautan Tidak Valid"
              : isResetSuccess
              ? "Kata Sandi Diperbarui!"
              : "Atur Sandi Baru"}
          </CardTitle>
          <p className="text-xs text-slate-500 font-bold tracking-wider uppercase pt-1">
            Sistem Informasi Perpustakaan ILKOM
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-6 pb-8 px-6 space-y-5">
        {!hasToken ? (
          /* ================================================================= */
          /* MODE: TOKEN INVALID / MISSING                                     */
          /* ================================================================= */
          <div className="space-y-5 text-center">
            <div className="p-4 bg-rose-50 border-2 border-blue-900 rounded-xl shadow-[3px_3px_0px_#1E3A8A] text-left space-y-2">
              <p className="text-xs font-bold text-rose-950 leading-relaxed">
                Tautan pemulihan kata sandi ini tidak valid atau parameter token tidak ditemukan.
              </p>
              <p className="text-[11px] font-semibold text-slate-600">
                Silakan lakukan permintaan reset kata sandi baru dari halaman Lupa Sandi.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <Link to="/lupa-sandi">
                <Button
                  type="button"
                  variant="default"
                  className="w-full font-black text-xs h-11 border-2 border-blue-900 shadow-[3px_3px_0px_#1E3A8A] uppercase tracking-wider cursor-pointer"
                >
                  Minta Tautan Reset Baru
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full font-bold text-xs h-11 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] uppercase tracking-wider cursor-pointer"
                >
                  Kembali ke Halaman Login
                </Button>
              </Link>
            </div>
          </div>
        ) : isResetSuccess ? (
          /* ================================================================= */
          /* MODE: SUKSES DIUBAH                                              */
          /* ================================================================= */
          <div className="space-y-5 text-center">
            <div className="p-4 bg-emerald-50 border-2 border-blue-900 rounded-xl shadow-[3px_3px_0px_#1E3A8A] text-left space-y-2">
              <p className="text-xs font-bold text-emerald-950 leading-relaxed">
                Kata sandi baru Anda telah berhasil disimpan. Anda akan dialihkan ke halaman masuk secara otomatis...
              </p>
            </div>
            <Link to="/login">
              <Button
                type="button"
                variant="default"
                className="w-full font-black text-xs h-11 border-2 border-blue-900 shadow-[3px_3px_0px_#1E3A8A] uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Masuk Sekarang
              </Button>
            </Link>
          </div>
        ) : (
          /* ================================================================= */
          /* MODE: FORMULIR INPUT KATA SANDI BARU                             */
          /* ================================================================= */
          <form onSubmit={onSubmit} className="space-y-4">
            {/* FIELD: KATA SANDI BARU */}
            <div className="space-y-1.5">
              <Label
                htmlFor="new-password"
                className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-blue-900" />
                Kata Sandi Baru
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 karakter..."
                  autoComplete="new-password"
                  className="h-11 bg-slate-50 border-2 border-blue-900 text-slate-900 placeholder:text-slate-400 font-bold rounded-lg shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:bg-white pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={onTogglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-900 hover:text-orange-500 transition-colors p-1 cursor-pointer"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-xs font-bold mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* FIELD: KONFIRMASI KATA SANDI */}
            <div className="space-y-1.5">
              <Label
                htmlFor="confirm-password"
                className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-blue-900" />
                Ulangi Kata Sandi Baru
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ulangi kata sandi baru..."
                  autoComplete="new-password"
                  className="h-11 bg-slate-50 border-2 border-blue-900 text-slate-900 placeholder:text-slate-400 font-bold rounded-lg shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:bg-white pr-10"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={onToggleConfirmPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-900 hover:text-orange-500 transition-colors p-1 cursor-pointer"
                  aria-label={
                    showConfirmPassword
                      ? "Sembunyikan konfirmasi sandi"
                      : "Tampilkan konfirmasi sandi"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-xs font-bold mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* TOMBOL SIMPAN */}
            <Button
              type="submit"
              variant="default"
              size="lg"
              disabled={isSubmitting || isResetSuccess}
              className="w-full font-black text-sm h-11 border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] uppercase tracking-wider mt-5 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  Menyimpan Sandi...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 mr-1" />
                  Simpan Kata Sandi Baru
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

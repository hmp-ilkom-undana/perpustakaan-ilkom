import { Link } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, User, LogIn, Loader2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { LoginFormValues } from "@/hooks/useAuthLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LoginFormCardProps {
  form: UseFormReturn<LoginFormValues>;
  onLogin: (e?: React.BaseSyntheticEvent) => Promise<void>;
  showPassword: boolean;
  onTogglePassword: () => void;
  isRedirecting: boolean;
  onOpenRegister: () => void;
}

export function LoginFormCard({
  form,
  onLogin,
  showPassword,
  onTogglePassword,
  isRedirecting,
  onOpenRegister,
}: LoginFormCardProps) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <Card className="w-full max-w-sm bg-white border-4 border-blue-900 shadow-[8px_8px_0px_#1E3A8A] rounded-2xl overflow-hidden relative">
      <CardHeader className="space-y-3 text-center pt-8 pb-4 px-6 border-b-2 border-blue-900">
        <div className="flex justify-center">
          <div className="p-3 rounded-xl bg-amber-50 border-2 border-blue-900 shadow-[3px_3px_0px_#1E3A8A] flex items-center justify-center">
            <img
              src="/assets/Logo_Ilkom.png"
              alt="Logo Ilmu Komputer"
              className="h-14 w-auto object-contain mix-blend-multiply"
            />
          </div>
        </div>
        <div>
          <CardTitle className="text-base sm:text-lg font-black tracking-tight text-blue-950 uppercase leading-snug">
            Sistem Informasi Perpustakaan
            <span className="block mt-0.5">
              <span className="text-blue-900">Ilmu</span>{" "}
              <span className="text-orange-500">Komputer</span>
            </span>
          </CardTitle>
          <p className="text-[11px] text-slate-500 font-bold tracking-wider uppercase pt-1">
            Universitas Nusa Cendana
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-6 pb-8 px-6 space-y-5">
        <form onSubmit={onLogin} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-blue-900" />
              Email / Username
            </Label>
            <Input
              id="email"
              placeholder="nama@email.com atau username..."
              className="h-11 text-sm bg-slate-50 border-2 border-blue-900 text-slate-900 placeholder:text-slate-400 font-bold rounded-lg shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:bg-white"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-600 text-xs font-bold mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-blue-900" />
                Kata Sandi
              </Label>
              <Link
                to="/lupa-sandi"
                className="text-[11px] font-black text-blue-900 hover:text-orange-500 transition-colors uppercase tracking-wider"
              >
                Lupa Sandi?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan kata sandi..."
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

          <Button
            type="submit"
            variant="default"
            size="lg"
            disabled={isSubmitting || isRedirecting}
            className="w-full font-black text-sm h-11 border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] uppercase tracking-wider mt-5 cursor-pointer"
          >
            {isSubmitting || isRedirecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {isRedirecting ? "Mengalihkan..." : "Memverifikasi..."}
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Masuk
              </>
            )}
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-600 font-bold">
          Belum punya akun?{" "}
          <button
            type="button"
            onClick={onOpenRegister}
            className="text-orange-500 font-black hover:underline cursor-pointer inline-block ml-1"
          >
            Daftar di sini
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

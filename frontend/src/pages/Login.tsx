import { useState } from "react";
import { Eye, EyeOff, Lock, User, LogIn, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RegisterDialog from "@/components/RegisterDialog";
import ParticleBackground from "@/components/ParticleBackground";
import { toast } from "sonner";

// =============================================================================
// VALIDATION SCHEMA
// =============================================================================
const loginSchema = z.object({
  email: z.string().min(1, "Username atau Email wajib diisi"),
  password: z.string().min(1, "Kata sandi wajib diisi"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// =============================================================================
// LOGIN PAGE COMPONENT
// =============================================================================
export default function Login() {
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onLogin = async (values: LoginFormValues) => {
    const isEmail = values.email.includes("@");
    let authResponse;

    if (isEmail) {
      authResponse = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });
    } else {
      authResponse = await authClient.signIn.username({
        username: values.email,
        password: values.password,
      });
    }

    if (authResponse.error) {
      toast.error(
        authResponse.error.message || "Gagal masuk. Periksa kembali akun Anda.",
      );
    } else {
      toast.success("Berhasil masuk!");
      const role = authResponse.data?.user?.role;

      if (role === "ADMIN") {
        window.location.href = "/admin";
      } else if (role === "PETUGAS") {
        window.location.href = "/petugas";
      } else {
        window.location.href = "/mahasiswa";
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between bg-blue-950 p-4 sm:p-6 relative overflow-hidden">
      {/* BACKGROUND: Circuit Board Canvas & Radial Lights */}
      <ParticleBackground />
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/[0.08] rounded-full blur-[140px] pointer-events-none z-[2]" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-orange-500/[0.06] rounded-full blur-[140px] pointer-events-none z-[2]" />

      {/* FORM LOGIN (NEO-BRUTALISM CARD) */}
      <div className="flex-1 flex items-center justify-center w-full z-20 my-auto py-6">
        <Card className="w-full max-w-sm bg-white border-4 border-blue-900 shadow-[8px_8px_0px_#1E3A8A] rounded-2xl overflow-hidden relative">
          {/* Header Card: Logo + Identitas */}
          <CardHeader className="space-y-3 text-center pt-8 pb-4 px-6 border-b-2 border-blue-900/20">
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

          {/* Body Form */}
          <CardContent className="pt-6 pb-8 px-6 space-y-5">
            <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
              {/* Field: Username / Email */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-blue-900" />
                  Username / Email
                </Label>
                <Input
                  id="email"
                  placeholder="NIM / Username / Email..."
                  className="h-11 text-sm bg-slate-50 border-2 border-blue-900 text-slate-900 placeholder:text-slate-400 font-bold rounded-lg shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:bg-white"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs font-bold mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Field: Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5 text-blue-900" />
                    Kata Sandi
                  </Label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.info("Silakan hubungi petugas perpustakaan untuk reset kata sandi.");
                    }}
                    className="text-[11px] font-black text-blue-900 hover:text-orange-500 transition-colors uppercase tracking-wider"
                  >
                    Lupa Sandi?
                  </a>
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
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-900 hover:text-orange-500 transition-colors p-1"
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

              {/* Tombol Masuk (Neo-Brutalist Button) */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-sm h-11 rounded-lg border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer uppercase tracking-wider mt-5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Masuk ke Sistem
                  </>
                )}
              </Button>
            </form>

            {/* Pemicu Modal Daftar Akun */}
            <div className="pt-2 text-center text-xs text-slate-600 font-bold">
              Belum punya akun?{" "}
              <button
                type="button"
                onClick={() => setRegisterOpen(true)}
                className="text-orange-500 font-black hover:underline cursor-pointer inline-block ml-1"
              >
                Daftar di sini
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MODAL PENDAFTARAN AKUN */}
      <RegisterDialog open={isRegisterOpen} onOpenChange={setRegisterOpen} />

      {/* FOOTER LOGOS & IDENTITY */}
      <footer className="w-full max-w-md bg-blue-900/60 backdrop-blur-sm border-2 border-blue-800 rounded-xl px-5 py-3.5 flex flex-col items-center gap-3 text-center z-20 shadow-[3px_3px_0px_rgba(0,0,0,0.3)] mt-auto">
        <div className="flex items-center justify-center gap-6">
          <img
            src="/assets/Undana.png"
            alt="Logo Undana"
            className="h-10 w-auto object-contain"
          />
          <img
            src="/assets/Logo_Ilkom.png"
            alt="Logo ILKOM"
            className="h-10 w-auto object-contain"
          />
          <img
            src="/assets/Arthasena.png"
            alt="Logo Arthasena"
            className="h-10 w-auto object-contain"
          />
        </div>
        <p className="text-[10px] tracking-wider font-bold text-blue-200 uppercase">
          Dikelola oleh HMP Ilmu Komputer Kabinet Arthasena
        </p>
      </footer>
    </div>
  );
}

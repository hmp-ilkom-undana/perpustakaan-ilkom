import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
// SCHEMA — Username fleksibel (tanpa .email())
// =============================================================================

const loginSchema = z.object({
  email: z.string().min(1, "Username / Email wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// =============================================================================
// KOMPONEN
// =============================================================================

export default function Login() {
  const navigate = useNavigate();

  const [isRegisterOpen, setRegisterOpen] = useState(false);

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
      navigate("/dashboard");
    }
  };

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between bg-blue-950 p-6 relative overflow-hidden">
      {/* BACKGROUND: Circuit Board Canvas */}
      <ParticleBackground />

      {/* Pendaran cahaya (Radial Blur) - ILKOM Identity */}
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/[0.07] rounded-full blur-[140px] pointer-events-none z-[2]" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-orange-500/[0.05] rounded-full blur-[140px] pointer-events-none z-[2]" />

      {/* Form Login — Tengah layar */}
      <div className="flex-1 flex items-center justify-center w-full z-20">
        <Card className="w-full max-w-sm bg-white border border-blue-50/80 shadow-[0_4px_24px_0_rgba(29,78,216,0.06)] rounded-2xl overflow-hidden relative">
          {/* Header: Logo + Judul */}
          <CardHeader className="space-y-2 text-center pt-9 pb-5 px-6">
            <div className="flex justify-center mb-4">
              <div className="p-3.5 rounded-2xl bg-blue-50/60 ring-1 ring-blue-100/60 shadow-sm shadow-blue-900/5">
                <img
                  src="/assets/Logo_Ilkom.png"
                  alt="Logo Ilmu Komputer"
                  className="h-20 w-auto object-contain mix-blend-multiply"
                />
              </div>
            </div>
            <CardTitle className="text-[17px] font-bold tracking-tight text-zinc-900 leading-snug">
              Sistem Informasi Perpustakaan
              <span className="block mt-0.5">
                <span className="text-blue-700">Ilmu</span>{" "}
                <span className="text-orange-500">Komputer</span>
              </span>
            </CardTitle>
            <p className="text-[11px] text-zinc-400 font-medium tracking-wide pt-1">
              Universitas Nusa Cendana
            </p>
          </CardHeader>

          {/* Form Body */}
          <CardContent className="pb-8 px-6">
            <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
              {/* Input Username / Email */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-[13px] font-bold text-zinc-700"
                >
                  Username / Email
                </Label>
                <Input
                  id="email"
                  placeholder="mahasiswa@gmail.com"
                  className="h-10 text-sm bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 rounded-lg transition-all duration-300"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-[10px] font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Input Password + Lupa Sandi */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-[13px] font-bold text-zinc-700"
                  >
                    Kata Sandi
                  </Label>
                  <a
                    href="#"
                    className="text-[13px] font-semibold text-blue-600 hover:text-orange-500 hover:underline transition-colors duration-300 text-right"
                  >
                    Lupa Sandi?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-10 bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 rounded-lg transition-all duration-300"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-[10px] font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Tombol Masuk */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-700 hover:bg-blue-800 active:scale-[0.98] text-white font-semibold h-10 rounded-lg shadow-sm shadow-blue-700/20 transition-all duration-300 cursor-pointer mt-4"
              >
                {isSubmitting ? "Memverifikasi..." : "Masuk"}
              </Button>
            </form>

            {/* Pemicu Dialog Register */}
            <div className="mt-6 text-center text-[13px] text-zinc-500 font-medium">
              Belum punya akun?{" "}
              <button
                type="button"
                onClick={() => setRegisterOpen(true)}
                className="text-blue-700 font-bold hover:text-orange-500 hover:underline transition-colors duration-300 cursor-pointer"
              >
                Daftar di sini
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Register Dialog (Pemisahan Concern) */}
      <RegisterDialog open={isRegisterOpen} onOpenChange={setRegisterOpen} />

      {/* Footer Logo */}
      <footer className="w-full max-w-md border-t border-white/10 pt-5 pb-3 flex flex-col items-center gap-4 text-center z-20">
        <div className="flex items-center justify-center gap-6">
          <img
            src="/assets/Undana.png"
            alt="Logo Undana"
            className="h-14 w-auto object-contain"
          />
          <img
            src="/assets/Logo_Ilkom.png"
            alt="Logo ILKOM"
            className="h-14 w-auto object-contain"
          />
          <img
            src="/assets/Arthasena.png"
            alt="Logo Arthasena"
            className="h-21 w-auto object-contain"
          />
        </div>
        <p className="text-[10px] tracking-wide font-medium text-zinc-400 uppercase">
          Dikelola oleh HMP Ilmu Komputer Kabinet Arthasena
        </p>
      </footer>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authClient } from "../lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// 1. ATURAN VALIDASI DATA (ZOD SCHEMA)
const loginSchema = z.object({
  email: z.string().email("Format email wajib valid (contoh: nama@undana.ac.id)"),
  password: z.string().min(1, "Password wajib diisi"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState<string | null>(null);

  // 2. MANAGEMENT STATE FORMULIR 
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  // 3. SUBMIT HANDLER
  const onSubmit = async (values: LoginFormValues) => {
    setGlobalError(null);
    try {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setGlobalError(error.message || "Gagal masuk. Periksa kembali akun Anda.");
      } else {
        // Jika otentikasi berhasil, arahkan ke rute katalog
        navigate("/katalog");
      }
    } catch (err) {
      setGlobalError("Koneksi ke server gagal. Sila coba beberapa saat lagi.");
    }
  };

  // 4. STRUKTUR UI 
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 p-4">
      <Card className="w-full max-w-sm bg-white border-zinc-200 shadow-md rounded-lg">
        
        {/* Bagian Atas: Identitas Logo & Judul */}
        <CardHeader className="space-y-2 text-center pb-4">
          <div className="flex justify-center justify-items-center mb-1">
            {/* Placeholder Logo Kampus / ILKOM */}
            <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-blue-600 to-orange-500 flex items-center justify-center text-white font-black text-sm shadow-sm">
              ILKOM
            </div>
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-zinc-900">
            Sistem Informasi Perpustakaan
          </CardTitle>
          <CardDescription className="text-xs text-zinc-500">
            Gunakan Akun SIAKAD atau Email Resmi Undana
          </CardDescription>
        </CardHeader>

        {/* Bagian Utama: Input Form */}
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Warning Error Komunikasi Server */}
            {globalError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-xs font-medium">
                {globalError}
              </div>
            )}

            {/* Kolom Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-zinc-700">
                Alamat Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@undana.ac.id"
                className="bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-blue-600 h-9 rounded-md text-sm"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-xs font-medium mt-0.5">{errors.email.message}</p>
              )}
            </div>

            {/* Kolom Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-zinc-700">
                Kata Sandi
              </Label>
              <Input
                id="password"
                type="password"
                className="bg-white border-zinc-300 text-zinc-900 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-blue-600 h-9 rounded-md"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-xs font-medium mt-0.5">{errors.password.message}</p>
              )}
            </div>

            {/* Tombol Eksekusi Login */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200 h-9 rounded-md mt-2 shadow-sm focus-visible:ring-2 focus-visible:ring-orange-500 active:scale-[0.98]"
            >
              {isSubmitting ? "Memverifikasi..." : "Masuk"}
            </Button>

          </form>
        </CardContent>

      </Card>
    </div>
  );
}
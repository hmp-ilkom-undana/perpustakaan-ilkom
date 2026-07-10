import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// =============================================================================
// SCHEMA
// =============================================================================

const registerSchema = z
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
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

// =============================================================================
// PROPS
// =============================================================================

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// =============================================================================
// KOMPONEN
// =============================================================================

export default function RegisterDialog({
  open,
  onOpenChange,
}: RegisterDialogProps) {
  const [registerError, setRegisterError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      nim: "",
      wa_number: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      reset();
      setRegisterError(null);
    }
  };

  const onSubmit = async (values: RegisterFormValues) => {
    setRegisterError(null);
    try {
      const { error } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
        nim: values.nim,
        username: values.username,
        wa_number: values.wa_number,
      });
      if (error) {
        setRegisterError(
          error.message || "Gagal mendaftar. Email mungkin sudah digunakan.",
        );
      } else {
        handleOpenChange(false);
        alert(
          "Pendaftaran berhasil! Silakan login menggunakan akun baru Anda.",
        );
      }
    } catch {
      setRegisterError("Koneksi ke server gagal. Coba beberapa saat lagi.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border border-zinc-200 shadow-[0_8px_32px_rgba(37,99,235,0.06)] rounded-2xl">
        <DialogHeader className="pt-2">
          <DialogTitle className="flex justify-center text-base font-bold text-zinc-900 tracking-tight">
            Buat Akun Baru
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500 font-medium">
            Lengkapi data berikut untuk mendaftar ke sistem perpustakaan ILKOM.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-1">
          {registerError && (
            <div className="p-2.5 bg-red-50 text-red-600 text-xs rounded-md border border-red-200 font-medium">
              {registerError}
            </div>
          )}
          {/* Nama */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-zinc-700">Nama</Label>
            <Input
              placeholder="Masukkan nama anda..."
              className="h-9 text-sm bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 rounded-lg transition-all duration-300"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-[10px] font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* NIM */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-zinc-700">NIM</Label>
            <Input
              placeholder="Masukkan NIM anda..."
              className="h-9 text-sm bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 rounded-lg transition-all duration-300"
              {...register("nim")}
            />
            {errors.nim && (
              <p className="text-red-500 text-[10px] font-medium">
                {errors.nim.message}
              </p>
            )}
          </div>

          {/* WA Number */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-zinc-700">
              Nomor WA
            </Label>
            <Input
              placeholder="Masukkan nomor WA anda..."
              className="h-9 text-sm bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 rounded-lg transition-all duration-300"
              {...register("wa_number")}
            />
            {errors.wa_number && (
              <p className="text-red-500 text-[10px] font-medium">
                {errors.wa_number.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-zinc-700">Email</Label>
            <Input
              type="email"
              placeholder="mahasiswa@gmail.com"
              className="h-9 text-sm bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 rounded-lg transition-all duration-300"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-[10px] font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-blue-950 font-medium">
              Username
            </Label>
            <Input
              id="username"
              placeholder="Masukan username anda... "
              {...register("username")}
              className={errors.username ? "border-red-500" : ""}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-zinc-700">
              Kata Sandi
            </Label>
            <Input
              type="password"
              placeholder="Min. 8 karakter"
              className="h-9 text-sm bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 rounded-lg transition-all duration-300"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-[10px] font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-zinc-700">
              Konfirmasi Sandi
            </Label>
            <Input
              type="password"
              placeholder="Ulangi kata sandi"
              className="h-9 text-sm bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 rounded-lg transition-all duration-300"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-[10px] font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Button Daftar Akun */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-700 hover:bg-blue-800 active:scale-[0.98] text-white font-semibold h-9 rounded-lg shadow-sm shadow-blue-700/20 transition-all duration-300 cursor-pointer mt-3"
          >
            {isSubmitting ? "Mendaftar..." : "Daftar Akun"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

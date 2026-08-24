import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  UserPlus,
  User,
  Hash,
  Phone,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { authService } from "@/services/auth.service";
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
import { toast } from "sonner";

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
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegisterDialog({ open, onOpenChange }: RegisterDialogProps) {
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
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

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      reset();
      setRegisterError(null);
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  };

  const onSubmit = async (values: RegisterFormValues) => {
    setRegisterError(null);
    try {
      const { error } = await authService.signUpStudent({
        email: values.email,
        password: values.password,
        name: values.name,
        nim: values.nim,
        username: values.username,
        wa_number: values.wa_number,
      });

      if (error) {
        setRegisterError(
          error.message || "Gagal mendaftar. Email atau NIM mungkin sudah terdaftar."
        );
      } else {
        handleOpenChange(false);
        toast.success(
          "Pendaftaran akun berhasil! Silakan masuk menggunakan akun baru Anda."
        );
      }
    } catch {
      setRegisterError("Koneksi ke server gagal. Coba beberapa saat lagi.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white border-4 border-blue-900 shadow-[8px_8px_0px_#1E3A8A] rounded-2xl p-6 max-h-[90vh] overflow-y-auto z-[60]">
        <DialogHeader className="border-b-2 border-blue-900 pb-3 text-center sm:text-left">
          <DialogTitle className="text-lg sm:text-xl font-black text-blue-950 uppercase tracking-tight flex items-center justify-center sm:justify-start gap-2">
            <UserPlus className="w-5 h-5 text-orange-500" />
            Buat Akun Mahasiswa Baru
          </DialogTitle>
          <DialogDescription className="text-xs font-bold text-slate-500">
            Lengkapi data identitas berikut untuk mengakses katalog dan sirkulasi peminjaman.
          </DialogDescription>
        </DialogHeader>

        {registerError && (
          <div className="p-3 bg-red-100 border-2 border-blue-900 rounded-lg text-red-900 font-bold text-xs shadow-[2px_2px_0px_#1E3A8A] flex items-center gap-2 mt-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{registerError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-blue-900" />
              Nama Lengkap
            </Label>
            <Input
              placeholder="Masukkan nama lengkap sesuai KTM..."
              className="h-10 text-sm bg-slate-50 border-2 border-blue-900 text-slate-900 placeholder:text-slate-400 font-bold rounded-lg shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:bg-white"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-600 text-xs font-bold">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <Label className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-blue-900" />
                NIM (10 Digit)
              </Label>
              <Input
                placeholder="2306080001"
                className="h-10 text-sm bg-slate-50 border-2 border-blue-900 text-slate-900 placeholder:text-slate-400 font-bold rounded-lg shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:bg-white"
                {...register("nim")}
              />
              {errors.nim && (
                <p className="text-red-600 text-xs font-bold">
                  {errors.nim.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-blue-900" />
                Username
              </Label>
              <Input
                placeholder="contoh_user"
                className="h-10 text-sm bg-slate-50 border-2 border-blue-900 text-slate-900 placeholder:text-slate-400 font-bold rounded-lg shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:bg-white"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-red-600 text-xs font-bold">
                  {errors.username.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <Label className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-blue-900" />
                Nomor WhatsApp
              </Label>
              <Input
                placeholder="08123456789"
                className="h-10 text-sm bg-slate-50 border-2 border-blue-900 text-slate-900 placeholder:text-slate-400 font-bold rounded-lg shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:bg-white"
                {...register("wa_number")}
              />
              {errors.wa_number && (
                <p className="text-red-600 text-xs font-bold">
                  {errors.wa_number.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-blue-900" />
                Alamat Email
              </Label>
              <Input
                type="email"
                placeholder="nama@gmail.com"
                className="h-10 text-sm bg-slate-50 border-2 border-blue-900 text-slate-900 placeholder:text-slate-400 font-bold rounded-lg shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:bg-white"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-600 text-xs font-bold">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <Label className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-blue-900" />
                Kata Sandi
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 karakter"
                  className="h-10 text-sm bg-slate-50 border-2 border-blue-900 text-slate-900 placeholder:text-slate-400 font-bold rounded-lg shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:bg-white pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
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
                <p className="text-red-600 text-xs font-bold">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-blue-900" />
                Ulangi Kata Sandi
              </Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ulangi kata sandi"
                  className="h-10 text-sm bg-slate-50 border-2 border-blue-900 text-slate-900 placeholder:text-slate-400 font-bold rounded-lg shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:bg-white pr-10"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-900 hover:text-orange-500 transition-colors p-1 cursor-pointer"
                  aria-label={showConfirmPassword ? "Sembunyikan konfirmasi sandi" : "Tampilkan konfirmasi sandi"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-xs font-bold">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="pt-3 border-t-2 border-blue-900/30 flex flex-col sm:flex-row items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="w-full sm:w-1/3 border-2 border-blue-900 font-bold text-blue-900 bg-white shadow-[2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none h-11 uppercase text-xs cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="navy"
              disabled={isSubmitting}
              className="w-full sm:w-2/3 text-white font-black text-sm h-11 rounded-lg border-2 border-blue-900 shadow-[4px_4px_0px_#F97316] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer uppercase tracking-wider"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Mendaftarkan...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Daftarkan Akun
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

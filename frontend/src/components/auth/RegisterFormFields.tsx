import type { UseFormReturn } from "react-hook-form";
import {
  User,
  Hash,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import type { RegisterFormValues } from "@/hooks/useAuthRegister";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegisterFormFieldsProps {
  form: UseFormReturn<RegisterFormValues>;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
}

export function RegisterFormFields({
  form,
  showPassword,
  showConfirmPassword,
  onTogglePassword,
  onToggleConfirmPassword,
}: RegisterFormFieldsProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const passwordValue = watch("password") || "";
  const confirmPasswordValue = watch("confirmPassword") || "";

  const handleNumericKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      [
        "Backspace",
        "Delete",
        "Tab",
        "Escape",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ].includes(e.key) ||
      e.ctrlKey ||
      e.metaKey
    ) {
      return;
    }
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleNumericInput =
    (fieldName: "nim" | "wa_number", maxLength: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitized = e.target.value.replace(/\D/g, "").slice(0, maxLength);
      e.target.value = sanitized;
      setValue(fieldName, sanitized, {
        shouldValidate: true,
        shouldDirty: true,
      });
    };

  const isPasswordValid =
    passwordValue.length >= 8 &&
    /[A-Z]/.test(passwordValue) &&
    /[a-z]/.test(passwordValue) &&
    /[0-9]/.test(passwordValue);

  const hasTypedConfirm = confirmPasswordValue.length > 0;
  const isMatch = hasTypedConfirm && passwordValue === confirmPasswordValue;

  return (
    <div className="space-y-4 pt-2">
      {/* NAMA LENGKAP */}
      <div className="space-y-1">
        <Label
          htmlFor="reg-name"
          className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1"
        >
          <User className="w-3.5 h-3.5 text-blue-900" />
          Nama Lengkap
        </Label>
        <Input
          id="reg-name"
          placeholder="Masukkan nama lengkap sesuai KTM..."
          autoComplete="name"
          className="h-10 text-sm bg-slate-50 border-2 border-blue-900 text-slate-900 placeholder:text-slate-400 font-bold rounded-lg shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:bg-white"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-600 text-xs font-bold">{errors.name.message}</p>
        )}
      </div>

      {/* NIM & USERNAME */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1">
          <Label
            htmlFor="reg-nim"
            className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1"
          >
            <Hash className="w-3.5 h-3.5 text-blue-900" />
            NIM (10 Digit)
          </Label>
          <Input
            id="reg-nim"
            inputMode="numeric"
            maxLength={10}
            placeholder="2306080001"
            className="h-10 text-sm bg-slate-50 border-2 border-blue-900 text-slate-900 placeholder:text-slate-400 font-bold rounded-lg shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:bg-white"
            {...register("nim", {
              onChange: handleNumericInput("nim", 10),
            })}
            onKeyDown={handleNumericKeyDown}
          />
          {errors.nim && (
            <p className="text-red-600 text-xs font-bold">{errors.nim.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label
            htmlFor="reg-username"
            className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1"
          >
            <User className="w-3.5 h-3.5 text-blue-900" />
            Username
          </Label>
          <Input
            id="reg-username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
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

      {/* NO WA & EMAIL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1">
          <Label
            htmlFor="reg-wa"
            className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1"
          >
            <Phone className="w-3.5 h-3.5 text-blue-900" />
            Nomor WhatsApp
          </Label>
          <Input
            id="reg-wa"
            type="tel"
            inputMode="tel"
            maxLength={14}
            placeholder="08123456789"
            className="h-10 text-sm bg-slate-50 border-2 border-blue-900 text-slate-900 placeholder:text-slate-400 font-bold rounded-lg shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:bg-white"
            {...register("wa_number", {
              onChange: handleNumericInput("wa_number", 14),
            })}
            onKeyDown={handleNumericKeyDown}
          />
          {errors.wa_number && (
            <p className="text-red-600 text-xs font-bold">
              {errors.wa_number.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label
            htmlFor="reg-email"
            className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1"
          >
            <Mail className="w-3.5 h-3.5 text-blue-900" />
            Alamat Email
          </Label>
          <Input
            id="reg-email"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
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

      {/* KATA SANDI & ULANGI KATA SANDI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1">
          <Label
            htmlFor="reg-password"
            className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1"
          >
            <Lock className="w-3.5 h-3.5 text-blue-900" />
            Kata Sandi
          </Label>
          <div className="relative">
            <Input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Min. 8 karakter"
              className="h-10 text-sm bg-slate-50 border-2 border-blue-900 text-slate-900 placeholder:text-slate-400 font-bold rounded-lg shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:bg-white pr-10"
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
          {errors.password ? (
            <p className="text-red-600 text-xs font-bold">
              {errors.password.message}
            </p>
          ) : isPasswordValid ? (
            <p className="text-emerald-700 text-xs font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Kata sandi memenuhi syarat
            </p>
          ) : (
            <p className="text-slate-500 text-[11px] font-bold">
              Min. 8 karakter (huruf besar, kecil, & angka)
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label
            htmlFor="reg-confirm-password"
            className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1"
          >
            <Lock className="w-3.5 h-3.5 text-blue-900" />
            Ulangi Kata Sandi
          </Label>
          <div className="relative">
            <Input
              id="reg-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Ulangi kata sandi"
              className="h-10 text-sm bg-slate-50 border-2 border-blue-900 text-slate-900 placeholder:text-slate-400 font-bold rounded-lg shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:bg-white pr-10"
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
          {hasTypedConfirm ? (
            isMatch ? (
              <p className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Kata sandi cocok
              </p>
            ) : (
              <p className="text-red-600 text-xs font-bold">
                Konfirmasi kata sandi belum sama
              </p>
            )
          ) : errors.confirmPassword ? (
            <p className="text-red-600 text-xs font-bold">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

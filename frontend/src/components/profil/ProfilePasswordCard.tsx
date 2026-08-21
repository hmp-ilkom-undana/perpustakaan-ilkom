import {
  KeyRound,
  Eye,
  EyeOff,
  Lock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PasswordStrength } from "@/hooks/useStudentProfile";

interface ProfilePasswordCardProps {
  currentPassword: string;
  setCurrentPassword: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  showCurrent: boolean;
  setShowCurrent: (val: boolean) => void;
  showNew: boolean;
  setShowNew: (val: boolean) => void;
  showConfirm: boolean;
  setShowConfirm: (val: boolean) => void;
  passwordStrength: PasswordStrength;
  canSubmitPassword: boolean;
  isChangingPassword: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function ProfilePasswordCard({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showCurrent,
  setShowCurrent,
  showNew,
  setShowNew,
  showConfirm,
  setShowConfirm,
  passwordStrength,
  canSubmitPassword,
  isChangingPassword,
  onSubmit,
}: ProfilePasswordCardProps) {
  return (
    <Card className="border-2 border-blue-900 shadow-[5px_5px_0px_#1E3A8A] rounded-lg">
      <CardHeader className="border-b-2 border-blue-900 bg-rose-50/50 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-black text-rose-950">
          <KeyRound className="w-5 h-5 text-rose-800" />
          Keamanan & Ganti Kata Sandi
        </CardTitle>
        <CardDescription className="text-xs text-slate-600 font-medium">
          Ganti kata sandi secara berkala untuk menjaga keamanan akun Anda.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="space-y-4">
          {/* 1. Kata Sandi Saat Ini (Current Password) */}
          <div className="space-y-2">
            <Label
              htmlFor="current-pass"
              className="text-xs font-bold text-blue-950 uppercase tracking-wider"
            >
              Kata Sandi Saat Ini <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="current-pass"
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan kata sandi lama Anda"
                required
                className="border-2 border-blue-900 rounded-md font-semibold text-sm pr-10 focus-visible:ring-blue-900"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-900 cursor-pointer"
              >
                {showCurrent ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* 2. Kata Sandi Baru (New Password) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="new-pass"
                className="text-xs font-bold text-blue-950 uppercase tracking-wider"
              >
                Kata Sandi Baru <span className="text-red-500">*</span>
              </Label>
              {newPassword && (
                <span
                  className={`text-[11px] font-black ${passwordStrength.text}`}
                >
                  Kekuatan: {passwordStrength.label}
                </span>
              )}
            </div>
            <div className="relative">
              <Input
                id="new-pass"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
                className="border-2 border-blue-900 rounded-md font-semibold text-sm pr-10 focus-visible:ring-blue-900"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-900 cursor-pointer"
              >
                {showNew ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Meteran Kekuatan Sandi */}
            {newPassword && (
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <div
                  className={`h-1.5 rounded-full ${
                    passwordStrength.score >= 1
                      ? passwordStrength.color
                      : "bg-slate-200"
                  }`}
                />
                <div
                  className={`h-1.5 rounded-full ${
                    passwordStrength.score >= 2
                      ? passwordStrength.color
                      : "bg-slate-200"
                  }`}
                />
                <div
                  className={`h-1.5 rounded-full ${
                    passwordStrength.score >= 3
                      ? passwordStrength.color
                      : "bg-slate-200"
                  }`}
                />
              </div>
            )}

            {newPassword &&
              currentPassword &&
              newPassword === currentPassword && (
                <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Sandi baru tidak
                  boleh sama dengan sandi saat ini
                </p>
              )}
          </div>

          {/* 3. Konfirmasi Kata Sandi Baru */}
          <div className="space-y-2">
            <Label
              htmlFor="confirm-pass"
              className="text-xs font-bold text-blue-950 uppercase tracking-wider"
            >
              Konfirmasi Kata Sandi Baru <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirm-pass"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                required
                className="border-2 border-blue-900 rounded-md font-semibold text-sm pr-10 focus-visible:ring-blue-900"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-900 cursor-pointer"
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {confirmPassword && (
              <div className="text-[11px] font-bold flex items-center gap-1">
                {newPassword === confirmPassword ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Kata sandi cocok
                  </span>
                ) : (
                  <span className="text-rose-600 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Kata sandi belum
                    cocok
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Tombol Perbarui Kata Sandi */}
          <Button
            type="submit"
            disabled={!canSubmitPassword}
            className={`w-full font-bold border-2 rounded-md transition-all mt-4 ${
              canSubmitPassword
                ? "bg-rose-600 hover:bg-rose-700 text-white border-blue-900 cursor-pointer shadow-[3px_3px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                : "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            <Lock className="w-4 h-4 mr-2" />
            {isChangingPassword
              ? "Memperbarui Kata Sandi..."
              : "Perbarui Kata Sandi"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

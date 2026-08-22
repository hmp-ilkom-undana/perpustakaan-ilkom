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
import type { PasswordStrength } from "@/hooks/usePetugasProfile";

interface PetugasPasswordCardProps {
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

export function PetugasPasswordCard({
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
}: PetugasPasswordCardProps) {
  return (
    <Card className="border-2 border-blue-900 shadow-[5px_5px_0px_#1E3A8A] rounded-lg">
      <CardHeader className="border-b-2 border-blue-900 bg-rose-50/50 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-black text-rose-950">
          <KeyRound className="w-5 h-5 text-rose-800" />
          Keamanan & Ganti Kata Sandi
        </CardTitle>
        <CardDescription className="text-xs text-slate-600 font-medium">
          Ganti kata sandi secara berkala untuk menjaga integritas akun petugas perpustakaan.
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
              Kata Sandi Saat Ini <span className="text-rose-600">*</span>
            </Label>
            <div className="relative">
              <Input
                id="current-pass"
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan kata sandi lama Anda"
                required
                disabled={isChangingPassword}
                className="border-2 border-blue-900 rounded-md font-semibold text-sm pr-10 focus-visible:ring-blue-900"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-900 cursor-pointer p-1"
                title={showCurrent ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
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
                Kata Sandi Baru <span className="text-rose-600">*</span>
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
                disabled={isChangingPassword}
                className="border-2 border-blue-900 rounded-md font-semibold text-sm pr-10 focus-visible:ring-blue-900"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-900 cursor-pointer p-1"
                title={showNew ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
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
              Konfirmasi Kata Sandi Baru <span className="text-rose-600">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirm-pass"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                required
                disabled={isChangingPassword}
                className="border-2 border-blue-900 rounded-md font-semibold text-sm pr-10 focus-visible:ring-blue-900"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-900 cursor-pointer p-1"
                title={showConfirm ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
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
                    <AlertTriangle className="w-3.5 h-3.5" /> Kata sandi belum cocok
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Tombol Perbarui Kata Sandi */}
          <Button
            type="submit"
            disabled={!canSubmitPassword}
            variant="destructive"
            className="w-full font-bold border-2 rounded-md transition-all mt-4"
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

import React, { useState, useMemo } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { userService } from "@/services/user.service";
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  ShieldAlert, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Save, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Calendar,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export default function AdminProfil() {
  const { data: session } = useSession();
  const user = session?.user;

  // Profile Info States
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Synchronize initial data if session loads asynchronously
  const isInitialized = React.useRef(false);
  React.useEffect(() => {
    if (user && !isInitialized.current) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      isInitialized.current = true;
    }
  }, [user]);

  // Password Change States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Check if profile inputs are modified from original session data
  const isProfileDirty = useMemo(() => {
    const originalName = (user?.name || "").trim();
    const originalEmail = (user?.email || "").trim().toLowerCase();
    const currentName = name.trim();
    const currentEmail = email.trim().toLowerCase();

    return currentName !== originalName || currentEmail !== originalEmail;
  }, [name, email, user?.name, user?.email]);

  const isProfileValid = name.trim().length > 0 && email.trim().length > 0 && email.includes("@");
  const canSubmitProfile = isProfileDirty && isProfileValid && !isUpdatingProfile;

  // Calculate Password Strength
  const passwordStrength = useMemo(() => {
    if (!newPassword) return { score: 0, label: "Kosong", color: "bg-slate-200" };
    let score = 0;
    if (newPassword.length >= 6) score += 1;
    if (newPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;

    if (score <= 2) return { score: 1, label: "Lemah", color: "bg-rose-500", text: "text-rose-600" };
    if (score <= 4) return { score: 2, label: "Sedang", color: "bg-amber-500", text: "text-amber-600" };
    return { score: 3, label: "Sangat Kuat", color: "bg-emerald-500", text: "text-emerald-600" };
  }, [newPassword]);

  // Check if password inputs are completely filled, meet requirements, match, and differ from current password
  const canSubmitPassword = useMemo(() => {
    const hasCurrent = currentPassword.trim().length > 0;
    const hasValidNew = newPassword.length >= 6;
    const isMatching = newPassword === confirmPassword;
    const isDifferentFromCurrent = currentPassword !== newPassword;

    return hasCurrent && hasValidNew && isMatching && isDifferentFromCurrent && !isChangingPassword;
  }, [currentPassword, newPassword, confirmPassword, isChangingPassword]);

  // Handlers
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitProfile) return;

    try {
      setIsUpdatingProfile(true);
      if (user?.id) {
        await userService.updateProfile(user.id, { 
          name: name.trim(),
          email: email.trim().toLowerCase()
        });
      }
      toast.success("Biodata dan email administrator berhasil diperbarui!", {
        duration: 4000,
      });
      // Berikan waktu yang cukup agar notifikasi terbaca sebelum sinkronisasi sesi
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Gagal memperbarui profil";
      toast.error(msg, { duration: 4000 });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitPassword) return;

    try {
      setIsChangingPassword(true);
      const res = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (res.error) {
        toast.error(res.error.message || "Kata sandi lama yang Anda masukkan salah", {
          duration: 4500,
        });
        return;
      }

      toast.success("Kata sandi berhasil diubah! Sesi login Anda telah diamankan.", {
        duration: 4500,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const msg = err.message || "Gagal mengganti kata sandi";
      toast.error(msg, { duration: 4500 });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Avatar Initials
  const initials = (user?.name || name || "Admin")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* HEADER CARD (NEO-BRUTALIST) */}
      <div className="bg-white border-2 border-blue-900 rounded-lg p-6 [box-shadow:6px_6px_0px_#1E3A8A] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-5 z-10">
          {/* Avatar with Royal Purple Theme */}
          <div className="w-20 h-20 rounded-lg border-2 border-blue-900 bg-purple-200 text-purple-950 flex items-center justify-center font-black text-2xl shrink-0 [box-shadow:3px_3px_0px_#1E3A8A]">
            {initials}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-black text-blue-950 tracking-tight">
                {user?.name || name || "Administrator"}
              </h1>
              <Badge 
                variant="outline" 
                className="bg-purple-100 text-purple-950 border-2 border-blue-900 font-black text-xs px-2.5 py-0.5 [box-shadow:2px_2px_0px_#1E3A8A] flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-purple-700" />
                Administrator Perpustakaan
              </Badge>
            </div>
            <p className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-900" />
              {user?.email || email || "admin@ilkom.com"}
            </p>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Akun Hak Akses Utama Sistem
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-blue-50 border-2 border-blue-900 rounded-md px-4 py-2.5 [box-shadow:3px_3px_0px_#1E3A8A]">
          <Sparkles className="w-5 h-5 text-blue-900 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-blue-950">Panel Pengaturan Akun</p>
            <p className="text-slate-600 font-medium">Kelola identitas dan keamanan kata sandi</p>
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID: BIODATA & CHANGE PASSWORD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* CARD 1: INFORMASI PROFIL & BIODATA */}
        <Card className="border-2 border-blue-900 [box-shadow:5px_5px_0px_#1E3A8A] rounded-lg">
          <CardHeader className="border-b-2 border-blue-900 bg-blue-50/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-black text-blue-950">
              <User className="w-5 h-5 text-blue-900" />
              Informasi Biodata Profil
            </CardTitle>
            <CardDescription className="text-xs text-slate-600 font-medium">
              Ubah nama tampilan dan alamat email resmi administrator.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name" className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                  Nama Lengkap Administrator <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="admin-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  required
                  className="border-2 border-blue-900 rounded-md font-semibold text-sm focus-visible:ring-blue-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                  Alamat Email (Akun Login & Notifikasi) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contoh: hmp.ilkom@undana.ac.id"
                    required
                    className="border-2 border-blue-900 rounded-md font-semibold text-sm focus-visible:ring-blue-900"
                  />
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Anda dapat mengganti email ini dengan email resmi HMP. Email baru akan digunakan untuk login berikutnya.
                </p>
              </div>

              <div className="p-3 bg-amber-50 border-2 border-amber-200 rounded-md text-xs text-amber-900 font-medium flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Perubahan nama dan email akan langsung disinkronkan ke seluruh sistem dan session login Anda.
                </span>
              </div>

              <Button
                type="submit"
                disabled={!canSubmitProfile}
                className={`w-full font-bold border-2 rounded-md transition-all mt-4 ${
                  canSubmitProfile
                    ? "bg-blue-900 hover:bg-blue-800 text-white border-blue-900 cursor-pointer [box-shadow:3px_3px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A]"
                    : "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed [box-shadow:none]"
                }`}
              >
                <Save className="w-4 h-4 mr-2" />
                {isUpdatingProfile ? "Menyimpan Perubahan..." : "Simpan Perubahan Profil"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* CARD 2: GANTI KATA SANDI (SECURITY) */}
        <Card className="border-2 border-blue-900 [box-shadow:5px_5px_0px_#1E3A8A] rounded-lg">
          <CardHeader className="border-b-2 border-blue-900 bg-rose-50/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-black text-rose-950">
              <KeyRound className="w-5 h-5 text-rose-800" />
              Keamanan & Ganti Kata Sandi
            </CardTitle>
            <CardDescription className="text-xs text-slate-600 font-medium">
              Pastikan kata sandi Anda kuat untuk melindungi hak akses pengelolaan perpustakaan.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="current-pass" className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                  Kata Sandi Saat Ini <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="current-pass"
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan sandi lama Anda"
                    required
                    className="border-2 border-blue-900 rounded-md font-semibold text-sm pr-10 focus-visible:ring-blue-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-900 cursor-pointer"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="new-pass" className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                    Kata Sandi Baru <span className="text-red-500">*</span>
                  </Label>
                  {newPassword && (
                    <span className={`text-[11px] font-black ${passwordStrength.text}`}>
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
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Strength Meter Bar */}
                {newPassword && (
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    <div className={`h-1.5 rounded-full ${passwordStrength.score >= 1 ? passwordStrength.color : "bg-slate-200"}`} />
                    <div className={`h-1.5 rounded-full ${passwordStrength.score >= 2 ? passwordStrength.color : "bg-slate-200"}`} />
                    <div className={`h-1.5 rounded-full ${passwordStrength.score >= 3 ? passwordStrength.color : "bg-slate-200"}`} />
                  </div>
                )}
                {newPassword && currentPassword && newPassword === currentPassword && (
                  <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Sandi baru tidak boleh sama dengan sandi saat ini
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirm-pass" className="text-xs font-bold text-blue-950 uppercase tracking-wider">
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
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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

              <Button
                type="submit"
                disabled={!canSubmitPassword}
                className={`w-full font-bold border-2 rounded-md transition-all mt-4 ${
                  canSubmitPassword
                    ? "bg-rose-600 hover:bg-rose-700 text-white border-blue-900 cursor-pointer [box-shadow:3px_3px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A]"
                    : "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed [box-shadow:none]"
                }`}
              >
                <Lock className="w-4 h-4 mr-2" />
                {isChangingPassword ? "Memperbarui Kata Sandi..." : "Perbarui Kata Sandi"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

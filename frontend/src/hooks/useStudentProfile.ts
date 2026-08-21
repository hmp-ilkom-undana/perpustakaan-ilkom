import { useState, useMemo, useEffect, useRef } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { userService } from "@/services/user.service";
import { toast } from "sonner";

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  text: string;
}

export function useStudentProfile() {
  const { data: session, isPending: isSessionLoading } = useSession();
  const user = session?.user as any;

  // 1. BIODATA STATES
  const [name, setName] = useState(user?.name || "");
  const [waNumber, setWaNumber] = useState(user?.wa_number || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Synchronize initial data once session resolves
  const isInitialized = useRef(false);
  useEffect(() => {
    if (user && !isInitialized.current) {
      if (user.name) setName(user.name);
      if (user.wa_number) setWaNumber(user.wa_number);
      isInitialized.current = true;
    }
  }, [user]);

  // 2. PASSWORD STATES
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 3. BIODATA DIRTY CHECK & VALIDATION
  const isProfileDirty = useMemo(() => {
    const originalName = (user?.name || "").trim();
    const originalWa = (user?.wa_number || "").trim();
    const currentNameInput = name.trim();
    const currentWaInput = waNumber.trim();

    return (
      currentNameInput !== originalName || currentWaInput !== originalWa
    );
  }, [name, waNumber, user?.name, user?.wa_number]);

  const isProfileValid = name.trim().length > 0;
  const canSubmitProfile =
    isProfileDirty && isProfileValid && !isUpdatingProfile;

  // 4. PASSWORD STRENGTH & VALIDATION
  const passwordStrength: PasswordStrength = useMemo(() => {
    if (!newPassword) {
      return { score: 0, label: "Kosong", color: "bg-slate-200", text: "text-slate-500" };
    }
    let score = 0;
    if (newPassword.length >= 6) score += 1;
    if (newPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;

    if (score <= 2) {
      return { score: 1, label: "Lemah", color: "bg-rose-500", text: "text-rose-600" };
    }
    if (score <= 4) {
      return { score: 2, label: "Sedang", color: "bg-amber-500", text: "text-amber-600" };
    }
    return { score: 3, label: "Sangat Kuat", color: "bg-emerald-500", text: "text-emerald-600" };
  }, [newPassword]);

  const canSubmitPassword = useMemo(() => {
    const hasCurrent = currentPassword.trim().length > 0;
    const hasValidNew = newPassword.length >= 6;
    const isMatching = newPassword === confirmPassword;
    const isDifferentFromCurrent = currentPassword !== newPassword;

    return (
      hasCurrent &&
      hasValidNew &&
      isMatching &&
      isDifferentFromCurrent &&
      !isChangingPassword
    );
  }, [currentPassword, newPassword, confirmPassword, isChangingPassword]);

  // 5. HANDLERS
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitProfile || !user?.id) return;

    try {
      setIsUpdatingProfile(true);
      await userService.updateProfile(user.id, {
        name: name.trim(),
        wa_number: waNumber.trim(),
      });

      toast.success("Biodata profil berhasil diperbarui!", {
        duration: 3000,
      });

      // Berikan jeda sejenak lalu reload agar session user diperbarui
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Gagal memperbarui profil";
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
        toast.error(
          res.error.message || "Kata sandi saat ini yang Anda masukkan salah.",
          { duration: 4500 }
        );
        return;
      }

      toast.success(
        "Kata sandi berhasil diubah! Sesi akun Anda telah diamankan.",
        { duration: 4500 }
      );
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
  const initials = (user?.name || name || "Mahasiswa")
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return {
    user,
    isSessionLoading,
    initials,
    // Biodata Form
    name,
    setName,
    waNumber,
    setWaNumber,
    isProfileDirty,
    canSubmitProfile,
    isUpdatingProfile,
    handleUpdateProfile,
    // Password Form
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
    handleChangePassword,
  };
}

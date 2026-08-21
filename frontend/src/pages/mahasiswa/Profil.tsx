import { Loader2 } from "lucide-react";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { ProfileHeaderCard } from "@/components/profil/ProfileHeaderCard";
import { ProfileBiodataCard } from "@/components/profil/ProfileBiodataCard";
import { ProfilePasswordCard } from "@/components/profil/ProfilePasswordCard";

export default function Profil() {
  const profile = useStudentProfile();

  if (profile.isSessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
        <p className="text-xs font-bold text-slate-500">Memuat profil akun...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 sm:p-0">
      {/* 1. Profile Header Hero */}
      <ProfileHeaderCard
        name={profile.user?.name || profile.name}
        nim={profile.user?.nim}
        email={profile.user?.email}
        initials={profile.initials}
      />

      {/* 2. Grid Dua Kolom: Biodata & Keamanan Kata Sandi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Kolom Kiri: Formulir Biodata & WhatsApp */}
        <ProfileBiodataCard
          name={profile.name}
          setName={profile.setName}
          waNumber={profile.waNumber}
          setWaNumber={profile.setWaNumber}
          nim={profile.user?.nim}
          email={profile.user?.email}
          canSubmitProfile={profile.canSubmitProfile}
          isProfileDirty={profile.isProfileDirty}
          isUpdatingProfile={profile.isUpdatingProfile}
          onSubmit={profile.handleUpdateProfile}
        />

        {/* Kolom Kanan: Formulir Ganti Kata Sandi */}
        <ProfilePasswordCard
          currentPassword={profile.currentPassword}
          setCurrentPassword={profile.setCurrentPassword}
          newPassword={profile.newPassword}
          setNewPassword={profile.setNewPassword}
          confirmPassword={profile.confirmPassword}
          setConfirmPassword={profile.setConfirmPassword}
          showCurrent={profile.showCurrent}
          setShowCurrent={profile.setShowCurrent}
          showNew={profile.showNew}
          setShowNew={profile.setShowNew}
          showConfirm={profile.showConfirm}
          setShowConfirm={profile.setShowConfirm}
          passwordStrength={profile.passwordStrength}
          canSubmitPassword={profile.canSubmitPassword}
          isChangingPassword={profile.isChangingPassword}
          onSubmit={profile.handleChangePassword}
        />
      </div>
    </div>
  );
}

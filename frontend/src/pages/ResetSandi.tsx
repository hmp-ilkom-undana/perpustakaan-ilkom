import { useAuthResetPassword } from "@/hooks/useAuthResetPassword";
import { AuthBackground, AuthFooter, ResetPasswordCard } from "@/components/auth";

export default function ResetSandi() {
  const {
    form,
    hasToken,
    showPassword,
    showConfirmPassword,
    isResetSuccess,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    onSubmit,
  } = useAuthResetPassword();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between bg-blue-950 p-4 sm:p-6 relative overflow-hidden">
      <AuthBackground />

      <main className="flex-1 flex items-center justify-center w-full z-20 my-auto py-6">
        <ResetPasswordCard
          form={form}
          hasToken={hasToken}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          isResetSuccess={isResetSuccess}
          onTogglePassword={togglePasswordVisibility}
          onToggleConfirmPassword={toggleConfirmPasswordVisibility}
          onSubmit={onSubmit}
        />
      </main>

      <AuthFooter />
    </div>
  );
}

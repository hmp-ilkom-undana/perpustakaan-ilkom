import { useAuthForgotPassword } from "@/hooks/useAuthForgotPassword";
import { AuthBackground, AuthFooter, ForgotPasswordCard } from "@/components/auth";

export default function LupaSandi() {
  const {
    form,
    isSubmitted,
    submittedEmail,
    countdown,
    resetFormState,
    handleResendEmail,
    onSubmit,
  } = useAuthForgotPassword();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between bg-blue-950 p-4 sm:p-6 relative overflow-hidden">
      <AuthBackground />

      <main className="flex-1 flex items-center justify-center w-full z-20 my-auto py-6">
        <ForgotPasswordCard
          form={form}
          isSubmitted={isSubmitted}
          submittedEmail={submittedEmail}
          countdown={countdown}
          onResendEmail={handleResendEmail}
          onResetForm={resetFormState}
          onSubmit={onSubmit}
        />
      </main>

      <AuthFooter />
    </div>
  );
}

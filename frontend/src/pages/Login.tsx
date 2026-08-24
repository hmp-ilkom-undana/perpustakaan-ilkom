import { useAuthLogin } from "@/hooks/useAuthLogin";
import {
  AuthBackground,
  AuthFooter,
  LoginFormCard,
  RegisterDialog,
} from "@/components/auth";

export default function Login() {
  const {
    form,
    isRegisterOpen,
    setRegisterOpen,
    showPassword,
    togglePasswordVisibility,
    isRedirecting,
    onLogin,
  } = useAuthLogin();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between bg-blue-950 p-4 sm:p-6 relative overflow-hidden">
      <AuthBackground />

      <main className="flex-1 flex items-center justify-center w-full z-20 my-auto py-6">
        <LoginFormCard
          form={form}
          onLogin={onLogin}
          showPassword={showPassword}
          onTogglePassword={togglePasswordVisibility}
          isRedirecting={isRedirecting}
          onOpenRegister={() => setRegisterOpen(true)}
        />
      </main>

      <RegisterDialog
        open={isRegisterOpen}
        onOpenChange={setRegisterOpen}
      />

      <AuthFooter />
    </div>
  );
}

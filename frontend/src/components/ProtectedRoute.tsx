import { Navigate } from "react-router-dom";
import { useSession } from "@/lib/auth-client";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isPending } = useSession();

  if (isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-950">
        <p className="text-white font-medium animate-pulse">
          Memverifikasi sesi Anda...
        </p>
      </div>
    );
  }

  if (!data) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

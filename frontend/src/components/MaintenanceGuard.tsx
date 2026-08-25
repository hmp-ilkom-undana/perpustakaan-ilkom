import React, { ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";
import { useSystemSettingQuery } from "@/hooks/queries/useSettingQuery";
import { useSession } from "@/lib/auth-client";

interface MaintenanceGuardProps {
  children?: ReactNode;
}

export default function MaintenanceGuard({ children }: MaintenanceGuardProps) {
  const { data: setting, isLoading } = useSystemSettingQuery();
  const { data: session } = useSession();

  if (isLoading || !setting) {
    return <>{children}</>;
  }

  if (setting.isMaintenanceActive) {
    const userRole = (session?.user as any)?.role;
    const isAdminOrPetugas = userRole === "ADMIN" || userRole === "PETUGAS";

    if (setting.allowAdminBypass && isAdminOrPetugas) {
      return <>{children}</>;
    }

    return <Navigate to="/maintenance" replace />;
  }

  return <>{children}</>;
}

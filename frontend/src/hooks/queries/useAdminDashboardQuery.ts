import { useQuery } from "@tanstack/react-query";
import { dashboardService, type DashboardPeriod, type DashboardStatsResponse } from "@/services/dashboard.service";

export const adminDashboardKeys = {
  all: ["admin", "dashboard"] as const,
  stats: (period: DashboardPeriod) => [...adminDashboardKeys.all, "stats", period] as const,
};

export function useAdminDashboardQuery(period: DashboardPeriod = "bulan_ini") {
  return useQuery<DashboardStatsResponse>({
    queryKey: adminDashboardKeys.stats(period),
    queryFn: () => dashboardService.getStats(period),
    staleTime: 1000 * 60 * 2, // 2 minutes cache
    refetchOnWindowFocus: false,
  });
}

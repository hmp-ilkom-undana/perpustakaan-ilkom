import { useQuery } from "@tanstack/react-query";
import {
  activityLogService,
  type ActivityLogQueryParams,
} from "@/services/activity-log.service";

export const ACTIVITY_LOGS_QUERY_KEY = "activity_logs";
export const ACTIVITY_LOGS_STATS_QUERY_KEY = "activity_logs_stats";

/**
 * Hook untuk mengambil daftar riwayat log aktivitas dengan query filter & pagination
 */
export function useActivityLogsQuery(params?: ActivityLogQueryParams) {
  return useQuery({
    queryKey: [ACTIVITY_LOGS_QUERY_KEY, params],
    queryFn: () => activityLogService.getLogs(params),
    staleTime: 1000 * 30, // 30 Detik
  });
}

/**
 * Hook untuk mengambil agregasi statistik log aktivitas (total, hari ini, per role)
 */
export function useActivityLogStatsQuery() {
  return useQuery({
    queryKey: [ACTIVITY_LOGS_STATS_QUERY_KEY],
    queryFn: () => activityLogService.getStats(),
    staleTime: 1000 * 60 * 2, // 2 Menit
  });
}

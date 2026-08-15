import { useQuery } from "@tanstack/react-query";
import { fineService, type FineQueryParams } from "@/services/fine.service";

export const FINE_QUERY_KEY = "fines";
export const FINE_STATS_QUERY_KEY = "fine_stats";

/**
 * Hook untuk mengambil daftar transaksi denda (UNPAID / PAID / Search)
 */
export function useFineListQuery(params?: FineQueryParams) {
  return useQuery({
    queryKey: [FINE_QUERY_KEY, params],
    queryFn: () => fineService.getAll(params),
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Hook untuk mengambil metrik statistik kasir denda
 */
export function useFineStatsQuery() {
  return useQuery({
    queryKey: [FINE_STATS_QUERY_KEY],
    queryFn: () => fineService.getStats(),
    staleTime: 1000 * 60 * 2,
  });
}

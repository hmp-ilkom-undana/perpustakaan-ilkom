import { useQuery } from "@tanstack/react-query";
import { borrowingService } from "@/services/borrowing.service";

export const BORROWING_QUERY_KEY = "borrowings";

export function useBorrowingActiveQuery() {
  return useQuery({
    queryKey: [BORROWING_QUERY_KEY, "active"],
    queryFn: () => borrowingService.getActive(),
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 30,
  });
}

export function useBorrowingDetailQuery(id: string | undefined) {
  return useQuery({
    queryKey: [BORROWING_QUERY_KEY, "detail", id],
    queryFn: () => borrowingService.getById(id!),
    enabled: !!id,
    staleTime: 1000 * 60,
  });
}

export function useMyBorrowingHistoryQuery() {
  return useQuery({
    queryKey: [BORROWING_QUERY_KEY, "my-history"],
    queryFn: () => borrowingService.getMyHistory(),
    staleTime: 1000 * 60 * 2,
  });
}

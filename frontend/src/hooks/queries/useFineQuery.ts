import { useQuery } from "@tanstack/react-query";
import { fineService } from "@/services/fine.service";

export const FINE_QUERY_KEY = "fines";

export function useFineQuery() {
  return useQuery({
    queryKey: [FINE_QUERY_KEY],
    queryFn: () => fineService.getAll(),
    staleTime: 1000 * 60 * 2,
  });
}

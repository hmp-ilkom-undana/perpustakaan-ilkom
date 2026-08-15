import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fineService, type PayFinePayload } from "@/services/fine.service";
import { toast } from "sonner";
import { FINE_QUERY_KEY, FINE_STATS_QUERY_KEY } from "./useFineQuery";

/**
 * Mutation hook untuk mencatat pelunasan denda kasir
 */
export function usePayFineMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PayFinePayload }) =>
      fineService.pay(id, payload),
    onSuccess: () => {
      toast.success("Pembayaran denda berhasil dicatat");
      queryClient.invalidateQueries({ queryKey: [FINE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [FINE_STATS_QUERY_KEY] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Gagal memverifikasi pembayaran denda";
      toast.error(msg);
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fineService, type PayFinePayload } from "@/services/fine.service";
import { toast } from "sonner";
import { FINE_QUERY_KEY } from "./useFineQuery";

export function usePayFineMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PayFinePayload }) =>
      fineService.pay(id, payload),
    onSuccess: () => {
      toast.success("Pembayaran berhasil diverifikasi");
      queryClient.invalidateQueries({ queryKey: [FINE_QUERY_KEY] });
    },
    onError: () => toast.error("Gagal memverifikasi pembayaran"),
  });
}

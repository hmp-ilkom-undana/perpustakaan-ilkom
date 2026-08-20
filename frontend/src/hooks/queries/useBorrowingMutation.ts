import { useMutation, useQueryClient } from "@tanstack/react-query";
import { borrowingService } from "@/services/borrowing.service";
import { toast } from "sonner";
import { BORROWING_QUERY_KEY } from "./useBorrowingQuery";

export function useApproveBorrowingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => borrowingService.approve(id),
    onSuccess: () => {
      toast.success("Pengajuan berhasil di-ACC");
      queryClient.invalidateQueries({ queryKey: [BORROWING_QUERY_KEY] });
    },
    onError: () => toast.error("Gagal mengubah status pengajuan"),
  });
}

export function useRejectBorrowingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      borrowingService.reject(id, reason),
    onSuccess: () => {
      toast.success("Pengajuan berhasil ditolak");
      queryClient.invalidateQueries({ queryKey: [BORROWING_QUERY_KEY] });
    },
    onError: () => toast.error("Gagal menolak pengajuan"),
  });
}

export function useHandoverBorrowingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      borrowingService.handover(id, formData),
    onSuccess: () => {
      toast.success("Serah terima arsip berhasil dicatat");
      queryClient.invalidateQueries({ queryKey: [BORROWING_QUERY_KEY] });
    },
    onError: () => toast.error("Gagal mencatat serah terima"),
  });
}

export function useReturnBorrowingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      borrowingService.returnItem(id, formData),
    onSuccess: () => {
      toast.success("Pengembalian berhasil dicatat");
      queryClient.invalidateQueries({ queryKey: [BORROWING_QUERY_KEY] });
    },
    onError: () => toast.error("Gagal mencatat pengembalian"),
  });
}

export function useRequestBorrowingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (archiveId: string) => borrowingService.create(archiveId),
    onSuccess: (data: any) => {
      toast.success("Pengajuan Berhasil!", {
        description:
          data?.message ||
          "Silakan cek menu Peminjaman untuk melihat kode pengambilan dan status pengajuan.",
      });
      queryClient.invalidateQueries({ queryKey: [BORROWING_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["archives"] });
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.message || "Terjadi kesalahan pada sistem.";
      toast.error("Pengajuan Gagal", {
        description: errorMsg,
      });
    },
  });
}

export function useCancelBorrowingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => borrowingService.cancel(id),
    onSuccess: (data: any) => {
      toast.success("Antrean Berhasil Dibatalkan", {
        description:
          data?.message || "Status pengajuan Anda telah diubah menjadi CANCELLED.",
      });
      queryClient.invalidateQueries({ queryKey: [BORROWING_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["archives"] });
    },
    onError: (error: any) => {
      const errorMsg =
        error?.response?.data?.message ||
        "Terjadi kesalahan sistem saat membatalkan antrean.";
      toast.error("Gagal Membatalkan", {
        description: errorMsg,
      });
    },
  });
}


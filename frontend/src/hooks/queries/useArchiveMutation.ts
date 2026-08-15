import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveService, type ArchivePayload } from "@/services/archive.service";
import { toast } from "sonner";
import { ARCHIVE_QUERY_KEY } from "./useArchiveQuery";

export function useCreateArchiveMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ArchivePayload) => archiveService.create(payload),
    onSuccess: () => {
      toast.success("Arsip baru berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: [ARCHIVE_QUERY_KEY] });
    },
    onError: () => {
      toast.error("Gagal menyimpan data arsip");
    },
  });
}

export function useUpdateArchiveMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ArchivePayload> }) =>
      archiveService.update(id, payload),
    onSuccess: () => {
      toast.success("Arsip berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: [ARCHIVE_QUERY_KEY] });
    },
    onError: () => {
      toast.error("Gagal memperbarui data arsip");
    },
  });
}

export function useDeleteArchiveMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => archiveService.delete(id),
    onSuccess: () => {
      toast.success("Arsip berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: [ARCHIVE_QUERY_KEY] });
    },
    onError: () => {
      toast.error("Gagal menghapus arsip");
    },
  });
}

export function useImportArchiveMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => archiveService.import(formData),
    onSuccess: (data, formData) => {
      const { success, skipped, total } = data;
      if (success === 0 && skipped > 0) {
        toast.info("Tidak Ada Data Baru", {
          description: `Semua ${skipped} data dalam file sudah ada di database.`,
        });
      } else {
        const archiveType = formData.get("archiveType") as string;
        toast.success(`Import Data [${archiveType}] Berhasil!`, {
          description: `${success} arsip berhasil ditambahkan (${skipped} duplikat dilewati dari total ${total} data).`,
        });
      }
      queryClient.invalidateQueries({ queryKey: [ARCHIVE_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal mengimport file Excel");
    },
  });
}

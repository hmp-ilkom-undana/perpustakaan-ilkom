import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { USER_QUERY_KEYS } from "./useUserQuery";
import { toast } from "sonner";

/**
 * Mutation untuk mendaftarkan akun petugas secara batch / multiple email
 */
export function useCreateBatchStaffMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (staffList: Array<{ email: string; password?: string }>) =>
      userService.createBatchStaff(staffList),
    onSuccess: (res, variables) => {
      if (res?.totalFailed > 0 && res?.totalCreated === 0) {
        toast.error(res.errors?.[0]?.error || "Gagal mendaftarkan akun petugas");
        return;
      }

      if (res?.totalFailed > 0) {
        toast.warning(
          `Berhasil mendaftarkan ${res.totalCreated} petugas, ${res.totalFailed} gagal: ${res.errors?.[0]?.error}`,
        );
      } else {
        toast.success(
          `Berhasil mendaftarkan ${res?.totalCreated || variables.length} akun petugas baru!`,
        );
      }

      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
    onError: (err: any) => {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Gagal mendaftarkan akun petugas";
      toast.error(errorMsg);
    },
  });
}

/**
 * Mutation untuk memperbarui data profil & status petugas
 */
export function useUpdateStaffMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        email?: string;
        wa_number?: string;
        status?: string;
        password?: string;
      };
    }) => userService.updateStaff(id, data),
    onSuccess: (_, variables) => {
      toast.success(
        `Data petugas "${variables.data.name || variables.data.email || ""}" berhasil diperbarui`,
      );
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
    onError: (err: any) => {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Gagal memperbarui data petugas";
      toast.error(errorMsg);
    },
  });
}

/**
 * Mutation untuk mereset kata sandi petugas ke default (petugas_123)
 */
export function useResetPasswordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (identifier: string) => userService.resetPassword(identifier),
    onSuccess: () => {
      toast.success(
        "Sandi akun petugas berhasil direset ke default (petugas_123)",
      );
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
    onError: (err: any) => {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Gagal mereset kata sandi petugas";
      toast.error(errorMsg);
    },
  });
}

/**
 * Mutation untuk mengubah status aktif / non-aktif akun petugas
 */
export function useToggleStaffStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "Aktif" | "Non-Aktif";
    }) => userService.toggleStatus(id, status),
    onSuccess: (_, variables) => {
      toast.success(
        `Akses petugas berhasil diubah menjadi "${variables.status}"`,
      );
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
    onError: (err: any) => {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Gagal mengubah status akses petugas";
      toast.error(errorMsg);
    },
  });
}

/**
 * Mutation untuk menghapus akun staf/petugas dari sistem
 */
export function useDeleteStaffMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deleteStaff(id),
    onSuccess: () => {
      toast.success("Akun petugas berhasil dihapus dari sistem");
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
    onError: (err: any) => {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Gagal menghapus akun petugas";
      toast.error(errorMsg);
    },
  });
}

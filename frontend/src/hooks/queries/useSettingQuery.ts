import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  settingService,
  type UpdateSettingPayload,
  type SystemSetting,
} from "@/services/setting.service";
import { toast } from "sonner";

export const SYSTEM_SETTING_QUERY_KEY = "system_setting";

export function useSystemSettingQuery() {
  return useQuery<SystemSetting>({
    queryKey: [SYSTEM_SETTING_QUERY_KEY],
    queryFn: () => settingService.getSettings(),
    staleTime: 1000 * 60 * 5, // 5 menit cache
  });
}

export function useUpdateSystemSettingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSettingPayload) =>
      settingService.updateSettings(payload),
    onSuccess: (data) => {
      toast.success("Pengaturan sistem berhasil disimpan!", {
        description: "Aturan operasional, kuota, tarif denda, dan mode pemeliharaan telah diperbarui.",
      });
      queryClient.setQueryData([SYSTEM_SETTING_QUERY_KEY], data);
      queryClient.invalidateQueries({ queryKey: [SYSTEM_SETTING_QUERY_KEY] });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        "Gagal menyimpan perubahan pengaturan sistem.";
      toast.error(msg);
    },
  });
}

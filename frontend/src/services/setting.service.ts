import api from "@/lib/api";

export type MaintenanceModeType = "MAINTENANCE" | "UPDATE";

export interface SystemSetting {
  id: string;
  operatingDays: number[];
  pickupDurationDays: number;
  autoCancelUnpicked: boolean;
  loanDurationDays: number;
  maxActiveSkripsi: number;
  maxActiveRingkasan: number;
  maxActiveNaskah: number;
  lateBaseFine: number;
  lateThresholdDays: number;
  lateDailyFine: number;
  damagedFine: number;
  lostFine: number;
  adminWaNumber: string;
  adminContactName: string;
  
  // Konfigurasi Pemeliharaan & Pembaruan Sistem
  isMaintenanceActive?: boolean;
  maintenanceMode?: MaintenanceModeType;
  maintenanceTitle?: string;
  maintenanceMessage?: string;
  maintenanceTargetEnd?: string | null;
  maintenanceVersion?: string;
  maintenanceChangelog?: string[];
  allowAdminBypass?: boolean;

  updatedAt: string;
  updatedBy?: string | null;
}

export type UpdateSettingPayload = Partial<
  Omit<SystemSetting, "id" | "updatedAt" | "updatedBy">
>;

export const settingService = {
  getSettings: async (): Promise<SystemSetting> => {
    const response = await api.get("/api/settings");
    return response.data;
  },

  updateSettings: async (
    payload: UpdateSettingPayload,
  ): Promise<SystemSetting> => {
    const response = await api.put("/api/settings", payload);
    return response.data;
  },
};

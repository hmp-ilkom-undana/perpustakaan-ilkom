import { useState, useEffect, useMemo, useCallback } from "react";
import {
  useSystemSettingQuery,
  useUpdateSystemSettingMutation,
} from "./queries/useSettingQuery";
import { toast } from "sonner";

export type SettingTabType = "OPERASIONAL" | "PEMINJAMAN" | "DENDA";

export function useAdminSetting() {
  const {
    data: setting,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useSystemSettingQuery();

  const updateMutation = useUpdateSystemSettingMutation();

  // Tab State
  const [activeTab, setActiveTab] = useState<SettingTabType>("OPERASIONAL");

  // Form States
  const [operatingDays, setOperatingDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [pickupDurationDays, setPickupDurationDays] = useState<number>(3);
  const [autoCancelUnpicked, setAutoCancelUnpicked] = useState<boolean>(true);
  const [loanDurationDays, setLoanDurationDays] = useState<number>(30);
  const [maxActiveSkripsi, setMaxActiveSkripsi] = useState<number>(2);
  const [maxActiveRingkasan, setMaxActiveRingkasan] = useState<number>(1);
  const [maxActiveNaskah, setMaxActiveNaskah] = useState<number>(1);
  const [lateBaseFine, setLateBaseFine] = useState<number>(50000);
  const [lateThresholdDays, setLateThresholdDays] = useState<number>(7);
  const [lateDailyFine, setLateDailyFine] = useState<number>(10000);
  const [damagedFine, setDamagedFine] = useState<number>(75000);
  const [lostFine, setLostFine] = useState<number>(100000);
  const [adminWaNumber, setAdminWaNumber] = useState<string>("082339113591");
  const [adminContactName, setAdminContactName] = useState<string>(
    "Admin Perpustakaan ILKOM",
  );

  // Sync Form State with DB data on load or refetch
  useEffect(() => {
    if (setting) {
      setOperatingDays(setting.operatingDays || [1, 2, 3, 4, 5]);
      setPickupDurationDays(setting.pickupDurationDays ?? 3);
      setAutoCancelUnpicked(setting.autoCancelUnpicked ?? true);
      setLoanDurationDays(setting.loanDurationDays ?? 30);
      setMaxActiveSkripsi(setting.maxActiveSkripsi ?? 2);
      setMaxActiveRingkasan(setting.maxActiveRingkasan ?? 1);
      setMaxActiveNaskah(setting.maxActiveNaskah ?? 1);
      setLateBaseFine(setting.lateBaseFine ?? 50000);
      setLateThresholdDays(setting.lateThresholdDays ?? 7);
      setLateDailyFine(setting.lateDailyFine ?? 10000);
      setDamagedFine(setting.damagedFine ?? 75000);
      setLostFine(setting.lostFine ?? 100000);
      setAdminWaNumber(setting.adminWaNumber || "082339113591");
      setAdminContactName(
        setting.adminContactName || "Admin Perpustakaan ILKOM",
      );
    }
  }, [setting]);

  // Compute Form Dirty State
  const isDirty = useMemo(() => {
    if (!setting) return false;
    const sortedFormDays = [...operatingDays].sort();
    const sortedDbDays = [...(setting.operatingDays || [])].sort();
    const daysChanged =
      JSON.stringify(sortedFormDays) !== JSON.stringify(sortedDbDays);

    return (
      daysChanged ||
      pickupDurationDays !== setting.pickupDurationDays ||
      autoCancelUnpicked !== setting.autoCancelUnpicked ||
      loanDurationDays !== setting.loanDurationDays ||
      maxActiveSkripsi !== setting.maxActiveSkripsi ||
      maxActiveRingkasan !== setting.maxActiveRingkasan ||
      maxActiveNaskah !== setting.maxActiveNaskah ||
      lateBaseFine !== setting.lateBaseFine ||
      lateThresholdDays !== setting.lateThresholdDays ||
      lateDailyFine !== setting.lateDailyFine ||
      damagedFine !== setting.damagedFine ||
      lostFine !== setting.lostFine ||
      adminWaNumber !== setting.adminWaNumber ||
      adminContactName !== setting.adminContactName
    );
  }, [
    setting,
    operatingDays,
    pickupDurationDays,
    autoCancelUnpicked,
    loanDurationDays,
    maxActiveSkripsi,
    maxActiveRingkasan,
    maxActiveNaskah,
    lateBaseFine,
    lateThresholdDays,
    lateDailyFine,
    damagedFine,
    lostFine,
    adminWaNumber,
    adminContactName,
  ]);

  // Reset Form to current Database Snapshot
  const handleReset = useCallback(() => {
    if (!setting) return;
    setOperatingDays(setting.operatingDays || [1, 2, 3, 4, 5]);
    setPickupDurationDays(setting.pickupDurationDays ?? 3);
    setAutoCancelUnpicked(setting.autoCancelUnpicked ?? true);
    setLoanDurationDays(setting.loanDurationDays ?? 30);
    setMaxActiveSkripsi(setting.maxActiveSkripsi ?? 2);
    setMaxActiveRingkasan(setting.maxActiveRingkasan ?? 1);
    setMaxActiveNaskah(setting.maxActiveNaskah ?? 1);
    setLateBaseFine(setting.lateBaseFine ?? 50000);
    setLateThresholdDays(setting.lateThresholdDays ?? 7);
    setLateDailyFine(setting.lateDailyFine ?? 10000);
    setDamagedFine(setting.damagedFine ?? 75000);
    setLostFine(setting.lostFine ?? 100000);
    setAdminWaNumber(setting.adminWaNumber || "082339113591");
    setAdminContactName(setting.adminContactName || "Admin Perpustakaan ILKOM");
    toast.info("Perubahan formulir dibatalkan.");
  }, [setting]);

  // Submit Updated Settings to Backend
  const handleSave = useCallback(async () => {
    if (operatingDays.length === 0) {
      toast.error("Pilih minimal satu hari kerja operasional.");
      return;
    }
    if (!adminWaNumber.trim()) {
      toast.error("Nomor WhatsApp Admin tidak boleh kosong.");
      return;
    }

    await updateMutation.mutateAsync({
      operatingDays,
      pickupDurationDays,
      autoCancelUnpicked,
      loanDurationDays,
      maxActiveSkripsi,
      maxActiveRingkasan,
      maxActiveNaskah,
      lateBaseFine,
      lateThresholdDays,
      lateDailyFine,
      damagedFine,
      lostFine,
      adminWaNumber: adminWaNumber.trim(),
      adminContactName: adminContactName.trim(),
    });
  }, [
    operatingDays,
    pickupDurationDays,
    autoCancelUnpicked,
    loanDurationDays,
    maxActiveSkripsi,
    maxActiveRingkasan,
    maxActiveNaskah,
    lateBaseFine,
    lateThresholdDays,
    lateDailyFine,
    damagedFine,
    lostFine,
    adminWaNumber,
    adminContactName,
    updateMutation,
  ]);

  return {
    // Data & Query States
    setting,
    isLoading,
    isError,
    isFetching,
    isSubmitting: updateMutation.isPending,
    isDirty,
    refetch,

    // Tab Navigation
    activeTab,
    setActiveTab,

    // Form States & Setters
    operatingDays,
    setOperatingDays,
    pickupDurationDays,
    setPickupDurationDays,
    autoCancelUnpicked,
    setAutoCancelUnpicked,
    loanDurationDays,
    setLoanDurationDays,
    maxActiveSkripsi,
    setMaxActiveSkripsi,
    maxActiveRingkasan,
    setMaxActiveRingkasan,
    maxActiveNaskah,
    setMaxActiveNaskah,
    lateBaseFine,
    setLateBaseFine,
    lateThresholdDays,
    setLateThresholdDays,
    lateDailyFine,
    setLateDailyFine,
    damagedFine,
    setDamagedFine,
    lostFine,
    setLostFine,
    adminWaNumber,
    setAdminWaNumber,
    adminContactName,
    setAdminContactName,

    // Action Handlers
    handleReset,
    handleSave,
  };
}

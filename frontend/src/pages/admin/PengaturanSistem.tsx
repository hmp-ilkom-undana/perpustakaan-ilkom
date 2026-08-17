import { useState, useEffect, useMemo } from "react";
import {
  useSystemSettingQuery,
  useUpdateSystemSettingMutation,
} from "@/hooks/queries/useSettingQuery";
import {
  SlidersHorizontal,
  Calendar,
  BookOpen,
  Receipt,
  Save,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { OperasionalTab } from "@/components/pengaturan/OperasionalTab";
import { PeminjamanTab } from "@/components/pengaturan/PeminjamanTab";
import { DendaTab } from "@/components/pengaturan/DendaTab";

export default function PengaturanSistem() {
  const { data: setting, isLoading, isError } = useSystemSettingQuery();
  const updateMutation = useUpdateSystemSettingMutation();

  const [activeTab, setActiveTab] = useState<"OPERASIONAL" | "PEMINJAMAN" | "DENDA">("OPERASIONAL");

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
  const [adminContactName, setAdminContactName] = useState<string>("Admin Perpustakaan ILKOM");

  // Populate from DB when data loaded
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
      setAdminContactName(setting.adminContactName || "Admin Perpustakaan ILKOM");
    }
  }, [setting]);

  // Check if form is dirty
  const isDirty = useMemo(() => {
    if (!setting) return false;
    const sortedFormDays = [...operatingDays].sort();
    const sortedDbDays = [...(setting.operatingDays || [])].sort();
    const daysChanged = JSON.stringify(sortedFormDays) !== JSON.stringify(sortedDbDays);

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

  const handleReset = () => {
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
  };

  const handleSave = async () => {
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
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-600">Memuat konfigurasi sistem...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6 text-red-900 [box-shadow:4px_4px_0px_#DC2626]">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-red-600" />
          <h2 className="font-black text-lg">Gagal Memuat Pengaturan Sistem</h2>
        </div>
        <p className="text-sm mt-2 text-red-700">
          Terjadi kesalahan saat berkomunikasi dengan server. Silakan muat ulang halaman.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* HEADER CARD */}
      <div className="bg-white border-2 border-blue-900 rounded-lg p-6 [box-shadow:6px_6px_0px_#1E3A8A] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-orange-500 text-white border-2 border-blue-900 rounded-lg flex items-center justify-center shrink-0 [box-shadow:3px_3px_0px_#1E3A8A]">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-blue-950 tracking-tight">
                Pengaturan Sistem
              </h1>
              <Badge className="bg-amber-400 text-blue-950 border-2 border-blue-900 font-black text-[10px] tracking-wider uppercase [box-shadow:2px_2px_0px_#1E3A8A]">
                Admin Panel
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Konfigurasi hari operasional, masa tunggu penjemputan, kuota pinjam, dan skema denda perpustakaan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {isDirty && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={updateMutation.isPending}
              className="border-2 border-blue-900 font-bold text-xs hover:bg-slate-100 [box-shadow:2px_2px_0px_#1E3A8A]"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Batal
            </Button>
          )}
          <Button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || updateMutation.isPending}
            className="flex-1 md:flex-none bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs border-2 border-blue-900 [box-shadow:3px_3px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A] transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {updateMutation.isPending ? "Menyimpan..." : "Simpan Pengaturan"}
          </Button>
        </div>
      </div>

      {/* SEGMENTED TAB NAVIGATION */}
      <div className="flex flex-wrap gap-2 border-b-2 border-blue-900 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("OPERASIONAL")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-md font-bold text-xs transition-all border-2 border-blue-900 ${
            activeTab === "OPERASIONAL"
              ? "bg-orange-500 text-white [box-shadow:3px_3px_0px_#1E3A8A]"
              : "bg-white text-blue-950 hover:bg-orange-50"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Operasional & Pengambilan
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("PEMINJAMAN")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-md font-bold text-xs transition-all border-2 border-blue-900 ${
            activeTab === "PEMINJAMAN"
              ? "bg-orange-500 text-white [box-shadow:3px_3px_0px_#1E3A8A]"
              : "bg-white text-blue-950 hover:bg-orange-50"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Peminjaman & Kuota
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("DENDA")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-md font-bold text-xs transition-all border-2 border-blue-900 ${
            activeTab === "DENDA"
              ? "bg-orange-500 text-white [box-shadow:3px_3px_0px_#1E3A8A]"
              : "bg-white text-blue-950 hover:bg-orange-50"
          }`}
        >
          <Receipt className="w-4 h-4" />
          Tarif Denda & Kontak
        </button>
      </div>

      {/* TAB CONTENTS (SEPARATED FEATURE COMPONENTS) */}
      {activeTab === "OPERASIONAL" && (
        <OperasionalTab
          operatingDays={operatingDays}
          setOperatingDays={setOperatingDays}
          pickupDurationDays={pickupDurationDays}
          setPickupDurationDays={setPickupDurationDays}
          autoCancelUnpicked={autoCancelUnpicked}
          setAutoCancelUnpicked={setAutoCancelUnpicked}
        />
      )}

      {activeTab === "PEMINJAMAN" && (
        <PeminjamanTab
          loanDurationDays={loanDurationDays}
          setLoanDurationDays={setLoanDurationDays}
          maxActiveSkripsi={maxActiveSkripsi}
          setMaxActiveSkripsi={setMaxActiveSkripsi}
          maxActiveRingkasan={maxActiveRingkasan}
          setMaxActiveRingkasan={setMaxActiveRingkasan}
          maxActiveNaskah={maxActiveNaskah}
          setMaxActiveNaskah={setMaxActiveNaskah}
        />
      )}

      {activeTab === "DENDA" && (
        <DendaTab
          lateBaseFine={lateBaseFine}
          setLateBaseFine={setLateBaseFine}
          lateThresholdDays={lateThresholdDays}
          setLateThresholdDays={setLateThresholdDays}
          lateDailyFine={lateDailyFine}
          setLateDailyFine={setLateDailyFine}
          damagedFine={damagedFine}
          setDamagedFine={setDamagedFine}
          lostFine={lostFine}
          setLostFine={setLostFine}
          adminWaNumber={adminWaNumber}
          setAdminWaNumber={setAdminWaNumber}
          adminContactName={adminContactName}
          setAdminContactName={setAdminContactName}
        />
      )}
    </div>
  );
}

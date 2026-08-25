import {
  SlidersHorizontal,
  Calendar,
  BookOpen,
  Receipt,
  Save,
  RotateCcw,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminSetting } from "@/hooks/useAdminSetting";
import {
  OperasionalTab,
  PeminjamanTab,
  DendaTab,
  PemeliharaanTab,
} from "@/components/pengaturan";

export default function PengaturanSistem() {
  const {
    isLoading,
    isError,
    isSubmitting,
    isDirty,
    activeTab,
    setActiveTab,
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
    isMaintenanceActive,
    setIsMaintenanceActive,
    maintenanceMode,
    setMaintenanceMode,
    maintenanceTitle,
    setMaintenanceTitle,
    maintenanceMessage,
    setMaintenanceMessage,
    maintenanceTargetEnd,
    setMaintenanceTargetEnd,
    maintenanceVersion,
    setMaintenanceVersion,
    maintenanceChangelog,
    setMaintenanceChangelog,
    allowAdminBypass,
    setAllowAdminBypass,
    handleReset,
    handleSave,
  } = useAdminSetting();

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
      <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6 text-red-900 shadow-[4px_4px_0px_#DC2626]">
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
      {/* Header Card */}
      <div className="bg-white border-2 border-blue-900 rounded-lg p-6 shadow-[6px_6px_0px_#1E3A8A] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-orange-500 text-white border-2 border-blue-900 rounded-lg flex items-center justify-center shrink-0 shadow-[3px_3px_0px_#1E3A8A]">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-blue-950 tracking-tight">
                Pengaturan Sistem
              </h1>
              <Badge className="bg-amber-400 text-blue-950 border-2 border-blue-900 font-black text-[10px] tracking-wider uppercase shadow-[2px_2px_0px_#1E3A8A]">
                Admin Panel
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Konfigurasi hari operasional, kuota pinjam, skema denda, dan mode pemeliharaan sistem.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {isDirty && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isSubmitting}
              className="border-2 border-blue-900 font-bold text-xs hover:bg-slate-100 shadow-[2px_2px_0px_#1E3A8A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Batal
            </Button>
          )}
          <Button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || isSubmitting}
            className="flex-1 md:flex-none bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs border-2 border-blue-900 shadow-[3px_3px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "Menyimpan..." : "Simpan Pengaturan"}
          </Button>
        </div>
      </div>

      {/* Segmented Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b-2 border-blue-900 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("OPERASIONAL")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-md font-bold text-xs transition-all border-2 border-blue-900 cursor-pointer ${
            activeTab === "OPERASIONAL"
              ? "bg-orange-500 text-white shadow-[3px_3px_0px_#1E3A8A]"
              : "bg-white text-blue-950 hover:bg-orange-50"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Operasional & Pengambilan
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("PEMINJAMAN")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-md font-bold text-xs transition-all border-2 border-blue-900 cursor-pointer ${
            activeTab === "PEMINJAMAN"
              ? "bg-orange-500 text-white shadow-[3px_3px_0px_#1E3A8A]"
              : "bg-white text-blue-950 hover:bg-orange-50"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Peminjaman & Kuota
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("DENDA")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-md font-bold text-xs transition-all border-2 border-blue-900 cursor-pointer ${
            activeTab === "DENDA"
              ? "bg-orange-500 text-white shadow-[3px_3px_0px_#1E3A8A]"
              : "bg-white text-blue-950 hover:bg-orange-50"
          }`}
        >
          <Receipt className="w-4 h-4" />
          Tarif Denda & Kontak
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("PEMELIHARAAN")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-md font-bold text-xs transition-all border-2 border-blue-900 cursor-pointer ${
            activeTab === "PEMELIHARAAN"
              ? "bg-orange-500 text-white shadow-[3px_3px_0px_#1E3A8A]"
              : "bg-white text-blue-950 hover:bg-orange-50"
          }`}
        >
          <Wrench className="w-4 h-4" />
          Mode Pemeliharaan
        </button>
      </div>

      {/* Tab Contents */}
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

      {activeTab === "PEMELIHARAAN" && (
        <PemeliharaanTab
          isMaintenanceActive={isMaintenanceActive}
          setIsMaintenanceActive={setIsMaintenanceActive}
          maintenanceTitle={maintenanceTitle}
          setMaintenanceTitle={setMaintenanceTitle}
          maintenanceMessage={maintenanceMessage}
          setMaintenanceMessage={setMaintenanceMessage}
          maintenanceTargetEnd={maintenanceTargetEnd}
          setMaintenanceTargetEnd={setMaintenanceTargetEnd}
          allowAdminBypass={allowAdminBypass}
          setAllowAdminBypass={setAllowAdminBypass}
        />
      )}
    </div>
  );
}


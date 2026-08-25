import React, { useState } from "react";
import {
  Wrench,
  Sparkles,
  RotateCw,
  MessageSquare,
  Server,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Database,
  Radio,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSystemSettingQuery } from "@/hooks/queries/useSettingQuery";
import { MaintenanceCountdown } from "@/components/maintenance/MaintenanceCountdown";
import { UpdateChangelogCard } from "@/components/maintenance/UpdateChangelogCard";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export default function Maintenance() {
  const navigate = useNavigate();
  const { data: setting, isLoading, refetch, isFetching } = useSystemSettingQuery();

  // Mode Override for manual testing/previewing
  const [previewMode, setPreviewMode] = useState<"AUTO" | "MAINTENANCE" | "UPDATE">("AUTO");

  // Determine active mode: based on preview selection or database setting
  const currentMode: "MAINTENANCE" | "UPDATE" =
    previewMode === "AUTO"
      ? ((setting?.maintenanceMode as "MAINTENANCE" | "UPDATE") || "MAINTENANCE")
      : previewMode;

  const isMaintenanceMode = currentMode === "MAINTENANCE";

  const handleRefreshStatus = async () => {
    toast.info("Memeriksa status ketersediaan sistem...", { duration: 1500 });
    const result = await refetch();
    if (result.data && !result.data.isMaintenanceActive) {
      toast.success("Sistem telah kembali online! Mengalihkan ke beranda...");
      setTimeout(() => {
        navigate({ to: "/login" });
      }, 1200);
    } else {
      toast.info("Pemeliharaan masih berlangsung. Terima kasih atas kesabaran Anda.");
    }
  };

  const handleContactWhatsApp = () => {
    const waNumber = setting?.adminWaNumber || "082339113591";
    const cleanNumber = waNumber.replace(/^0/, "62").replace(/\D/g, "");
    const messageText = encodeURIComponent(
      `Halo ${setting?.adminContactName || "Admin Perpustakaan"}, saya ingin menanyakan perihal status pemeliharaan sistem perpustakaan ILKOM.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${messageText}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-blue-950 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-orange-500 selection:text-white">
      {/* Background Grid Pattern (Neo-Brutalism Canvas) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `radial-gradient(#1E3A8A 1.5px, transparent 1.5px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top Header Navbar */}
      <header className="relative z-10 border-b-2 border-blue-900 bg-white/90 backdrop-blur-md px-4 sm:px-8 py-3.5 shadow-[0px_4px_0px_#1E3A8A]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 text-white border-2 border-blue-900 rounded-lg flex items-center justify-center font-black shadow-[2px_2px_0px_#1E3A8A]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-sm sm:text-base tracking-tight text-blue-950 uppercase block leading-none">
                Perpustakaan ILKOM
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-500">
                Sistem Informasi Arsip & Skripsi Digital
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              className={`border-2 border-blue-900 font-black text-[10px] tracking-wider uppercase shadow-[2px_2px_0px_#1E3A8A] flex items-center gap-1.5 ${
                isMaintenanceMode
                  ? "bg-amber-400 text-blue-950"
                  : "bg-orange-500 text-white"
              }`}
            >
              <Radio className="w-3 h-3 animate-ping" />
              {isMaintenanceMode ? "Maintenance Mode" : "System Update"}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12 text-center my-auto w-full space-y-8">
        {/* Main Status Hero Card */}
        <div className="bg-white border-2 sm:border-4 border-blue-900 rounded-xl p-6 sm:p-10 shadow-[8px_8px_0px_#1E3A8A] relative overflow-hidden space-y-6">
          {/* Top Banner Accent */}
          <div
            className={`absolute top-0 left-0 right-0 h-2.5 ${
              isMaintenanceMode ? "bg-amber-400" : "bg-orange-500"
            }`}
          />

          {/* Icon Badge */}
          <div className="flex justify-center">
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-blue-900 flex items-center justify-center shadow-[4px_4px_0px_#1E3A8A] transition-transform hover:scale-105 ${
                isMaintenanceMode
                  ? "bg-amber-400 text-blue-950"
                  : "bg-orange-500 text-white"
              }`}
            >
              {isMaintenanceMode ? (
                <Wrench className="w-10 h-10 sm:w-12 sm:h-12 animate-pulse" />
              ) : (
                <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 animate-bounce" />
              )}
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="inline-block">
              <Badge className="bg-blue-950 text-white border-2 border-blue-900 font-black text-xs px-3 py-1 uppercase tracking-widest shadow-[2px_2px_0px_#1E3A8A]">
                {isMaintenanceMode
                  ? "Pemeliharaan & Peningkatan Server"
                  : `Pembaruan Sistem Versi ${setting?.maintenanceVersion || "v1.1.0"}`}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-blue-950 tracking-tight leading-tight">
              {setting?.maintenanceTitle ||
                (isMaintenanceMode
                  ? "Sistem Sedang Dalam Pemeliharaan Rutin"
                  : "Sistem Sedang Melakukan Pembaruan Fitur")}
            </h1>

            <p className="text-sm sm:text-base font-semibold text-slate-600 leading-relaxed">
              {setting?.maintenanceMessage ||
                (isMaintenanceMode
                  ? "Kami sedang melakukan optimalisasi basis data arsip skripsi dan peningkatan infrastruktur server untuk kenyamanan layanan."
                  : "Kami sedang memasang fitur-fitur baru dan peningkatan performa sistem perpustakaan. Layanan akan segera kembali normal.")}
            </p>
          </div>

          {/* Live System Diagnostics / Stepper (Neo-Brutalism Chips) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 max-w-2xl mx-auto text-left">
            <div className="bg-slate-50 border-2 border-blue-900 rounded-lg p-3 shadow-[2px_2px_0px_#1E3A8A] flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-emerald-100 border border-emerald-600 flex items-center justify-center text-emerald-700 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase">Tahap 1</p>
                <p className="text-xs font-bold text-blue-950">Cadangan Basis Data</p>
              </div>
            </div>

            <div className="bg-amber-50 border-2 border-blue-900 rounded-lg p-3 shadow-[2px_2px_0px_#1E3A8A] flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-amber-400 border border-blue-900 flex items-center justify-center text-blue-950 shrink-0">
                <Database className="w-4 h-4 animate-spin" style={{ animationDuration: "6s" }} />
              </div>
              <div>
                <p className="text-[10px] font-black text-amber-900 uppercase">Tahap 2</p>
                <p className="text-xs font-bold text-blue-950">
                  {isMaintenanceMode ? "Optimasi Indeks" : "Penyebaran Modul"}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border-2 border-blue-900 rounded-lg p-3 shadow-[2px_2px_0px_#1E3A8A] flex items-center gap-3 opacity-75">
              <div className="w-8 h-8 rounded bg-slate-200 border border-slate-400 flex items-center justify-center text-slate-600 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase">Tahap 3</p>
                <p className="text-xs font-bold text-blue-950">Verifikasi Layanan</p>
              </div>
            </div>
          </div>

          {/* Countdown Timer Component */}
          <div className="pt-2">
            <MaintenanceCountdown targetEndTime={setting?.maintenanceTargetEnd} />
          </div>

          {/* Feature Changelog Card (Specifically for UPDATE mode) */}
          {!isMaintenanceMode && (
            <div className="pt-4">
              <UpdateChangelogCard
                version={setting?.maintenanceVersion || "v1.1.0"}
                changelog={setting?.maintenanceChangelog}
              />
            </div>
          )}

          {/* Action Button Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Button
              type="button"
              onClick={handleRefreshStatus}
              disabled={isFetching}
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-black text-xs sm:text-sm px-6 py-5 border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            >
              <RotateCw className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
              {isFetching ? "Memeriksa Status..." : "Periksa Status Sistem"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleContactWhatsApp}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-blue-950 font-black text-xs sm:text-sm px-6 py-5 border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 mr-2 text-emerald-600" />
              Hubungi Bantuan Admin
            </Button>
          </div>
        </div>

        {/* Quick Mode Preview Bar (For Developer / Admin convenience) */}
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
          <span>Pratinjau Tampilan:</span>
          <button
            type="button"
            onClick={() => setPreviewMode("AUTO")}
            className={`px-2.5 py-1 rounded border border-blue-900 text-[11px] font-bold ${
              previewMode === "AUTO" ? "bg-blue-900 text-white" : "bg-white text-blue-950"
            }`}
          >
            Database ({setting?.maintenanceMode || "MAINTENANCE"})
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode("MAINTENANCE")}
            className={`px-2.5 py-1 rounded border border-blue-900 text-[11px] font-bold ${
              previewMode === "MAINTENANCE" ? "bg-amber-400 text-blue-950" : "bg-white text-blue-950"
            }`}
          >
            Maintenance
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode("UPDATE")}
            className={`px-2.5 py-1 rounded border border-blue-900 text-[11px] font-bold ${
              previewMode === "UPDATE" ? "bg-orange-500 text-white" : "bg-white text-blue-950"
            }`}
          >
            Update
          </button>
        </div>
      </main>

      {/* Footer & Admin Bypass Gateway */}
      <footer className="relative z-10 border-t-2 border-blue-900 bg-white px-4 py-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-slate-600">
          <p>© {new Date().getFullYear()} Jurusan Ilmu Komputer. Seluruh hak cipta dilindungi.</p>

          <button
            type="button"
            onClick={() => navigate({ to: "/login" })}
            className="inline-flex items-center gap-1.5 text-blue-900 hover:text-orange-600 font-black underline underline-offset-4 cursor-pointer transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            Portal Petugas & Administrator
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </footer>
    </div>
  );
}

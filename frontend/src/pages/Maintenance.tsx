import React, { useState } from "react";
import {
  Wrench,
  Sparkles,
  RotateCw,
  MessageSquare,
  Lock,
  ArrowRight,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NavLogo } from "@/components/NavLogo";
import { useSystemSettingQuery } from "@/hooks/queries/useSettingQuery";
import { MaintenanceCountdown } from "@/components/maintenance/MaintenanceCountdown";
import { UpdateChangelogCard } from "@/components/maintenance/UpdateChangelogCard";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export default function Maintenance() {
  const navigate = useNavigate();
  const { data: setting, isLoading, refetch, isFetching } = useSystemSettingQuery();

  const currentMode: "MAINTENANCE" | "UPDATE" =
    (setting?.maintenanceMode as "MAINTENANCE" | "UPDATE") || "MAINTENANCE";

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
            <NavLogo
              size="md"
              variant="brutalist"
              className="shadow-[2px_2px_0px_#1E3A8A]"
            />
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
                  ? "Kami sedang melakukan pemeliharaan rutin dan peningkatan performa sistem perpustakaan."
                  : "Kami sedang memasang fitur-fitur baru dan peningkatan performa sistem perpustakaan. Layanan akan segera kembali normal.")}
            </p>
          </div>

          {/* Countdown Timer Component (Estimasi Waktu Selesai) */}
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
      </main>

      {/* Footer & Admin Bypass Gateway */}
      <footer className="relative z-10 border-t-2 border-blue-900 bg-white px-4 py-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-slate-600">
          <p>© {new Date().getFullYear()} Ilmu Komputer Undana. Seluruh hak cipta dilindungi.</p>

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

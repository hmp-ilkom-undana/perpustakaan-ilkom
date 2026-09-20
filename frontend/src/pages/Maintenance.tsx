import React from "react";
import { Wrench, RotateCw, MessageSquare, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NavLogo } from "@/components/NavLogo";
import { useSystemSettingQuery } from "@/hooks/queries/useSettingQuery";
import { MaintenanceCountdown } from "@/components/maintenance/MaintenanceCountdown";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export default function Maintenance() {
  const navigate = useNavigate();
  const { data: setting, refetch, isFetching } = useSystemSettingQuery();

  const handleRefreshStatus = async () => {
    toast.info("Memeriksa status ketersediaan sistem...", { duration: 1500 });
    const result = await refetch();
    if (result.data && !result.data.isMaintenanceActive) {
      toast.success("Sistem telah kembali online! Mengalihkan ke beranda...");
      setTimeout(() => {
        navigate({ to: "/login" });
      }, 1200);
    } else {
      toast.info(
        "Pemeliharaan masih berlangsung. Terima kasih atas kesabaran Anda.",
      );
    }
  };

  const handleContactWhatsApp = () => {
    const waNumber = setting?.adminWaNumber || "082339113591";
    const cleanNumber = waNumber.replace(/^0/, "62").replace(/\D/g, "");
    const messageText = encodeURIComponent(
      `Halo ${setting?.adminContactName || "Admin Perpustakaan"}, saya ingin menanyakan perihal status pemeliharaan sistem perpustakaan ILKOM.`,
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
      <header className="relative z-10 border-b-2 border-blue-900 bg-white/90 backdrop-blur-md px-3 sm:px-8 py-2.5 sm:py-3.5 shadow-[0px_3px_0px_#1E3A8A] sm:shadow-[0px_4px_0px_#1E3A8A]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2.5 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <NavLogo
              size="sm"
              variant="brutalist"
              className="shadow-[1.5px_1.5px_0px_#1E3A8A] sm:shadow-[2px_2px_0px_#1E3A8A] shrink-0"
            />
            <div className="min-w-0">
              <span className="font-black text-xs sm:text-base tracking-tight text-blue-950 uppercase block leading-none truncate">
                Perpustakaan ILKOM
              </span>
              <span className="hidden xs:block sm:block text-[9px] sm:text-xs font-bold text-slate-500 truncate mt-0.5">
                Sistem Informasi Arsip & Skripsi Digital
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge className="border-2 border-blue-900 font-black text-[9px] sm:text-[10px] tracking-wider uppercase shadow-[1.5px_1.5px_0px_#1E3A8A] sm:shadow-[2px_2px_0px_#1E3A8A] px-2 py-0.5 sm:px-2.5 sm:py-1 flex items-center gap-1.5 bg-amber-400 text-blue-950">
              <Radio className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-ping" />
              Maintenance Mode
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 py-5 sm:py-12 text-center my-auto w-full space-y-5 sm:space-y-8">
        {/* Main Status Hero Card */}
        <div className="bg-white border-2 sm:border-4 border-blue-900 rounded-xl p-4 sm:p-10 shadow-[4px_4px_0px_#1E3A8A] sm:shadow-[8px_8px_0px_#1E3A8A] relative overflow-hidden space-y-4 sm:space-y-6">
          {/* Icon Badge */}
          <div className="flex justify-center">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-blue-900 flex items-center justify-center shadow-[3px_3px_0px_#1E3A8A] sm:shadow-[4px_4px_0px_#1E3A8A] bg-amber-400 text-blue-950 transition-transform hover:scale-105">
              <Wrench className="w-8 h-8 sm:w-12 sm:h-12 animate-pulse" />
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-2 sm:space-y-3 max-w-2xl mx-auto">
            <div className="inline-block">
              <Badge className="bg-blue-950 text-white border-2 border-blue-900 font-black text-[10px] sm:text-xs px-2.5 py-0.5 sm:px-3 sm:py-1 uppercase tracking-widest shadow-[1.5px_1.5px_0px_#1E3A8A] sm:shadow-[2px_2px_0px_#1E3A8A]">
                Pemeliharaan & Peningkatan Sistem
              </Badge>
            </div>

            <h1 className="text-xl sm:text-4xl font-black text-blue-950 tracking-tight leading-tight">
              {setting?.maintenanceTitle || "Sistem Sedang Dalam Pemeliharaan"}
            </h1>

            <p className="text-xs sm:text-base font-semibold text-slate-600 leading-relaxed max-w-xl mx-auto">
              {setting?.maintenanceMessage ||
                "Kami sedang melakukan pemeliharaan rutin dan peningkatan performa sistem perpustakaan."}
            </p>
          </div>

          {/* Countdown Timer Component (Estimasi Waktu Selesai) */}
          <div className="pt-1 sm:pt-2">
            <MaintenanceCountdown
              targetEndTime={setting?.maintenanceTargetEnd}
            />
          </div>

          {/* Action Button Row (Compact Side-by-Side) */}
          <div className="pt-2 max-w-md mx-auto space-y-2">
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              {/* 1. Tombol Periksa Status */}
              <Button
                type="button"
                onClick={handleRefreshStatus}
                disabled={isFetching}
                className="w-full h-9 sm:h-10 bg-orange-500 hover:bg-orange-600 text-white font-black text-[11px] sm:text-xs px-2.5 py-2 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] sm:shadow-[3px_3px_0px_#1E3A8A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5 rounded-lg"
              >
                <RotateCw
                  className={`w-3.5 h-3.5 shrink-0 ${isFetching ? "animate-spin" : ""}`}
                />
                <span className="truncate">{isFetching ? "Memeriksa..." : "Periksa Status"}</span>
              </Button>

              {/* 2. Tombol Hubungi Admin */}
              <Button
                type="button"
                variant="outline"
                onClick={handleContactWhatsApp}
                className="w-full h-9 sm:h-10 bg-white hover:bg-slate-50 text-blue-950 font-black text-[11px] sm:text-xs px-2.5 py-2 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] sm:shadow-[3px_3px_0px_#1E3A8A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5 rounded-lg"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Hubungi Admin</span>
              </Button>
            </div>

            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 text-center">
              Butuh bantuan mendesak? Hubungi admin via WhatsApp.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t-2 border-blue-900 bg-white px-3 sm:px-4 py-3 sm:py-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-[11px] sm:text-xs font-bold text-slate-600 gap-1">
          <p>Dikelola oleh: HMP Ilmu Komputer Periode 2026/2027 Kabinet Arthasena</p>
          <p className="text-[10px] text-slate-500 font-semibold">
            © {new Date().getFullYear()} Ilmu Komputer Undana. Seluruh hak cipta dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}

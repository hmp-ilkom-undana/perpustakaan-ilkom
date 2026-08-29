import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, HelpCircle, History, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useStudentDashboard } from "@/hooks/useStudentDashboard";
import { useStudentGuideContext } from "@/context/StudentGuideContext";
import {
  BorrowingQuotaDialog,
  FineSummaryCard,
  CirculationScheduleCard,
} from "@/components/dashboard";

export default function DashboardMahasiswa() {
  const [isQuotaDialogOpen, setIsQuotaDialogOpen] = useState(false);
  const { handleOpen: openGuide } = useStudentGuideContext();

  const {
    isLoading,
    firstName,
    currentDate,
    quota,
    denda,
    calendar,
  } = useStudentDashboard();

  if (isLoading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 max-w-5xl mx-auto w-full pb-12 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* 1. Header Sambutan Mahasiswa + Tombol Aksi Kanan Atas (Task 4.1 & Task 4.2) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-0 pt-2 pb-2 border-b-2 border-blue-900/20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-950 leading-tight">
              Selamat datang kembali, <span className="text-orange-500">{firstName}</span>!
            </h1>
          </div>
          <p className="text-slate-500 font-bold text-xs sm:text-sm mt-0.5">{currentDate}</p>
        </div>

        {/* Tombol Bulat AssistiveTouch: Kuota & Panduan (Pojok Kanan Atas) */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          {/* 1. Tombol Bulat Kuota (AssistiveTouch Style) */}
          <div className="relative flex items-center group">
            {/* Tooltip Hover Kiri */}
            <span className="mr-2 px-2 py-1 text-[11px] font-black text-blue-950 bg-white border-2 border-blue-900 rounded-md shadow-[2px_2px_0px_#1E3A8A] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none hidden sm:inline-block select-none whitespace-nowrap z-20">
              📊 Kuota: {quota.terpakai}/{quota.maksimal} ({quota.isFull ? "Penuh" : `${quota.sisa} slot tersisa`})
            </span>

            <button
              type="button"
              onClick={() => setIsQuotaDialogOpen(true)}
              className={cn(
                "w-11 h-11 sm:w-12 sm:h-12 rounded-full",
                "bg-white border-2 border-blue-900",
                "shadow-[3px_3px_0px_#1E3A8A]",
                "hover:bg-orange-50 hover:shadow-[4px_4px_0px_#1E3A8A]",
                "active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
                "flex flex-col items-center justify-center shrink-0",
                "transition-all duration-200 cursor-pointer outline-none relative"
              )}
              aria-label="Rincian kuota peminjaman"
              title={`Kuota: ${quota.terpakai}/${quota.maksimal}`}
            >
              <span className="font-mono font-black text-xs sm:text-sm text-blue-950 leading-none">
                {quota.terpakai}/{quota.maksimal}
              </span>
              <span className="text-[7.5px] font-black uppercase text-orange-600 tracking-tighter leading-none mt-0.5">
                KUOTA
              </span>

              {/* Status Dot Indikator */}
              <span
                className={cn(
                  "absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border border-blue-900 shadow-[1px_1px_0px_#1E3A8A]",
                  quota.isFull
                    ? "bg-rose-500"
                    : quota.sisa <= 1
                    ? "bg-amber-400"
                    : "bg-emerald-500"
                )}
              />
            </button>
          </div>

          {/* 2. Tombol Bulat Panduan (AssistiveTouch Style) */}
          <div className="relative flex items-center group">
            {/* Tooltip Hover Kiri */}
            <span className="mr-2 px-2 py-1 text-[11px] font-black text-blue-950 bg-white border-2 border-blue-900 rounded-md shadow-[2px_2px_0px_#1E3A8A] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none hidden sm:inline-block select-none whitespace-nowrap z-20">
              📖 Panduan Peminjaman
            </span>

            <button
              type="button"
              onClick={openGuide}
              className={cn(
                "w-11 h-11 sm:w-12 sm:h-12 rounded-full",
                "bg-amber-400 border-2 border-blue-900",
                "shadow-[3px_3px_0px_#1E3A8A]",
                "hover:bg-amber-300 hover:shadow-[4px_4px_0px_#1E3A8A]",
                "active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
                "flex flex-col items-center justify-center shrink-0",
                "transition-all duration-200 cursor-pointer outline-none"
              )}
              aria-label="Buka panduan peminjaman arsip"
              title="Panduan Peminjaman"
            >
              <BookOpen className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-950" strokeWidth={2.5} />
              <span className="text-[7.5px] font-black uppercase text-blue-950 tracking-tighter leading-none mt-0.5">
                PANDUAN
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Grid Dashboard (Denda & Kalender Terpadu) */}
      <div className="w-full px-4 sm:px-0 space-y-6">
        {/* Status Denda */}
        <FineSummaryCard denda={denda} className="w-full" />

        {/* Kalender & Agenda Sirkulasi Terpadu (Full Width Bento Card) */}
        <CirculationScheduleCard
          date={calendar.date}
          onSelectDate={calendar.setDate}
          taskDates={calendar.taskDates}
          tasks={calendar.tasksForSelectedDate}
          className="w-full"
        />
      </div>

      {/* 3. Quick Action & Discovery Banner */}
      <div className="px-4 sm:px-0 pt-2">
        <div className="bg-gradient-to-r from-blue-900 to-blue-950 border-2 border-blue-900 rounded-xl p-5 sm:p-6 text-white shadow-[4px_4px_0px_#1E3A8A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-orange-500/20 border border-orange-400 flex items-center justify-center text-orange-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                Cari Referensi Tugas Akhir & Riset
              </h3>
            </div>
            <p className="text-blue-200 text-xs sm:text-sm font-medium leading-relaxed">
              Jelajahi koleksi arsip Skripsi, Ringkasan, dan Naskah Publikasi resmi Ilmu Komputer UNDANA.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto shrink-0">
            <Link to="/mahasiswa/peminjaman" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white shadow-none font-bold text-xs"
              >
                <History className="w-4 h-4 mr-1.5" />
                Peminjaman Saya
              </Button>
            </Link>
            <Link to="/mahasiswa/katalog" className="w-full sm:w-auto">
              <Button
                variant="default"
                className="w-full sm:w-auto font-black text-xs uppercase tracking-wider bg-orange-500 hover:bg-orange-600 shadow-[2px_2px_0px_#0F172A]"
              >
                <Search className="w-4 h-4 mr-1.5" />
                Buka Katalog
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Modal Dialog Kuota Pop-Up (Task 4.1) */}
      <BorrowingQuotaDialog
        isOpen={isQuotaDialogOpen}
        onClose={() => setIsQuotaDialogOpen(false)}
        quota={quota}
      />
    </div>
  );
}

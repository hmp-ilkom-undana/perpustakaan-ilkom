import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStudentDashboard } from "@/hooks/useStudentDashboard";
import { useStudentGuideContext } from "@/context/StudentGuideContext";
import {
  BorrowingQuotaDialog,
  FineSummaryCard,
  CirculationScheduleCard,
  StudentHelpContactCard,
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
    <div className="flex flex-col space-y-6 max-w-5xl mx-auto w-full pb-12 animate-in fade-in slide-in-from-bottom-3 duration-500 relative">
      {/* 1. Assistive Touch Floating Action Buttons (Sisi Kanan Layar di Bawah Navbar) */}
      <div className="fixed top-24 sm:top-28 right-3 sm:right-5 z-40 flex flex-col items-end gap-3 pointer-events-auto">
        {/* 1A. Tombol Bulat Kuota (Posisi Pertama / Atas) */}
        <div className="relative flex items-center group">
          {/* Tooltip Hover Kiri */}
          <span className="mr-2.5 px-2.5 py-1 text-xs font-black text-blue-950 bg-white border-2 border-blue-900 rounded-md shadow-[2px_2px_0px_#1E3A8A] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none hidden sm:inline-block select-none whitespace-nowrap z-50">
            📊 Kuota Pinjam
          </span>

          <button
            type="button"
            onClick={() => setIsQuotaDialogOpen(true)}
            className={cn(
              "w-12 h-12 sm:w-13 sm:h-13 rounded-full",
              "bg-white border-2 border-blue-900",
              "shadow-[3px_3px_0px_#1E3A8A]",
              "hover:bg-orange-50 hover:shadow-[4px_4px_0px_#1E3A8A]",
              "active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
              "flex items-center justify-center shrink-0",
              "transition-all duration-200 cursor-pointer outline-none relative"
            )}
            aria-label="Rincian kuota peminjaman"
          >
            <span className="font-mono font-black text-sm sm:text-base text-blue-950 leading-none">
              {quota.terpakai}/{quota.maksimal}
            </span>

            {/* Status Dot Indikator */}
            <span
              className={cn(
                "absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border border-blue-900 shadow-[1px_1px_0px_#1E3A8A]",
                quota.isFull
                  ? "bg-rose-500"
                  : quota.sisa <= 1
                  ? "bg-amber-400"
                  : "bg-emerald-500"
              )}
            />
          </button>
        </div>

        {/* 1B. Tombol Bulat Panduan (Posisi Kedua / Bawah) */}
        <div className="relative flex items-center group">
          {/* Tooltip Hover Kiri */}
          <span className="mr-2.5 px-2.5 py-1 text-xs font-black text-blue-950 bg-white border-2 border-blue-900 rounded-md shadow-[2px_2px_0px_#1E3A8A] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none hidden sm:inline-block select-none whitespace-nowrap z-50">
            📖 Panduan Peminjaman
          </span>

          <button
            type="button"
            onClick={openGuide}
            className={cn(
              "w-12 h-12 sm:w-13 sm:h-13 rounded-full",
              "bg-amber-400 border-2 border-blue-900",
              "shadow-[3px_3px_0px_#1E3A8A]",
              "hover:bg-amber-300 hover:shadow-[4px_4px_0px_#1E3A8A]",
              "active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
              "flex items-center justify-center shrink-0",
              "transition-all duration-200 cursor-pointer outline-none"
            )}
            aria-label="Buka panduan peminjaman arsip"
          >
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-950" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* 2. Header Sambutan Mahasiswa & Quick Discovery Action (Task 4.3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-0 pt-2 pb-2 border-b-2 border-blue-900/20">
        <div className="flex flex-col gap-1 max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-950 leading-tight">
            Selamat datang kembali, <span className="text-orange-500">{firstName}</span>!
          </h1>
          <p className="text-slate-500 font-bold text-xs sm:text-sm mt-0.5">
            {currentDate} • Jelajahi koleksi arsip Skripsi, Ringkasan, dan Naskah Publikasi resmi.
          </p>
        </div>

        {/* Tombol Buka Katalog di Header (Task 4.3) */}
        <Link to="/mahasiswa/katalog" className="shrink-0 self-start sm:self-auto">
          <Button
            variant="default"
            size="default"
            className="font-black text-xs uppercase tracking-wider bg-orange-500 hover:bg-orange-600 shadow-[2px_2px_0px_#0F172A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all px-4 py-2"
          >
            <Search className="w-4 h-4 mr-1.5" />
            Buka Katalog
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>

      {/* 3. Grid Dashboard (Denda & Kalender Terpadu) */}
      <div className="w-full px-4 sm:px-0 space-y-6">
        {/* Status Denda (Task 4.5: 2 Kompartemen Mandiri) */}
        <FineSummaryCard denda={denda} className="w-full" />

        {/* Kalender & Agenda Sirkulasi Terpadu (Full Width Bento Card, Task 4.6: Deep Linking) */}
        <CirculationScheduleCard
          date={calendar.date}
          onSelectDate={calendar.setDate}
          taskDates={calendar.taskDates}
          tasks={calendar.tasksForSelectedDate}
          className="w-full"
        />
      </div>

      {/* 4. Pusat Bantuan & Kontak Petugas Resmi via WhatsApp (Task 4.4) */}
      <div className="px-4 sm:px-0 pt-2">
        <StudentHelpContactCard />
      </div>

      {/* 5. Modal Dialog Kuota Pop-Up (Task 4.1) */}
      <BorrowingQuotaDialog
        isOpen={isQuotaDialogOpen}
        onClose={() => setIsQuotaDialogOpen(false)}
        quota={quota}
      />
    </div>
  );
}

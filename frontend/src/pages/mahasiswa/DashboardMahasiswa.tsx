import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudentDashboard } from "@/hooks/useStudentDashboard";
import { useStudentGuideContext } from "@/context/StudentGuideContext";
import {
  BorrowingQuotaDialog,
  FineSummaryCard,
  CirculationScheduleCard,
  StudentHelpContactCard,
  DraggableAssistiveTouch,
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
      {/* 1. Dynamic Draggable AssistiveTouch (Snap-to-Edge Physics) */}
      <DraggableAssistiveTouch
        quota={quota}
        onOpenQuota={() => setIsQuotaDialogOpen(true)}
        onOpenGuide={openGuide}
      />

      {/* 2. Header Sambutan Mahasiswa & Quick Discovery Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 px-4 sm:px-0 pt-2 pb-2 border-b-2 border-blue-900/20">
        <div className="flex flex-col gap-0.5 max-w-xl">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-blue-950 leading-tight">
            Selamat datang kembali, <span className="text-orange-500">{firstName}</span>!
          </h1>
          <p className="text-slate-500 font-bold text-xs sm:text-sm mt-0.5">
            {currentDate} • Jelajahi koleksi arsip Skripsi, Ringkasan, dan Publikasi.
          </p>
        </div>

        {/* Tombol Buka Katalog */}
        <Link to="/mahasiswa/katalog" className="shrink-0 w-full sm:w-auto">
          <Button
            variant="default"
            size="default"
            className="w-full sm:w-auto font-black text-xs uppercase tracking-wider bg-orange-500 hover:bg-orange-600 shadow-[2px_2px_0px_#0F172A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all px-4 py-2 cursor-pointer"
          >
            <Search className="w-4 h-4 mr-1.5" />
            Buka Katalog
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>

      {/* 3. Grid Dashboard (Denda & Kalender Terpadu) */}
      <div className="w-full px-4 sm:px-0 space-y-6">
        {/* Status Denda (2 Kompartemen Mandiri) */}
        <FineSummaryCard denda={denda} className="w-full" />

        {/* Kalender & Aktivitas Sirkulasi Terpadu (Bento Card dengan Deep Linking) */}
        <CirculationScheduleCard
          date={calendar.date}
          onSelectDate={calendar.setDate}
          taskDates={calendar.taskDates}
          tasks={calendar.tasksForSelectedDate}
          className="w-full"
        />
      </div>

      {/* 4. Pusat Bantuan & Kontak Petugas Resmi via WhatsApp */}
      <div className="px-4 sm:px-0 pt-2">
        <StudentHelpContactCard />
      </div>

      {/* 5. Modal Dialog Kuota Pop-Up */}
      <BorrowingQuotaDialog
        isOpen={isQuotaDialogOpen}
        onClose={() => setIsQuotaDialogOpen(false)}
        quota={quota}
      />
    </div>
  );
}

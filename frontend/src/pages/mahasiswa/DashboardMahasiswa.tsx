import { Link } from "@tanstack/react-router";
import { ArrowRight, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudentDashboard } from "@/hooks/useStudentDashboard";
import { BorrowingQuotaCard } from "@/components/dashboard/BorrowingQuotaCard";
import { FineSummaryCard } from "@/components/dashboard/FineSummaryCard";
import { ActivityCalendarCard } from "@/components/dashboard/ActivityCalendarCard";
import { DateActivityList } from "@/components/dashboard/DateActivityList";

export default function DashboardMahasiswa() {
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
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 max-w-4xl mx-auto w-full pb-12 min-h-screen sm:min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Header Sambutan */}
      <div className="flex flex-col gap-1 px-5 pt-4 sm:p-0">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-950 leading-tight">
          Selamat datang kembali,{" "}
          <span className="text-orange-500">{firstName}</span>!
        </h1>
        <p className="text-slate-500 font-semibold text-xs mt-0.5">{currentDate}</p>
      </div>

      {/* 2. Grid Dashboard Terstruktur (Baris 1: Kuota + Denda Sejajar, Baris 2: Kalender + Aktivitas Sejajar) */}
      <div className="w-full px-5 sm:px-0 space-y-6">
        
        {/* BARIS 1: Kuota Peminjaman (col-span-2) & Status Denda (col-span-3) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
          <div className="md:col-span-2 flex">
            <BorrowingQuotaCard
              quota={quota}
              className="w-full h-full flex flex-col justify-between"
            />
          </div>
          <div className="md:col-span-3 flex">
            <FineSummaryCard
              denda={denda}
              className="w-full h-full flex flex-col justify-between"
            />
          </div>
        </div>

        {/* BARIS 2: Kalender & Daftar Aktivitas Tanggal Terpilih */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
          <div className="md:col-span-2 flex">
            <ActivityCalendarCard
              date={calendar.date}
              onSelectDate={calendar.setDate}
              taskDates={calendar.taskDates}
              className="w-full h-full flex flex-col justify-between"
            />
          </div>
          <div className="md:col-span-3 flex">
            <DateActivityList
              date={calendar.date}
              tasks={calendar.tasksForSelectedDate}
              className="w-full h-full flex flex-col justify-between"
            />
          </div>
        </div>

      </div>

      {/* 3. Quick Action CTA Katalog */}
      <div className="pt-4 px-5 sm:px-0 flex justify-center w-full">
        <Link to="/mahasiswa/katalog" className="w-full sm:w-auto">
          <Button
            size="lg"
            className="w-full sm:w-auto"
          >
            <Search className="w-4 h-4 mr-2" />
            Cari Arsip di Katalog
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

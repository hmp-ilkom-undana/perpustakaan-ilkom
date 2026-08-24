import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, History, Loader2, Search } from "lucide-react";
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
      <div className="flex h-[75vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 max-w-5xl mx-auto w-full pb-12 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* 1. Header Sambutan Mahasiswa */}
      <div className="flex flex-col gap-1 px-4 sm:px-0 pt-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-950 leading-tight">
            Selamat datang kembali, <span className="text-orange-500">{firstName}</span>!
          </h1>
        </div>
        <p className="text-slate-500 font-bold text-xs sm:text-sm mt-0.5">{currentDate}</p>
      </div>

      {/* 2. Grid Dashboard (Baris 1: Kuota + Denda, Baris 2: Kalender + Aktivitas) */}
      <div className="w-full px-4 sm:px-0 space-y-6">
        {/* BARIS 1: Kuota Peminjaman (col-span-2) & Status Denda (col-span-3) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
          <div className="md:col-span-2 flex">
            <BorrowingQuotaCard quota={quota} className="w-full h-full flex flex-col justify-between" />
          </div>
          <div className="md:col-span-3 flex">
            <FineSummaryCard denda={denda} className="w-full h-full flex flex-col justify-between" />
          </div>
        </div>

        {/* BARIS 2: Kalender Sirkulasi (col-span-2) & Agenda Tanggal (col-span-3) */}
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
            <Link to="/mahasiswa/riwayat" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white shadow-none font-bold text-xs"
              >
                <History className="w-4 h-4 mr-1.5" />
                Riwayat Saya
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
    </div>
  );
}

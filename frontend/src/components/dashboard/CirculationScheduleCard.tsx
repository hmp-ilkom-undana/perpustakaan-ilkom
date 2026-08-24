import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DashboardTaskItem } from "@/hooks/useStudentDashboard";

interface CirculationScheduleCardProps {
  date: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  taskDates: Date[];
  tasks: DashboardTaskItem[];
  className?: string;
}

export function CirculationScheduleCard({
  date,
  onSelectDate,
  taskDates,
  tasks,
  className,
}: CirculationScheduleCardProps) {
  const formattedDate = date
    ? date.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Pilih Tanggal";

  const shortDate = date
    ? date.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : "Semua";

  const modifiers = {
    hasTask: taskDates,
  };

  const modifiersStyles = {
    hasTask: {
      fontWeight: "900",
      backgroundColor: "#FEF08A",
      color: "#1E3A8A",
      border: "2px solid #1E3A8A",
      boxShadow: "2px 2px 0px #1E3A8A",
      borderRadius: "6px",
    },
  };

  return (
    <Card
      className={cn(
        "bg-white border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] overflow-hidden flex flex-col transition-all",
        className,
      )}
    >
      {/* 1. Header Terpadu */}
      <CardHeader className="p-3.5 sm:p-5 pb-3 border-b-2 border-blue-900 bg-slate-50 flex flex-row items-center justify-between gap-3 shrink-0 flex-wrap">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg border-2 border-blue-900 bg-blue-100 text-blue-900 shadow-[2px_2px_0px_#1E3A8A]">
            <CalendarIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>
          <div className="flex flex-col min-w-0">
            <CardTitle className="text-xs sm:text-sm font-black uppercase tracking-wider leading-tight text-blue-950 truncate">
              Kalender & Agenda Sirkulasi
            </CardTitle>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 mt-0.5 truncate">
              Jadwal Peminjaman, Pengambilan & Tenggat Pengembalian
            </span>
          </div>
        </div>

        {/* Badge Tanggal & Status Terpilih */}
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant="outline"
            className="border-blue-900/30 bg-white text-blue-950 text-[10px] sm:text-xs font-black shadow-[1px_1px_0px_#1E3A8A]"
          >
            {shortDate}
          </Badge>
          <Badge
            variant={tasks.length > 0 ? "orange" : "secondary"}
            className="text-[10px] sm:text-xs font-black"
          >
            {tasks.length} Agenda
          </Badge>
        </div>
      </CardHeader>

      {/* 2. Split Pane Content (Kiri: Mini Kalender, Kanan: List Agenda) */}
      <CardContent className="p-0 grid grid-cols-1 lg:grid-cols-12 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-blue-900/15 flex-grow">
        {/* Kolom Kiri: Kalender Interaktif */}
        <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col items-center justify-between space-y-4 bg-white">
          <div className="w-full flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onSelectDate}
              className="rounded-md p-0"
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
            />
          </div>

          {/* Legend Indikator Tanggal Berjadwal */}
          <div className="w-full pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] sm:text-[11px] font-bold text-slate-500">
            <span className="w-3 h-3 rounded-xs bg-amber-200 border-2 border-blue-900 shadow-[1px_1px_0px_#1E3A8A]" />
            <span>Tanggal dengan Agenda Peminjaman</span>
          </div>
        </div>

        {/* Kolom Kanan: Detail Agenda Tanggal Terpilih */}
        <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col justify-between space-y-3.5 bg-slate-50/40">
          {/* Subheader Agenda Tanggal */}
          <div className="flex items-center justify-between pb-2 border-b border-blue-900/10">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-blue-950">
              <span>Agenda:</span>
              <span className="text-orange-600 font-bold">{formattedDate}</span>
            </div>
          </div>

          {/* List Agenda / Empty State */}
          <div
            className={cn(
              "flex-1 min-h-[220px] flex flex-col",
              tasks.length === 0 ? "justify-center" : "justify-start pt-1",
            )}
          >
            {tasks.length === 0 ? (
              <div className="py-6 px-4 flex flex-col items-center justify-center text-center my-auto">
                <div className="bg-slate-100 border-2 border-blue-900/20 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-2.5 text-slate-400 shadow-[2px_2px_0px_#CBD5E1]">
                  <CalendarIcon className="w-5 h-5 text-slate-500" />
                </div>
                <h4 className="font-black text-xs sm:text-sm text-blue-950">
                  Tidak Ada Aktivitas di Tanggal Ini
                </h4>
                <p className="text-slate-500 text-[10px] sm:text-[11px] font-medium mt-1 max-w-xs leading-relaxed">
                  Anda tidak memiliki jadwal pengambilan, tenggat pengembalian, atau verifikasi sirkulasi pada tanggal ini.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 overflow-y-auto max-h-[280px] pr-1 w-full">
                {tasks.map((task) => {
                  const isOverdue = task.status === "OVERDUE" || task.isOverdue;
                  const isBorrowed = task.status === "BORROWED";
                  const isWaitingPickup = task.status === "WAITING_PICKUP";

                  let badgeVariant: "emerald" | "amber" | "rose" | "navy" = "navy";
                  let badgeText = "PENGAJUAN";

                  if (isOverdue) {
                    badgeVariant = "rose";
                    badgeText = "TERLAMBAT";
                  } else if (isBorrowed) {
                    badgeVariant = "emerald";
                    badgeText = "PENGEMBALIAN";
                  } else if (isWaitingPickup) {
                    badgeVariant = "amber";
                    badgeText = "SIAP AMBIL";
                  }

                  return (
                    <div
                      key={task.id}
                      className="p-3 bg-white border-2 border-blue-900/20 hover:border-blue-900/40 rounded-xl space-y-2 shadow-[2px_2px_0px_#E2E8F0] transition-all"
                    >
                      {/* Baris Atas: Badge Status + Tipe + Sisa Hari / Kode Ambil */}
                      <div className="flex items-center justify-between gap-1.5 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge variant={badgeVariant} className="text-[9px] px-1.5 py-0 font-black">
                            {badgeText}
                          </Badge>
                          <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-orange-500" /> {task.archive.archiveType}
                          </span>
                          {task.daysRemaining !== undefined && isBorrowed && (
                            <span
                              className={cn(
                                "text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded border",
                                task.isDueSoon
                                  ? "bg-amber-100 border-amber-300 text-amber-800 font-black"
                                  : "bg-slate-100 border-slate-200 text-slate-600",
                              )}
                            >
                              {task.daysRemaining >= 0
                                ? `Sisa ${task.daysRemaining} hari`
                                : `Lewat ${Math.abs(task.daysRemaining)} hari`}
                            </span>
                          )}
                        </div>

                        {/* Status Pill Kanan */}
                        <div className="shrink-0 flex items-center">
                          {isWaitingPickup && (
                            <div className="flex items-center gap-1 bg-amber-100 border-2 border-amber-500 rounded-md px-2 py-0.5 shadow-[1px_1px_0px_#D97706]">
                              <span className="text-[8px] font-black uppercase text-amber-950">Kode:</span>
                              <span className="text-[11px] font-mono font-black text-orange-600">
                                {task.pickupCode || `PK-${task.id.substring(0, 6).toUpperCase()}`}
                              </span>
                            </div>
                          )}
                          {isBorrowed && (
                            <div className="flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded text-[9px] font-black">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Dipinjam</span>
                            </div>
                          )}
                          {isOverdue && (
                            <div className="flex items-center gap-1 text-rose-800 bg-rose-50 border border-rose-300 px-2 py-0.5 rounded text-[9px] font-black">
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              <span>Rp {(task.fineAmount || 0).toLocaleString("id-ID")}</span>
                            </div>
                          )}
                          {!isWaitingPickup && !isBorrowed && !isOverdue && (
                            <div className="flex items-center gap-1 text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[9px] font-black">
                              <Clock className="w-3 h-3 text-blue-800" />
                              <span>Menunggu ACC</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Judul Dokumen */}
                      <h5 className="text-xs sm:text-sm font-black text-blue-950 line-clamp-1 leading-snug">
                        {task.archive.title}
                      </h5>

                      {/* Baris Bawah: Lokasi & Kode Arsip */}
                      <div className="flex items-center justify-between gap-2 text-[10px] text-slate-500 font-semibold pt-0.5 border-t border-slate-100">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-orange-500 shrink-0" /> Ruangan HMP ILKOM
                        </span>
                        {task.archive.archiveCode && (
                          <span className="font-mono text-[9px] bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded text-slate-700 font-bold shrink-0">
                            {task.archive.archiveCode}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Footer Action */}
          <div className="pt-2 border-t border-blue-900/10 flex items-center justify-end">
            <Link to="/mahasiswa/peminjaman">
              <Button
                variant="outline"
                size="sm"
                className="text-[11px] sm:text-xs font-black h-8 px-3 border-2 border-blue-900/30 hover:border-blue-900 text-blue-950 shadow-[2px_2px_0px_#1E3A8A] hover:bg-slate-100 cursor-pointer"
              >
                Buka Detail Peminjaman
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

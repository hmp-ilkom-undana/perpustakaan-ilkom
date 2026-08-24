import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DashboardTaskItem } from "@/hooks/useStudentDashboard";

interface DateActivityListProps {
  date: Date | undefined;
  tasks: DashboardTaskItem[];
  className?: string;
}

export function DateActivityList({ date, tasks, className }: DateActivityListProps) {
  const formattedDate = date
    ? date.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Pilih Tanggal";

  return (
    <Card
      className={cn(
        "bg-white border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] flex flex-col justify-between overflow-hidden transition-all",
        className,
      )}
    >
      {/* 1. Header Kartu Aktivitas */}
      <CardHeader className="p-4 sm:p-5 pb-3 border-b-2 border-blue-900 bg-slate-50 flex flex-row items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-orange-100 border border-blue-900 shadow-[1px_1px_0px_#1E3A8A] text-orange-600">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <CardTitle className="text-xs sm:text-sm font-black text-blue-950 uppercase tracking-wider leading-tight truncate">
              Aktivitas Tanggal
            </CardTitle>
            <span className="text-[11px] font-bold text-slate-500 mt-0.5 truncate">
              {formattedDate}
            </span>
          </div>
        </div>

        <Badge variant={tasks.length > 0 ? "orange" : "secondary"} className="shrink-0 text-[10px] font-black">
          {tasks.length} Agenda
        </Badge>
      </CardHeader>

      {/* 2. Body Content */}
      <CardContent className="p-4 sm:p-5 flex flex-col justify-between flex-grow space-y-3">
        {tasks.length === 0 ? (
          <div className="py-7 px-4 flex flex-col items-center justify-center text-center my-auto">
            <div className="bg-slate-100 border border-blue-900/20 w-11 h-11 rounded-lg flex items-center justify-center mb-2.5 text-slate-400">
              <CalendarIcon className="w-5 h-5 text-slate-500" />
            </div>
            <h3 className="font-black text-xs sm:text-sm text-blue-950">
              Tidak Ada Aktivitas di Tanggal Ini
            </h3>
            <p className="text-slate-500 text-[11px] font-medium mt-1 max-w-xs leading-relaxed">
              Anda tidak memiliki jadwal pengambilan, tenggat pengembalian, atau verifikasi sirkulasi pada tanggal ini.
            </p>
          </div>
        ) : (
          <div className="space-y-2 overflow-y-auto pr-1 flex-1">
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
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-slate-50/80 border border-blue-900/30 rounded-lg gap-2 hover:bg-slate-100/90 transition-colors"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={badgeVariant} className="text-[9px] px-1.5 py-0 font-bold">
                        {badgeText}
                      </Badge>
                      <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-orange-500" /> {task.archive.archiveType}
                      </span>
                      {task.daysRemaining !== undefined && isBorrowed && (
                        <span
                          className={cn(
                            "text-[10px] font-bold px-1.5 py-0.2 rounded border",
                            task.isDueSoon
                              ? "bg-amber-100 border-amber-300 text-amber-800"
                              : "bg-slate-100 border-slate-200 text-slate-600",
                          )}
                        >
                          {task.daysRemaining >= 0
                            ? `Sisa ${task.daysRemaining} hari`
                            : `Lewat ${Math.abs(task.daysRemaining)} hari`}
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-black text-blue-950 truncate leading-snug">
                      {task.archive.title}
                    </h4>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-orange-500" /> Ruangan HMP ILKOM
                      </span>
                      {task.archive.archiveCode && (
                        <span className="font-mono text-[9px] bg-slate-200/70 px-1 py-0.2 rounded text-slate-700">
                          {task.archive.archiveCode}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Box / Action di Kanan */}
                  <div className="shrink-0 flex items-center sm:justify-end">
                    {isWaitingPickup && (
                      <div className="bg-amber-100 border border-amber-400 rounded-md px-2.5 py-1 text-center shadow-[1px_1px_0px_#D97706]">
                        <span className="text-[8px] font-black uppercase text-amber-950 block">Kode Ambil</span>
                        <span className="text-xs font-mono font-black text-orange-600">
                          {task.pickupCode || `PK-${task.id.substring(0, 6).toUpperCase()}`}
                        </span>
                      </div>
                    )}
                    {isBorrowed && (
                      <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-1 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[10px] font-black">Dipinjam</span>
                      </div>
                    )}
                    {isOverdue && (
                      <div className="flex items-center gap-1.5 text-rose-800 bg-rose-50 border border-rose-300 px-2 py-1 rounded-md">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <div className="flex flex-col text-right">
                          <span className="text-[9px] font-black uppercase text-rose-700">Terlambat</span>
                          <span className="text-[9px] font-bold font-mono text-rose-700">
                            Rp {(task.fineAmount || 0).toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    )}
                    {!isWaitingPickup && !isBorrowed && !isOverdue && (
                      <div className="flex items-center gap-1.5 text-blue-900 bg-blue-50 border border-blue-200 px-2 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5 text-blue-800" />
                        <span className="text-[10px] font-black">Menunggu ACC</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 3. Footer Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-orange-400" /> Sirkulasi Ruang Baca
          </span>
          <Link to="/mahasiswa/peminjaman">
            <Button variant="outline" size="sm" className="text-xs font-bold">
              Buka Detail Peminjaman
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

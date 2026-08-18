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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DateActivityListProps {
  date: Date | undefined;
  tasks: any[];
  className?: string;
}

export function DateActivityList({ date, tasks, className }: DateActivityListProps) {
  const formattedDate = date?.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Card
      className={cn(
        "flex flex-col justify-between overflow-hidden",
        className,
      )}
    >
      {/* Header Kartu Aktivitas */}
      <CardHeader className="p-4 sm:p-5 pb-3 border-b-2 border-blue-900 bg-slate-50 flex flex-row items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-orange-100 border border-blue-900 shadow-[1px_1px_0px_#1E3A8A] text-orange-600">
            <CalendarIcon className="w-4 h-4 text-blue-950" />
          </div>
          <div className="flex flex-col">
            <CardTitle className="text-xs sm:text-sm font-black text-blue-950 uppercase tracking-wider leading-tight">
              Aktivitas Tanggal
            </CardTitle>
            <span className="text-[11px] font-bold text-slate-500 mt-0.5">
              {formattedDate}
            </span>
          </div>
        </div>

        <Badge variant={tasks.length > 0 ? "orange" : "secondary"}>
          {tasks.length} Agenda
        </Badge>
      </CardHeader>

      {/* Body Content */}
      <CardContent className="p-4 sm:p-5 flex flex-col justify-between flex-grow space-y-3">
        {tasks.length === 0 ? (
          <div className="py-8 px-4 flex flex-col items-center justify-center text-center my-auto">
            <div className="bg-slate-100 border border-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-2.5 text-slate-400">
              <CalendarIcon className="w-6 h-6 text-slate-500" />
            </div>
            <h3 className="font-black text-xs sm:text-sm text-blue-950">
              Tidak Ada Aktivitas
            </h3>
            <p className="text-slate-500 text-[11px] font-medium mt-1 max-w-xs">
              Anda tidak memiliki jadwal pengambilan, tenggat pengembalian, atau aktivitas peminjaman pada tanggal ini.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2 max-h-[148px] overflow-y-auto pr-1">
              {tasks.map((task: any) => {
                const isOverdue = task.status === "OVERDUE";
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
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-slate-50 border border-blue-900/40 rounded-md gap-2 hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={badgeVariant} className="text-[9px] px-1.5 py-0">
                          {badgeText}
                        </Badge>
                        <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-orange-500" /> {task.archive.archiveType}
                        </span>
                      </div>

                      <h4 className="text-xs font-black text-blue-950 line-clamp-1">
                        {task.archive.title}
                      </h4>

                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                        <MapPin className="w-3 h-3 text-orange-500" />
                        Ruangan HMP
                      </div>
                    </div>

                    {/* Status Box / Action di Kanan */}
                    <div className="shrink-0 flex items-center sm:justify-end">
                      {isWaitingPickup && (
                        <div className="bg-amber-100 border border-amber-400 rounded px-2 py-0.5 text-center">
                          <span className="text-[9px] font-black uppercase text-amber-950 block">Kode Ambil</span>
                          <span className="text-[11px] font-mono font-black text-orange-600">
                            {task.pickupCode || `PK-${task.id.substring(0, 6).toUpperCase()}`}
                          </span>
                        </div>
                      )}
                      {isBorrowed && (
                        <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          <span className="text-[10px] font-black">Sedang Dipinjam</span>
                        </div>
                      )}
                      {isOverdue && (
                        <div className="flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-300 px-2 py-0.5 rounded">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <div className="flex flex-col text-right">
                            <span className="text-[9px] font-black uppercase">Terlambat</span>
                            <span className="text-[9px] font-bold text-rose-600">
                              Rp {(task.fineAmount || 0).toLocaleString("id-ID")}
                            </span>
                          </div>
                        </div>
                      )}
                      {!isWaitingPickup && !isBorrowed && !isOverdue && (
                        <div className="flex items-center gap-1 text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3 text-blue-900" />
                          <span className="text-[10px] font-black">Menunggu ACC</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Pintasan Navigasi */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <Link to="/mahasiswa/peminjaman" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Buka Detail Peminjaman
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

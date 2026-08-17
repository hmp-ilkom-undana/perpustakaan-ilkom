import {
  AlertTriangle,
  BookOpen,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface DateActivityListProps {
  date: Date | undefined;
  tasks: any[];
}

export function DateActivityList({ date, tasks }: DateActivityListProps) {
  const formattedDate = date?.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col">
      <h2 className="text-xs font-black text-blue-950 uppercase tracking-wider mb-3 flex items-center gap-2">
        <CalendarIcon className="w-4 h-4 text-orange-500" />
        Aktivitas Tanggal {formattedDate}
      </h2>

      <div className="flex flex-col gap-3">
        {tasks.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-blue-900 rounded-lg shadow-[4px_4px_0px_#1E3A8A] p-8 flex flex-col items-center justify-center text-center">
            <div className="bg-orange-100 border-2 border-blue-900 w-14 h-14 rounded-lg flex items-center justify-center mb-3 shadow-[2px_2px_0px_#1E3A8A]">
              <CalendarIcon className="w-7 h-7 text-blue-950" />
            </div>
            <h3 className="font-black text-sm text-blue-950">
              Tidak Ada Aktivitas
            </h3>
            <p className="text-slate-500 text-xs font-medium mt-1 max-w-xs">
              Anda tidak memiliki tenggat pengembalian atau jadwal pengambilan pada
              tanggal ini.
            </p>
          </div>
        ) : (
          tasks.map((task: any) => {
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
              badgeText = "PENGAMBILAN";
            }

            return (
              <Card
                key={task.id}
                variant="interactive"
                className="overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="p-4 flex-1 border-b sm:border-b-0 sm:border-r-2 border-blue-900">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant={badgeVariant}>{badgeText}</Badge>
                    </div>

                    <h3 className="text-sm font-black text-blue-950 leading-snug">
                      {task.archive.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-semibold flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-orange-500" />{" "}
                      {task.archive.archiveType}
                    </p>

                    <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" />
                      Ruangan HMP
                    </div>
                  </div>

                  {isWaitingPickup && (
                    <div className="p-4 sm:w-40 flex flex-col justify-center items-center bg-amber-50">
                      <p className="text-[10px] font-black text-blue-950 uppercase tracking-wider mb-1.5">
                        Pickup Code
                      </p>
                      <div className="bg-white border-2 border-blue-900 rounded-md px-3 py-1.5 w-full text-center shadow-[2px_2px_0px_#1E3A8A]">
                        <span className="text-base font-mono font-black tracking-widest text-orange-500">
                          {task.pickupCode ||
                            `REQ-${task.id.substring(0, 6).toUpperCase()}`}
                        </span>
                      </div>
                    </div>
                  )}
                  {isBorrowed && (
                    <div className="p-4 sm:w-40 flex flex-col justify-center items-center bg-slate-50">
                      <CheckCircle2 className="w-7 h-7 text-emerald-600 mb-1" />
                      <p className="text-xs font-black text-blue-950 text-center">
                        Sedang Dipinjam
                      </p>
                    </div>
                  )}
                  {isOverdue && (
                    <div className="p-4 sm:w-44 flex flex-col justify-center items-center bg-rose-50 border-t sm:border-t-0 sm:border-l-2 border-rose-500">
                      <AlertTriangle className="w-6 h-6 text-rose-600 mb-1" />
                      <p className="text-xs font-black text-rose-700 text-center uppercase tracking-wider">
                        Terlambat
                      </p>
                      <span className="text-[11px] font-black text-rose-600 mt-0.5">
                        Denda: Rp{" "}
                        {(task.fineAmount || 0).toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                  {!isWaitingPickup && !isBorrowed && !isOverdue && (
                    <div className="p-4 sm:w-40 flex flex-col justify-center items-center bg-slate-50">
                      <Clock className="w-6 h-6 text-blue-900 mb-1" />
                      <p className="text-xs font-black text-blue-950 text-center">
                        Menunggu ACC
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

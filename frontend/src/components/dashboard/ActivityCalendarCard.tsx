import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ActivityCalendarCardProps {
  date: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  taskDates: Date[];
  className?: string;
}

export function ActivityCalendarCard({
  date,
  onSelectDate,
  taskDates,
  className,
}: ActivityCalendarCardProps) {
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
        "bg-white border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] flex flex-col justify-between overflow-hidden transition-all",
        className,
      )}
    >
      {/* 1. Header Card */}
      <CardHeader className="p-3.5 sm:p-5 pb-2.5 sm:pb-3 border-b-2 border-blue-900 bg-slate-50 flex flex-row items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-md border border-blue-900 bg-blue-100 text-blue-900 shadow-[1px_1px_0px_#1E3A8A]">
            <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <CardTitle className="text-xs sm:text-sm font-black uppercase tracking-wider leading-tight text-blue-950 truncate">
              Kalender Sirkulasi
            </CardTitle>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 mt-0.5 truncate">
              Jadwal Peminjaman & Pengembalian
            </span>
          </div>
        </div>
      </CardHeader>

      {/* 2. Kalender Konten */}
      <CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center flex-grow space-y-3">
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
        <div className="w-full pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] sm:text-[11px] font-bold text-slate-500">
          <span className="w-2.5 h-2.5 rounded-xs bg-amber-200 border border-blue-900 shadow-[1px_1px_0px_#1E3A8A]" />
          <span>Tanggal dengan Aktivitas Peminjaman</span>
        </div>
      </CardContent>
    </Card>
  );
}

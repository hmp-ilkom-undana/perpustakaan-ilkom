import { Calendar, Clock } from "lucide-react";
import { StudentHistoryItem } from "@/hooks/useStudentHistory";

interface HistoryTimelineSectionProps {
  item: StudentHistoryItem;
}

export function HistoryTimelineSection({ item }: HistoryTimelineSectionProps) {
  const getReturnLabel = () => {
    switch (item.status) {
      case "RETURNED":
        return "Tanggal Selesai";
      case "DAMAGED":
        return "Dikembalikan (Rusak)";
      case "LOST":
        return "Dinyatakan Hilang";
      case "REJECTED":
        return "Tanggal Ditolak";
      case "CANCELLED":
        return "Tanggal Dibatalkan";
      default:
        return "Tanggal Pengembalian";
    }
  };

  return (
    <div className="bg-slate-50 border-2 border-blue-900 rounded-lg p-3.5 space-y-2.5 shadow-[2px_2px_0px_#1E3A8A]">
      <h4 className="text-[10px] font-black uppercase tracking-wider text-blue-950">
        Rincian Garis Waktu
      </h4>

      <div className="flex items-center justify-between text-xs text-slate-600 font-semibold border-b-2 border-blue-900/20 pb-2.5">
        <span className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-orange-500 shrink-0" />
          Tanggal Pengajuan
        </span>
        <span className="font-bold text-blue-950">{item.borrowDate}</span>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
        <span className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-orange-500 shrink-0" />
          {getReturnLabel()}
        </span>
        <span className="font-bold text-blue-950">{item.returnDate}</span>
      </div>
    </div>
  );
}

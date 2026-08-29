import { BookOpen, Calendar, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StudentHistoryItem, HistoryStatus } from "@/hooks/useStudentHistory";
import { cn } from "@/lib/utils";

interface HistoryCardRowProps {
  item: StudentHistoryItem;
  onClick?: () => void;
}

export function HistoryCardRow({ item, onClick }: HistoryCardRowProps) {
  const hasUnpaidFine = Boolean(item.fine && item.fine > 0 && !item.paymentDate);
  const hasPaidFine = Boolean(item.fine && item.fine > 0 && item.paymentDate);

  const getStatusBadge = (status: HistoryStatus) => {
    switch (status) {
      case "RETURNED":
        return <Badge variant="emerald">DIKEMBALIKAN</Badge>;
      case "DAMAGED":
        return <Badge variant="amber">RUSAK</Badge>;
      case "LOST":
        return <Badge variant="rose">HILANG</Badge>;
      case "CANCELLED":
        return <Badge variant="secondary">DIBATALKAN</Badge>;
      case "REJECTED":
        return <Badge variant="rose">DITOLAK</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card
      variant="interactive"
      onClick={onClick}
      className={cn(
        "p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer",
        hasUnpaidFine && "border-rose-400 bg-rose-50/20 shadow-[4px_4px_0px_#E11D48]"
      )}
    >
      <div className="flex gap-3.5 items-start sm:items-center flex-1 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 border-2 border-blue-900 shadow-[1px_1px_0px_#1E3A8A] text-blue-950 group-hover:bg-orange-500 group-hover:text-white transition-colors">
          <BookOpen className="h-5 w-5" />
        </div>

        <div className="flex flex-col min-w-0 gap-1">
          <h4 className="text-sm font-black text-blue-950 truncate group-hover:text-orange-600 transition-colors">
            {item.title}
          </h4>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase text-blue-950 bg-slate-100 border border-blue-900 px-2 py-0.5 rounded-sm shadow-[1px_1px_0px_#1E3A8A]">
              {item.type}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Calendar className="h-3.5 w-3.5 text-orange-500" />
              <span>
                {item.borrowDate} → {item.returnDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-2.5 mt-1 sm:mt-0 pl-13 sm:pl-0">
        {hasUnpaidFine && (
          <Badge
            variant="rose"
            className="font-mono text-xs font-black shadow-[1px_1px_0px_#991B1B]"
          >
            Denda: Rp {item.fine?.toLocaleString("id-ID")} (Belum Lunas)
          </Badge>
        )}
        {hasPaidFine && (
          <Badge
            variant="emerald"
            className="font-mono text-[11px] font-bold shadow-[1px_1px_0px_#059669]"
          >
            Denda Lunas
          </Badge>
        )}
        <Badge
          variant="outline"
          className="bg-slate-100 font-mono text-[11px] font-black text-blue-950 tracking-wider shadow-[1px_1px_0px_#1E3A8A] shrink-0"
        >
          {item.pickupCode}
        </Badge>
        {getStatusBadge(item.status)}
        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all shrink-0" />
      </div>
    </Card>
  );
}

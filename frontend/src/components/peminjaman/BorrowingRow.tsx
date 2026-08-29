import { BookOpen, Calendar, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BorrowingStatus } from "./TicketProgress";
import { cn } from "@/lib/utils";

export interface BorrowingRowProps {
  id: string;
  pickupCode: string;
  archiveTitle: string;
  archiveType: string;
  status: BorrowingStatus;
  requestDate: string;
  dueDate?: string;
  fineAmount?: number;
  onClick?: () => void;
}

export function BorrowingRow({
  pickupCode,
  archiveTitle,
  archiveType,
  status,
  requestDate,
  dueDate,
  fineAmount,
  onClick,
}: BorrowingRowProps) {
  const isOverdue = status === "OVERDUE" || (fineAmount && fineAmount > 0);

  const getStatusBadge = (currentStatus: BorrowingStatus) => {
    switch (currentStatus) {
      case "REQUESTED":
        return <Badge variant="secondary">MENUNGGU ACC</Badge>;
      case "WAITING_PICKUP":
        return <Badge variant="amber">SIAP DIAMBIL</Badge>;
      case "BORROWED":
        return <Badge variant="emerald">DIPINJAM</Badge>;
      case "OVERDUE":
        return <Badge variant="rose">TERLAMBAT</Badge>;
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
        isOverdue && "border-rose-400 bg-rose-50/20"
      )}
    >
      <div className="flex gap-3.5 items-start sm:items-center flex-1 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 border-2 border-blue-900 shadow-[1px_1px_0px_#1E3A8A] text-blue-950 group-hover:bg-orange-500 group-hover:text-white transition-colors">
          <BookOpen className="h-5 w-5" />
        </div>

        <div className="flex flex-col min-w-0 gap-1">
          <h4 className="text-sm font-black text-blue-950 truncate group-hover:text-orange-600 transition-colors">
            {archiveTitle}
          </h4>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase text-blue-950 bg-slate-100 border border-blue-900 px-2 py-0.5 rounded-sm shadow-[1px_1px_0px_#1E3A8A]">
              {archiveType}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Calendar className="h-3.5 w-3.5 text-orange-500" />
              <span>
                {requestDate} {dueDate ? `→ ${dueDate}` : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-2.5 mt-1 sm:mt-0 pl-13 sm:pl-0">
        {isOverdue && fineAmount && fineAmount > 0 && (
          <Badge
            variant="rose"
            className="font-mono text-xs font-black shadow-[1px_1px_0px_#991B1B]"
          >
            Rp {fineAmount.toLocaleString("id-ID")}
          </Badge>
        )}
        <Badge
          variant="outline"
          className="bg-slate-100 font-mono text-[11px] font-black text-blue-950 tracking-wider shadow-[1px_1px_0px_#1E3A8A] shrink-0"
        >
          {pickupCode}
        </Badge>
        {getStatusBadge(status)}
        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all shrink-0" />
      </div>
    </Card>
  );
}

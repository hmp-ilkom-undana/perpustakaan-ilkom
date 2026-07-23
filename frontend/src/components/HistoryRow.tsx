import { BookOpen, Calendar, ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";

export type HistoryStatus = "RETURNED" | "CANCELLED" | "REJECTED" | "DAMAGED" | "LOST";

export interface HistoryItemProps {
  id: string;
  title: string;
  type: string;
  borrowDate: string;
  returnDate: string;
  status: HistoryStatus;
  fine?: number;
  paymentDate?: string;
  note?: string;
}

export function HistoryRow({ item, onClick }: { item: HistoryItemProps, onClick?: () => void }) {
  const getStatusBadge = (status: HistoryStatus) => {
    switch (status) {
      case "RETURNED":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 rounded-full text-[10px] font-bold px-3 py-0.5 border-transparent">DIKEMBALIKAN</Badge>;
      case "DAMAGED":
        return <Badge className="bg-amber-500 hover:bg-amber-600 rounded-full text-[10px] font-bold px-3 py-0.5 border-transparent">RUSAK</Badge>;
      case "LOST":
        return <Badge className="bg-rose-600 hover:bg-rose-700 rounded-full text-[10px] font-bold px-3 py-0.5 border-transparent">HILANG</Badge>;
      case "CANCELLED":
        return <Badge className="bg-slate-400 hover:bg-slate-500 rounded-full text-[10px] font-bold px-3 py-0.5 border-transparent">DIBATALKAN</Badge>;
      case "REJECTED":
        return <Badge className="bg-rose-500 hover:bg-rose-600 rounded-full text-[10px] font-bold px-3 py-0.5 border-transparent">DITOLAK</Badge>;
      default:
        return null;
    }
  };

  return (
    <div 
      onClick={onClick}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 py-4 px-2 sm:px-4 group cursor-pointer hover:bg-slate-50 transition-colors rounded-lg last:border-b-0"
    >
      <div className="flex gap-4 items-start sm:items-center flex-1 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
          <BookOpen className="h-5 w-5" />
        </div>
        
        <div className="flex flex-col min-w-0 gap-1.5">
          <h4 className="text-sm font-semibold text-slate-900 truncate">
            {item.title}
          </h4>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
              {item.type}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Calendar className="h-3 w-3" />
              <span>{item.borrowDate} - {item.returnDate}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0 pl-14 sm:pl-0">
        {getStatusBadge(item.status)}
        <ChevronRight className="h-4 w-4 text-slate-300 hidden sm:block group-hover:text-blue-500 transition-colors" />
      </div>
    </div>
  );
}

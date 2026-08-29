import { BookOpen, Calendar, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { UnifiedLoanItem } from "@/hooks/usePeminjamanPage";
import { cn } from "@/lib/utils";

interface LoanCardRowProps {
  item: UnifiedLoanItem;
  onClick?: () => void;
}

export function LoanCardRow({ item, onClick }: LoanCardRowProps) {
  const getStatusBadge = (status: UnifiedLoanItem["status"]) => {
    switch (status) {
      case "REQUESTED":
        return <Badge variant="secondary">MENUNGGU ACC</Badge>;
      case "WAITING_PICKUP":
        return <Badge variant="amber">SIAP DIAMBIL</Badge>;
      case "BORROWED":
        return <Badge variant="emerald">DIPINJAM</Badge>;
      case "OVERDUE":
        return <Badge variant="rose">TERLAMBAT</Badge>;
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
        "p-4 sm:p-5 flex flex-col gap-3.5 group cursor-pointer transition-all duration-200",
        item.hasUnpaidFine && "border-rose-400 bg-rose-50/20 shadow-[4px_4px_0px_#E11D48]"
      )}
    >
      {/* 1. Baris Utama: Ikon & Detail Teks Terstruktur */}
      <div className="flex gap-3.5 items-start">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] text-blue-950 group-hover:bg-orange-500 group-hover:text-white transition-colors mt-0.5">
          <BookOpen className="h-5 w-5" />
        </div>

        <div className="flex flex-col min-w-0 gap-1.5 flex-1">
          {/* Judul Buku / Arsip */}
          <h4 className="text-sm sm:text-base font-black text-blue-950 line-clamp-2 group-hover:text-orange-600 transition-colors leading-snug">
            {item.title}
          </h4>

          {/* Baris Badge Tipe & Tanggal Konsisten */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 pt-0.5">
            <span className="w-fit text-[10px] font-black uppercase text-blue-950 bg-slate-100 border border-blue-900 px-2 py-0.5 rounded shadow-[1px_1px_0px_#1E3A8A]">
              {item.archiveType}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Calendar className="h-3.5 w-3.5 text-orange-500 shrink-0" />
              <span>{item.dateDisplay}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Baris Footer: Kode Pickup & Nominal Denda (Kiri), Badge Status & Chevron (Kanan) */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t-2 border-blue-900/10">
        <div className="flex items-center gap-2 flex-wrap">
          {item.hasUnpaidFine && item.fineAmount !== undefined && item.fineAmount > 0 && (
            <Badge
              variant="rose"
              className="font-mono text-xs font-black shadow-[1px_1px_0px_#991B1B] animate-pulse whitespace-nowrap"
            >
              Rp {(item.fineAmount ?? 0).toLocaleString("id-ID")}
            </Badge>
          )}
          <Badge
            variant="outline"
            className="bg-slate-100 font-mono text-[11px] font-black text-blue-950 tracking-wider shadow-[1px_1px_0px_#1E3A8A] shrink-0"
          >
            {item.pickupCode}
          </Badge>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {getStatusBadge(item.status)}
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>
      </div>
    </Card>
  );
}

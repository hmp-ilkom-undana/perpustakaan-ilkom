import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StudentHistoryItem, HistoryStatus } from "@/hooks/useStudentHistory";
import { HistoryTimelineSection } from "./HistoryTimelineSection";
import { HistoryFineSection } from "./HistoryFineSection";

interface HistoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: StudentHistoryItem | null;
  onContactAdmin: (item: StudentHistoryItem) => void;
}

export function HistoryDetailModal({
  isOpen,
  onClose,
  item,
  onContactAdmin,
}: HistoryDetailModalProps) {
  if (!item) return null;

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
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-[calc(100vw-32px)] sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pr-6 sm:pr-8 text-left">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              {getStatusBadge(item.status)}
              <Badge variant="outline" className="text-[10px] font-bold">
                {item.type}
              </Badge>
            </div>
            <Badge
              variant="outline"
              className="bg-slate-100 font-mono text-[11px] font-black text-blue-950 tracking-wider shadow-[1px_1px_0px_#1E3A8A] shrink-0"
            >
              {item.pickupCode}
            </Badge>
          </div>
          <DialogTitle className="text-base sm:text-lg font-black text-blue-950 leading-snug">
            {item.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-medium">
            Rekam jejak transaksi peminjaman arsip yang telah selesai.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 flex flex-col gap-3 sm:gap-4 text-xs font-semibold">
          {/* 1. Rincian Garis Waktu */}
          <HistoryTimelineSection item={item} />

          {/* 2. Informasi Status Denda & Pelunasan */}
          <HistoryFineSection
            item={item}
            onContactAdmin={() => onContactAdmin(item)}
          />

          {/* 3. Catatan Petugas (Jika Ada) */}
          {item.note && item.note !== "-" && (
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-950">
                Catatan Petugas:
              </span>
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A]">
                <AlertCircle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {item.note}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto font-bold"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { HistoryItemProps, HistoryStatus } from "./HistoryRow";
import { Badge } from "./ui/badge";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Receipt,
  FileText
} from "lucide-react";

interface HistoryDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: HistoryItemProps | null;
}

export function HistoryDetailDialog({ isOpen, onOpenChange, item }: HistoryDetailDialogProps) {
  if (!item) return null;

  const getStatusBadge = (status: HistoryStatus) => {
    switch (status) {
      case "RETURNED":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 rounded-full text-xs font-bold px-3 py-1 border-transparent">DIKEMBALIKAN</Badge>;
      case "DAMAGED":
        return <Badge className="bg-amber-500 hover:bg-amber-600 rounded-full text-xs font-bold px-3 py-1 border-transparent">RUSAK</Badge>;
      case "LOST":
        return <Badge className="bg-rose-600 hover:bg-rose-700 rounded-full text-xs font-bold px-3 py-1 border-transparent">HILANG</Badge>;
      case "CANCELLED":
        return <Badge className="bg-slate-400 hover:bg-slate-500 rounded-full text-xs font-bold px-3 py-1 border-transparent">DIBATALKAN</Badge>;
      case "REJECTED":
        return <Badge className="bg-rose-500 hover:bg-rose-600 rounded-full text-xs font-bold px-3 py-1 border-transparent">DITOLAK</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white rounded-xl">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 text-blue-600">
            <BookOpen className="h-6 w-6" />
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900 mt-4 leading-tight pr-8">
            {item.title}
          </DialogTitle>
          <DialogDescription className="flex items-center flex-wrap gap-2 mt-2">
            {getStatusBadge(item.status)}
            <Badge variant="outline" className="text-slate-600 font-medium bg-white">{item.type}</Badge>
            <span className="text-sm text-slate-500 ml-1">ID: {item.id}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 flex flex-col gap-5">
          {/* Timeline Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Rincian Waktu</h4>
            
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 mt-0.5">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">Tanggal Pengajuan</span>
                <span className="text-xs text-slate-500">{item.borrowDate}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 mt-0.5">
                <Clock className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">
                  {item.status === "RETURNED" ? "Tanggal Dikembalikan" : 
                   item.status === "DAMAGED" ? "Tanggal Dikembalikan (Rusak)" :
                   item.status === "LOST" ? "Dinyatakan Hilang" :
                   item.status === "REJECTED" ? "Tanggal Ditolak" : "Tanggal Dibatalkan"}
                </span>
                <span className="text-xs text-slate-500">{item.returnDate}</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 my-1"></div>

          {/* Additional Info Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Informasi Tambahan</h4>
            
            {(item.fine !== undefined && item.fine > 0) && (
              <div className="flex flex-col gap-3 p-4 rounded-lg bg-rose-50 border border-rose-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-600">
                    <Receipt className="h-4 w-4" />
                    <span className="text-sm font-semibold">Total Denda</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.paymentDate && (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-[10px] px-2 py-0 h-5">✓ LUNAS</Badge>
                    )}
                    <span className="text-sm font-bold text-rose-600">Rp {item.fine.toLocaleString('id-ID')}</span>
                  </div>
                </div>
                {item.paymentDate && (
                  <div className="text-[10px] font-medium text-rose-600/80 text-right">
                    Dibayar pada: {item.paymentDate}
                  </div>
                )}
              </div>
            )}

            {(item.fine === 0 || item.fine === undefined) && item.status === "RETURNED" && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <FileText className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-emerald-700">Tepat Waktu</span>
                  <span className="text-xs text-emerald-600/80 mt-0.5">Dikembalikan tepat waktu. Tidak ada denda.</span>
                </div>
              </div>
            )}

            {item.note && item.note !== "-" && (
              <div className="flex flex-col gap-2 mt-4">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Catatan Petugas</span>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <AlertCircle className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed">{item.note}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

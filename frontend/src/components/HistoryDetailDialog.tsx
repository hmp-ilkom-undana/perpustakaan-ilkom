import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { HistoryItemProps, HistoryStatus } from "./HistoryRow";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useSystemSettingQuery } from "@/hooks/queries/useSettingQuery";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Receipt,
  FileText,
  Phone,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface HistoryDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: HistoryItemProps | null;
}

export function HistoryDetailDialog({ isOpen, onOpenChange, item }: HistoryDetailDialogProps) {
  const { data: session } = authClient.useSession();
  const { data: setting } = useSystemSettingQuery();
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

  const handleContactAdminWa = () => {
    const rawNumber = setting?.adminWaNumber || "082339113591";
    const cleanNumber = rawNumber.replace(/\D/g, "");
    const formattedNumber = cleanNumber.startsWith("0") ? "62" + cleanNumber.slice(1) : cleanNumber;
    const studentName = session?.user?.name || "Mahasiswa";
    const studentNim = (session?.user as any)?.nim || "-";
    const archiveType = item.type || "Arsip";

    const text = encodeURIComponent(
      `Halo ${setting?.adminContactName || "Admin Perpustakaan ILKOM"},\n\nSaya ingin konfirmasi pembayaran denda peminjaman:\n- Nama: ${studentName}\n- NIM: ${studentNim}\n- Judul ${archiveType}: ${item.title}\n- Total Denda: Rp ${(item.fine || 0).toLocaleString("id-ID")}\n\nMohon informasi petunjuk pembayarannya. Terima kasih.`
    );

    window.open(`https://wa.me/${formattedNumber}?text=${text}`, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="pr-8">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              {getStatusBadge(item.status)}
              <Badge variant="outline">{item.type}</Badge>
            </div>
            <Badge
              variant="outline"
              className="bg-slate-100 font-mono text-xs font-black text-blue-950 tracking-wider shadow-[1px_1px_0px_#1E3A8A] shrink-0"
            >
              {item.pickupCode}
            </Badge>
          </div>
          <DialogTitle>
            {item.title}
          </DialogTitle>
          <DialogDescription>
            Rekam jejak transaksi peminjaman arsip yang telah selesai.
          </DialogDescription>
        </DialogHeader>

        <div className="py-3 flex flex-col gap-4 text-xs font-semibold">
          {/* Timeline Section */}
          <div className="bg-slate-50 border-2 border-blue-900/30 rounded-lg p-3.5 space-y-2.5">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-blue-950">
              Rincian Garis Waktu
            </h4>
            
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-orange-500" />
                Tanggal Pengajuan
              </span>
              <span className="font-bold text-blue-950">{item.borrowDate}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-orange-500" />
                {item.status === "RETURNED" ? "Tanggal Selesai" : 
                 item.status === "DAMAGED" ? "Dikembalikan (Rusak)" :
                 item.status === "LOST" ? "Dinyatakan Hilang" :
                 item.status === "REJECTED" ? "Tanggal Ditolak" : "Tanggal Dibatalkan"}
              </span>
              <span className="font-bold text-blue-950">{item.returnDate}</span>
            </div>
          </div>

          {/* Denda Section */}
          {item.fine !== undefined && item.fine > 0 && (
            <div
              className={cn(
                "p-4 rounded-lg border-2 space-y-3 transition-colors",
                item.paymentDate
                  ? "bg-emerald-50/70 border-emerald-600 shadow-[3px_3px_0px_#059669]"
                  : "bg-rose-50 border-rose-500 shadow-[3px_3px_0px_#E11D48]",
              )}
            >
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "flex items-center gap-2 font-black text-sm",
                    item.paymentDate ? "text-emerald-950" : "text-rose-950",
                  )}
                >
                  <Receipt
                    className={cn(
                      "h-4 w-4",
                      item.paymentDate ? "text-emerald-600" : "text-rose-600",
                    )}
                  />
                  <span>
                    {item.paymentDate ? "Denda (Telah Dilunasi)" : "Total Tagihan Denda"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {item.paymentDate && (
                    <Badge variant="emerald" className="text-[10px] font-black">
                      ✓ LUNAS
                    </Badge>
                  )}
                  <span
                    className={cn(
                      "text-base font-black",
                      item.paymentDate ? "text-emerald-700" : "text-rose-600",
                    )}
                  >
                    Rp {item.fine.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {item.paymentDate ? (
                <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-[11px] font-semibold text-emerald-800">
                  <span>Status Pelunasan</span>
                  <span className="font-bold">Dilunasi pada {item.paymentDate}</span>
                </div>
              ) : (
                <div className="pt-2 border-t border-rose-200 flex flex-col gap-2">
                  <p className="text-[11px] text-rose-800 font-medium leading-relaxed">
                    Silakan hubungi admin atau petugas via WhatsApp untuk verifikasi pelunasan denda.
                  </p>
                  <Button
                    type="button"
                    variant="success"
                    size="sm"
                    onClick={handleContactAdminWa}
                    className="w-full"
                  >
                    <Phone className="w-3.5 h-3.5 mr-1.5" />
                    Konfirmasi Pembayaran via WhatsApp
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* No fine returned */}
          {(item.fine === 0 || item.fine === undefined) && item.status === "RETURNED" && (
            <div className="flex items-center gap-3 p-3.5 rounded-lg bg-emerald-50 border-2 border-emerald-500 shadow-[2px_2px_0px_#059669]">
              <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-black text-emerald-950">Pengembalian Tepat Waktu</p>
                <p className="text-[11px] text-emerald-800 font-medium">Arsip dikembalikan tanpa denda atau kerusakan.</p>
              </div>
            </div>
          )}

          {/* Notes */}
          {item.note && item.note !== "-" && (
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-950">Catatan Petugas:</span>
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border-2 border-blue-900/30">
                <AlertCircle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 font-medium leading-relaxed">{item.note}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

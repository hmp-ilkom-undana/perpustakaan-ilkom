import { Receipt, FileText, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StudentHistoryItem } from "@/hooks/useStudentHistory";
import { cn } from "@/lib/utils";

interface HistoryFineSectionProps {
  item: StudentHistoryItem;
  onContactAdmin: () => void;
}

export function HistoryFineSection({
  item,
  onContactAdmin,
}: HistoryFineSectionProps) {
  const hasFine = item.fine !== undefined && item.fine > 0;
  const isReturnedClean =
    (!item.fine || item.fine === 0) && item.status === "RETURNED";

  if (hasFine) {
    const isPaid = Boolean(item.paymentDate);

    return (
      <div
        className={cn(
          "p-3.5 sm:p-4 rounded-lg border-2 border-blue-900 space-y-2.5 sm:space-y-3 shadow-[3px_3px_0px_#1E3A8A]",
          isPaid ? "bg-emerald-50" : "bg-rose-50"
        )}
      >
        {/* Header Denda & Status Badge */}
        <div className="flex items-center justify-between gap-2">
          <div
            className={cn(
              "flex items-center gap-2 font-black text-xs sm:text-sm",
              isPaid ? "text-emerald-950" : "text-rose-950"
            )}
          >
            <Receipt
              className={cn(
                "h-4 w-4 shrink-0",
                isPaid ? "text-emerald-600" : "text-rose-600"
              )}
            />
            <span>{isPaid ? "Denda (Telah Dilunasi)" : "Total Tagihan Denda"}</span>
          </div>

          {isPaid && (
            <Badge variant="emerald" className="text-[10px] font-black shrink-0 px-2 py-0.5">
              ✓ LUNAS
            </Badge>
          )}
        </div>

        {/* Nominal Denda Card Display */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-white border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A]">
          <span className="text-xs font-bold text-slate-600">Total Nominal Denda:</span>
          <span
            className={cn(
              "text-base sm:text-lg font-black font-mono",
              isPaid ? "text-emerald-700" : "text-rose-600"
            )}
          >
            Rp {(item.fine || 0).toLocaleString("id-ID")}
          </span>
        </div>

        {/* Status Pelunasan ATAU Tombol WhatsApp */}
        {isPaid ? (
          <div className="pt-2 border-t-2 border-emerald-900/20 flex flex-col gap-1.5 text-[11px] font-semibold text-emerald-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-emerald-800">
              <span>Status Pelunasan:</span>
              <span className="font-bold">Dilunasi pada {item.paymentDate}</span>
            </div>
            {item.finePaymentMethod && (
              <div className="flex justify-between items-center text-[10px] text-emerald-900">
                <span className="font-bold">Metode Pembayaran:</span>
                <span className="font-bold font-mono">
                  {item.finePaymentMethod} {item.fineReceivedBy ? `(Kasir: ${item.fineReceivedBy})` : ""}
                </span>
              </div>
            )}
            {item.fineNotes && (
              <div className="p-2 bg-emerald-100/80 border border-emerald-300 rounded text-[11px] text-emerald-950 italic mt-0.5">
                Catatan Kasir: "{item.fineNotes}"
              </div>
            )}
          </div>
        ) : (
          <div className="pt-2 border-t-2 border-rose-900/20 flex flex-col gap-2.5">
            <p className="text-xs text-rose-900 font-medium leading-relaxed">
              Silakan hubungi admin atau petugas via WhatsApp untuk verifikasi
              pelunasan denda.
            </p>
            <Button
              type="button"
              variant="success"
              onClick={onContactAdmin}
              className="w-full font-bold h-10 text-xs shadow-[2px_2px_0px_#065F46] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5" />
              Konfirmasi Pembayaran Denda
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (isReturnedClean) {
    return (
      <div className="flex items-center gap-3 p-3.5 rounded-lg bg-emerald-50 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A]">
        <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
        <div>
          <p className="text-xs font-black text-emerald-950">
            Pengembalian Tepat Waktu
          </p>
          <p className="text-[11px] text-emerald-800 font-medium">
            Arsip dikembalikan tanpa denda atau kerusakan.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

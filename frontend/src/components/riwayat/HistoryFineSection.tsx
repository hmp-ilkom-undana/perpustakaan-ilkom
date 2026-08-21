import { Receipt, FileText, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StudentHistoryItem } from "@/hooks/useStudentHistory";

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
        className={`p-4 rounded-lg border-2 border-blue-900 space-y-3 shadow-[3px_3px_0px_#1E3A8A] ${
          isPaid ? "bg-emerald-50" : "bg-rose-50"
        }`}
      >
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center gap-2 font-black text-sm ${
              isPaid ? "text-emerald-950" : "text-rose-950"
            }`}
          >
            <Receipt
              className={`h-4 w-4 ${
                isPaid ? "text-emerald-600" : "text-rose-600"
              }`}
            />
            <span>
              {isPaid ? "Denda (Telah Dilunasi)" : "Total Tagihan Denda"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isPaid && (
              <Badge variant="emerald" className="text-[10px] font-black">
                ✓ LUNAS
              </Badge>
            )}
            <span
              className={`text-base font-black ${
                isPaid ? "text-emerald-700" : "text-rose-600"
              }`}
            >
              Rp {(item.fine || 0).toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {isPaid ? (
          <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-[11px] font-semibold text-emerald-800">
            <span>Status Pelunasan</span>
            <span className="font-bold">Dilunasi pada {item.paymentDate}</span>
          </div>
        ) : (
          <div className="pt-2 border-t border-rose-200 flex flex-col gap-2">
            <p className="text-[11px] text-rose-800 font-medium leading-relaxed">
              Silakan hubungi admin atau petugas via WhatsApp untuk verifikasi
              pelunasan denda.
            </p>
            <Button
              type="button"
              variant="success"
              size="sm"
              onClick={onContactAdmin}
              className="w-full font-bold"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5" />
              Konfirmasi Pembayaran via WhatsApp
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

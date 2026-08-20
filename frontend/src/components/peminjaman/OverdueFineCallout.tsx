import { AlertTriangle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OverdueFineCalloutProps {
  fineAmount: number;
  onContactAdmin: () => void;
}

export function OverdueFineCallout({
  fineAmount,
  onContactAdmin,
}: OverdueFineCalloutProps) {
  return (
    <div className="bg-rose-50 border-2 border-blue-900 rounded-lg p-4 sm:p-5 shadow-[4px_4px_0px_#1E3A8A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-black text-rose-950">
              Tunggakan Denda: Rp {fineAmount.toLocaleString("id-ID")}
            </h4>
            <Badge variant="rose" className="text-[10px]">
              TERLAMBAT
            </Badge>
          </div>
          <p className="text-xs text-rose-800 font-medium leading-relaxed">
            Arsip telah melewati batas waktu pengembalian. Harap segera lakukan pembayaran denda dan kembalikan fisik arsip ke ruangan HMP.
          </p>
        </div>
      </div>

      <Button
        type="button"
        variant="success"
        size="sm"
        onClick={onContactAdmin}
        className="w-full sm:w-auto shrink-0 font-bold"
      >
        <Phone className="w-4 h-4 mr-1.5" />
        Bayar Denda via WhatsApp
      </Button>
    </div>
  );
}

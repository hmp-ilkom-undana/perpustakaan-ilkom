import { AlertTriangle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";

interface OverdueFineCalloutProps {
  fineAmount: number;
  onContactAdmin: () => void;
}

export function OverdueFineCallout({
  fineAmount,
  onContactAdmin,
}: OverdueFineCalloutProps) {
  return (
    <div className="bg-rose-50 border-2 border-blue-900 rounded-xl p-4 sm:p-5 shadow-[3px_3px_0px_#1E3A8A] flex flex-col gap-3.5 animate-in fade-in duration-200">
      {/* 1. Header: Ikon, Judul & Status Badge */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b-2 border-rose-200">
        <div className="flex items-center gap-2 text-rose-950 font-black text-xs sm:text-sm">
          <div className="w-6 h-6 rounded bg-rose-200 border border-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-3.5 w-3.5 text-rose-700" />
          </div>
          <span>Tunggakan Denda Keterlambatan</span>
        </div>
      </div>

      {/* 2. Nominal Display Box */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-white border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A]">
        <span className="text-xs font-bold text-slate-600">Total Tagihan:</span>
        <span className="text-base sm:text-lg font-black font-mono text-rose-600">
          {formatRupiah(fineAmount)}
        </span>
      </div>

      {/* 3. Deskripsi Informasi */}
      <p className="text-xs text-rose-900 font-medium leading-relaxed">
        Arsip telah melewati batas waktu pengembalian. Harap segera lakukan pelunasan denda dan kembalikan arsip ke ruang HMP.
      </p>

      {/* 4. Tombol WhatsApp Lebar Penuh */}
      <Button
        type="button"
        variant="success"
        size="sm"
        onClick={onContactAdmin}
        className="w-full font-bold text-xs shadow-[2px_2px_0px_#065F46] hover:shadow-[3px_3px_0px_#065F46] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all py-2"
      >
        <Phone className="w-3.5 h-3.5 mr-2" />
        Konfirmasi Pembayaran Denda
      </Button>
    </div>
  );
}

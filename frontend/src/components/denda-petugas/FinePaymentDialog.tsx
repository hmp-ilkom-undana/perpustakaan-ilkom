import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Receipt, Wallet, DollarSign, Loader2, CheckCircle2 } from "lucide-react";
import type { FineItem } from "@/services/fine.service";
import type { PaymentMethod } from "@/hooks/usePetugasDenda";

interface FinePaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFine: FineItem | null;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  paymentNotes: string;
  onPaymentNotesChange: (notes: string) => void;
  isPaying: boolean;
  onConfirmPayment: () => void;
}

export function FinePaymentDialog({
  isOpen,
  onOpenChange,
  selectedFine,
  paymentMethod,
  onPaymentMethodChange,
  paymentNotes,
  onPaymentNotesChange,
  isPaying,
  onConfirmPayment,
}: FinePaymentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md z-[60] border-4 border-blue-900 shadow-[6px_6px_0px_#1E3A8A] rounded-xl bg-white p-6">
        <DialogHeader className="border-b-2 border-blue-900 pb-3 text-left">
          <DialogTitle className="text-xl font-black text-blue-950 uppercase tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-orange-500" />
            Kasir Pelunasan Denda
          </DialogTitle>
          <DialogDescription className="text-xs font-semibold text-slate-500 mt-0.5">
            Pastikan dana pembayaran telah diterima fisik/rekening sebelum konfirmasi pelunasan pada sistem.
          </DialogDescription>
        </DialogHeader>

        {selectedFine && (
          <div className="space-y-4 py-2">
            {/* RINGKASAN TAGIHAN */}
            <div className="bg-amber-50/80 p-4 rounded-xl border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">Mahasiswa</span>
                <span className="font-black text-blue-950">
                  {selectedFine.studentName}{" "}
                  <span className="text-slate-500 font-bold">({selectedFine.studentId})</span>
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">Kode Transaksi</span>
                <span className="font-mono font-black text-blue-900">
                  {selectedFine.transactionId}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">Jenis Pelanggaran</span>
                <span className="font-black text-rose-600 uppercase">
                  {selectedFine.fineType}
                </span>
              </div>
              <div className="border-t-2 border-blue-900/40 pt-2 flex justify-between items-center">
                <span className="text-xs font-black text-blue-950 uppercase tracking-wider">
                  Total Wajib Bayar
                </span>
                <span className="text-xl font-black text-rose-600">
                  Rp {selectedFine.amount.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* PILIHAN METODE PEMBAYARAN */}
            <div className="space-y-1.5">
              <Label className="text-xs font-black text-blue-950 uppercase tracking-wider block">
                Metode Pembayaran <span className="text-rose-600">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center gap-2.5 p-3 rounded-lg border-2 border-blue-900 cursor-pointer transition-all ${
                    paymentMethod === "Tunai"
                      ? "bg-amber-300 text-blue-950 font-black shadow-[3px_3px_0px_#1E3A8A]"
                      : "bg-white text-slate-700 font-bold hover:bg-slate-50 shadow-[1.5px_1.5px_0px_#1E3A8A]"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Tunai"
                    checked={paymentMethod === "Tunai"}
                    onChange={() => onPaymentMethodChange("Tunai")}
                    className="hidden"
                    disabled={isPaying}
                  />
                  <Wallet className="w-4 h-4 text-blue-950 shrink-0" />
                  <span className="text-xs">Tunai (Cash)</span>
                </label>

                <label
                  className={`flex items-center gap-2.5 p-3 rounded-lg border-2 border-blue-900 cursor-pointer transition-all ${
                    paymentMethod === "Transfer"
                      ? "bg-amber-300 text-blue-950 font-black shadow-[3px_3px_0px_#1E3A8A]"
                      : "bg-white text-slate-700 font-bold hover:bg-slate-50 shadow-[1.5px_1.5px_0px_#1E3A8A]"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Transfer"
                    checked={paymentMethod === "Transfer"}
                    onChange={() => onPaymentMethodChange("Transfer")}
                    className="hidden"
                    disabled={isPaying}
                  />
                  <DollarSign className="w-4 h-4 text-blue-950 shrink-0" />
                  <span className="text-xs">Transfer Bank</span>
                </label>
              </div>
            </div>

            {/* CATATAN KASIR */}
            <div className="space-y-1.5">
              <Label
                htmlFor="fine-notes"
                className="text-xs font-black text-blue-950 uppercase tracking-wider block"
              >
                Catatan Kasir <span className="text-slate-400 font-medium lowercase">(opsional)</span>
              </Label>
              <Input
                id="fine-notes"
                placeholder="Contoh: Uang pas / Bukti transfer ref #1234..."
                value={paymentNotes}
                onChange={(e) => onPaymentNotesChange(e.target.value)}
                disabled={isPaying}
                className="border-2 border-blue-900 rounded-lg bg-slate-50 font-semibold text-blue-950 placeholder:text-slate-400 shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:bg-white h-10 text-xs"
              />
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-2 border-t-2 border-blue-900 pt-4 mt-2 flex flex-col-reverse sm:flex-row">
          <Button
            type="button"
            variant="outline"
            disabled={isPaying}
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-1/2 font-bold"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="success"
            disabled={isPaying}
            onClick={onConfirmPayment}
            className="w-full sm:w-1/2 font-black cursor-pointer"
          >
            {isPaying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Memproses...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Konfirmasi Lunas
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

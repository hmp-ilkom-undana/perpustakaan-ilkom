import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CirculationRejectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  rejectReason: string;
  onRejectReasonChange: (val: string) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function CirculationRejectDialog({
  isOpen,
  onOpenChange,
  rejectReason,
  onRejectReasonChange,
  onConfirm,
  isSubmitting,
}: CirculationRejectDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-2 border-blue-900 shadow-[6px_6px_0px_#1E3A8A] rounded-xl">
        <DialogHeader>
          <DialogTitle className="font-heading font-black text-lg text-rose-700">
            Tolak Pengajuan
          </DialogTitle>
          <DialogDescription className="text-xs font-semibold text-slate-600">
            Silakan tuliskan alasan mengapa pengajuan ini ditolak. Alasan ini akan dapat dilihat langsung oleh mahasiswa.
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 space-y-1.5">
          <label className="text-xs font-bold text-blue-950 uppercase tracking-wider block">
            Alasan Penolakan
          </label>
          <textarea
            className="w-full border-2 border-blue-900 rounded-lg p-3 text-xs md:text-sm font-semibold text-blue-950 shadow-[2px_2px_0px_#1E3A8A] focus:shadow-[4px_4px_0px_#E11D48] focus:border-rose-600 outline-none transition-all"
            rows={3}
            placeholder="Contoh: Arsip fisik sedang dalam proses konservasi/restorasi..."
            value={rejectReason}
            onChange={(e) => onRejectReasonChange(e.target.value)}
          />
        </div>

        <DialogFooter className="mt-2 flex flex-row justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isSubmitting || rejectReason.trim() === ""}
          >
            {isSubmitting ? "Memproses..." : "Tolak Pengajuan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

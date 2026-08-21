import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CirculationApproveDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function CirculationApproveDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  isSubmitting,
}: CirculationApproveDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-2 border-blue-900 shadow-[6px_6px_0px_#1E3A8A] rounded-xl">
        <DialogHeader>
          <DialogTitle className="font-heading font-black text-lg text-blue-950">
            Konfirmasi Persetujuan
          </DialogTitle>
          <DialogDescription className="text-xs font-semibold text-slate-600">
            Apakah Anda yakin ingin menyetujui pengajuan peminjaman ini? Sistem akan membuat Kode Pengambilan (Pickup Code) secara otomatis.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex flex-row justify-end gap-2">
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
            variant="success"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Memproses..." : "Ya, Setujui"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StudentTicketItem } from "@/hooks/useStudentBorrowing";

interface CancelBorrowingDialogProps {
  ticket: StudentTicketItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function CancelBorrowingDialog({
  ticket,
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: CancelBorrowingDialogProps) {
  if (!ticket) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isPending && onClose()}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-blue-900 bg-rose-100 text-rose-600 shadow-[2px_2px_0px_#1E3A8A]">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>Batalkan Antrean Peminjaman?</DialogTitle>
              <DialogDescription>
                Tindakan ini akan membatalkan nomor antrean dan membebaskan kuota arsip.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="rounded-lg border-2 border-blue-900 bg-slate-50 p-4 space-y-2 shadow-[2px_2px_0px_#1E3A8A]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Kode Antrean
            </span>
            <Badge variant="outline" className="font-mono text-xs font-black">
              {ticket.pickupCode}
            </Badge>
          </div>
          <div className="border-t border-slate-200 pt-2">
            <p className="text-xs font-black text-blue-950 line-clamp-2">
              {ticket.archiveTitle}
            </p>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
              Kategori: {ticket.archiveType}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isPending}
          >
            Kembali
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                Membatalkan...
              </>
            ) : (
              "Batalkan Antrean"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

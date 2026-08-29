import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StudentTicketItem } from "@/hooks/useStudentBorrowing";
import { TicketProgress } from "./TicketProgress";
import { BorrowingTimeline } from "./BorrowingTimeline";
import { OverdueFineCallout } from "./OverdueFineCallout";

interface ActiveBorrowingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: StudentTicketItem | null;
  onCancelClick: (ticket: StudentTicketItem) => void;
  onContactAdmin: (ticket: StudentTicketItem) => void;
}

export function ActiveBorrowingDetailModal({
  isOpen,
  onClose,
  ticket,
  onCancelClick,
  onContactAdmin,
}: ActiveBorrowingDetailModalProps) {
  if (!ticket) return null;

  const isOverdueOrFined =
    ticket.status === "OVERDUE" || Boolean(ticket.fineAmount && ticket.fineAmount > 0);
  const canCancel =
    ticket.status === "REQUESTED" || ticket.status === "WAITING_PICKUP";

  const getStatusBadge = (status: StudentTicketItem["status"]) => {
    switch (status) {
      case "REQUESTED":
        return <Badge variant="secondary">MENUNGGU ACC</Badge>;
      case "WAITING_PICKUP":
        return <Badge variant="amber">SIAP DIAMBIL</Badge>;
      case "BORROWED":
        return <Badge variant="emerald">DIPINJAM</Badge>;
      case "OVERDUE":
        return <Badge variant="rose">TERLAMBAT</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-[calc(100vw-32px)] sm:max-w-[540px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pr-8 text-left">
          {/* Header Badges: Mobile = 2 Baris, Desktop/Tablet (sm+) = 1 Baris Sejajar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 mb-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {getStatusBadge(ticket.status)}
              <Badge variant="outline" className="text-[10px] font-bold">
                {ticket.archiveType}
              </Badge>
            </div>
            <div>
              <Badge
                variant="outline"
                className="w-fit bg-slate-100 font-mono text-[11px] font-black text-blue-950 tracking-wider shadow-[1px_1px_0px_#1E3A8A]"
              >
                {ticket.pickupCode}
              </Badge>
            </div>
          </div>

          <DialogTitle className="text-base sm:text-lg font-black text-blue-950 leading-snug">
            {ticket.archiveTitle}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-medium mt-1">
            Pantau tahapan verifikasi, batas penjemputan, dan tenggat pengembalian berkas.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 flex flex-col gap-3 sm:gap-4 text-xs font-semibold">
          {/* 1. Stepper Alur Status Peminjaman */}
          <div className="rounded-lg border-2 border-blue-900 bg-white p-3.5 sm:p-4 shadow-[2px_2px_0px_#1E3A8A]">
            <TicketProgress
              currentStatus={ticket.status}
              requestDate={ticket.requestDate}
              dueDate={ticket.dueDate}
              accDate={ticket.accDate}
              pickupDeadline={ticket.pickupDeadline}
            />
          </div>

          {/* 2. Garis Waktu Peminjaman */}
          <BorrowingTimeline
            status={ticket.status}
            requestDate={ticket.requestDate}
            accDate={ticket.accDate}
            pickupDeadline={ticket.pickupDeadline}
            dueDate={ticket.dueDate}
          />

          {/* 3. Callout Denda jika Terlambat */}
          {isOverdueOrFined && (
            <OverdueFineCallout
              fineAmount={ticket.fineAmount}
              onContactAdmin={() => onContactAdmin(ticket)}
            />
          )}
        </div>

        <DialogFooter className="mt-2 flex flex-col-reverse sm:flex-row sm:justify-between items-stretch sm:items-center gap-2">
          {canCancel ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                onClose();
                onCancelClick(ticket);
              }}
              className="w-full sm:w-auto font-bold"
            >
              Batalkan Antrean
            </Button>
          ) : (
            <div />
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto font-bold"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

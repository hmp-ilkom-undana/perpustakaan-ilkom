import { BookOpen, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TicketProgress } from "@/components/TicketProgress";
import { StudentTicketItem } from "@/hooks/useStudentBorrowing";
import { BorrowingTimeline } from "./BorrowingTimeline";
import { OverdueFineCallout } from "./OverdueFineCallout";

interface ActiveBorrowingDetailProps {
  ticket: StudentTicketItem;
  onCancelClick: (ticket: StudentTicketItem) => void;
  onContactAdmin: (ticket: StudentTicketItem) => void;
}

export function ActiveBorrowingDetail({
  ticket,
  onCancelClick,
  onContactAdmin,
}: ActiveBorrowingDetailProps) {
  const isOverdueOrFined =
    ticket.status === "OVERDUE" || (ticket.fineAmount && ticket.fineAmount > 0);
  const canCancel =
    ticket.status === "REQUESTED" || ticket.status === "WAITING_PICKUP";

  return (
    <div className="border-t-2 border-blue-900 bg-slate-50 p-4 sm:p-6 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
      {/* 1. Informasi Singkat Dokumen */}
      <div className="bg-white border-2 border-blue-900 rounded-lg p-3.5 flex flex-col gap-1.5 shadow-[2px_2px_0px_#1E3A8A]">
        <div className="flex items-start gap-2">
          <BookOpen className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
          <span className="font-black text-sm text-blue-950 leading-snug">
            {ticket.archiveTitle}
          </span>
        </div>
        <div className="flex items-center gap-2 pl-6 text-xs text-slate-600 font-semibold">
          <Info className="h-3.5 w-3.5 text-blue-900 shrink-0" />
          <span>
            Kategori: <b>{ticket.archiveType}</b>
          </span>
        </div>
      </div>

      {/* 2. Stepper Status Transaksi */}
      <div className="rounded-lg border-2 border-blue-900 bg-white p-4 sm:p-5 shadow-[3px_3px_0px_#1E3A8A]">
        <TicketProgress
          currentStatus={ticket.status}
          requestDate={ticket.requestDate}
          dueDate={ticket.dueDate}
          accDate={ticket.accDate}
          pickupDeadline={ticket.pickupDeadline}
        />
      </div>

      {/* 3. Rincian Garis Waktu */}
      <BorrowingTimeline
        status={ticket.status}
        requestDate={ticket.requestDate}
        accDate={ticket.accDate}
        pickupDeadline={ticket.pickupDeadline}
        dueDate={ticket.dueDate}
      />

      {/* 4. Aksi Bawah: Peringatan Denda ATAU Tombol Batalkan Antrean */}
      {isOverdueOrFined ? (
        <OverdueFineCallout
          fineAmount={ticket.fineAmount}
          onContactAdmin={() => onContactAdmin(ticket)}
        />
      ) : canCancel ? (
        <div className="flex justify-end pt-2">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => onCancelClick(ticket)}
          >
            Batalkan Antrean
          </Button>
        </div>
      ) : null}
    </div>
  );
}

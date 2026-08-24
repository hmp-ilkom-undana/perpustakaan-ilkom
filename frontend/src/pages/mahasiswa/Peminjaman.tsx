import { BookOpenCheck, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useStudentBorrowing } from "@/hooks/useStudentBorrowing";
import {
  ActiveBorrowingCard,
  CancelBorrowingDialog,
  EmptyBorrowingState,
} from "@/components/peminjaman";

export default function Peminjaman() {
  const {
    tickets,
    isLoading,
    isCancelling,
    selectedTicket,
    toggleTicket,
    cancelTicketTarget,
    setCancelTicketTarget,
    confirmCancel,
    handleContactAdminWa,
  } = useStudentBorrowing();

  return (
    <div className="flex flex-col gap-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-blue-900 p-4 sm:p-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 text-white border-2 border-blue-900 rounded-lg flex items-center justify-center shadow-[2px_2px_0px_#1E3A8A] shrink-0">
            <BookOpenCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-950">
              Peminjaman Aktif
            </h1>
            <p className="text-slate-500 text-xs font-semibold mt-0.5">
              Pantau status verifikasi, batas penjemputan, dan tenggat pengembalian arsip Anda.
            </p>
          </div>
        </div>

        <Badge
          variant="outline"
          className="w-fit self-start sm:self-auto font-black"
        >
          {tickets.length === 0
            ? "Tidak Ada Antrean"
            : `${tickets.length} Peminjaman Aktif`}
        </Badge>
      </div>

      {/* 2. List Transaksi Aktif / Area Detail */}
      <div className="flex flex-col gap-4 min-h-[300px] px-4 sm:px-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
            <p className="text-xs font-bold text-slate-500">
              Memuat data transaksi aktif...
            </p>
          </div>
        ) : tickets.length > 0 ? (
          tickets.map((ticket) => (
            <ActiveBorrowingCard
              key={ticket.id}
              ticket={ticket}
              isExpanded={selectedTicket?.id === ticket.id}
              onToggle={() => toggleTicket(ticket)}
              onCancelClick={setCancelTicketTarget}
              onContactAdmin={handleContactAdminWa}
            />
          ))
        ) : (
          <EmptyBorrowingState />
        )}
      </div>

      {/* 3. Modal Konfirmasi Pembatalan Antrean (Shadcn Base UI Dialog) */}
      <CancelBorrowingDialog
        ticket={cancelTicketTarget}
        isOpen={cancelTicketTarget !== null}
        onClose={() => setCancelTicketTarget(null)}
        onConfirm={confirmCancel}
        isPending={isCancelling}
      />
    </div>
  );
}

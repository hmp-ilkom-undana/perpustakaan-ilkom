import { Card } from "@/components/ui/card";
import { BorrowingRow } from "@/components/BorrowingRow";
import { StudentTicketItem } from "@/hooks/useStudentBorrowing";
import { ActiveBorrowingDetail } from "./ActiveBorrowingDetail";

interface ActiveBorrowingCardProps {
  ticket: StudentTicketItem;
  isExpanded: boolean;
  onToggle: () => void;
  onCancelClick: (ticket: StudentTicketItem) => void;
  onContactAdmin: (ticket: StudentTicketItem) => void;
}

export function ActiveBorrowingCard({
  ticket,
  isExpanded,
  onToggle,
  onCancelClick,
  onContactAdmin,
}: ActiveBorrowingCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-200">
      {/* Baris Ringkasan Peminjaman */}
      <BorrowingRow
        id={ticket.id}
        pickupCode={ticket.pickupCode}
        archiveTitle={ticket.archiveTitle}
        archiveType={ticket.archiveType}
        status={ticket.status}
        requestDate={ticket.requestDate}
        onClick={onToggle}
      />

      {/* Konten Detail saat Kartu Terbuka */}
      {isExpanded && (
        <ActiveBorrowingDetail
          ticket={ticket}
          onCancelClick={onCancelClick}
          onContactAdmin={onContactAdmin}
        />
      )}
    </Card>
  );
}

import { Card } from "@/components/ui/card";
import { BorrowingRow } from "./BorrowingRow";
import { StudentTicketItem } from "@/hooks/useStudentBorrowing";
import { ActiveBorrowingDetail } from "./ActiveBorrowingDetail";
import { cn } from "@/lib/utils";

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
    <Card
      variant="interactive"
      className={cn(
        "overflow-hidden transition-all duration-200",
        isExpanded && "border-orange-500 shadow-[4px_4px_0px_#F97316]"
      )}
    >
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

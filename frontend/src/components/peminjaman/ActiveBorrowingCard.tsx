import { BorrowingRow } from "./BorrowingRow";
import { StudentTicketItem } from "@/hooks/useStudentBorrowing";

interface ActiveBorrowingCardProps {
  ticket: StudentTicketItem;
  onClick: () => void;
}

export function ActiveBorrowingCard({ ticket, onClick }: ActiveBorrowingCardProps) {
  return (
    <BorrowingRow
      id={ticket.id}
      pickupCode={ticket.pickupCode}
      archiveTitle={ticket.archiveTitle}
      archiveType={ticket.archiveType}
      status={ticket.status}
      requestDate={ticket.requestDate}
      dueDate={ticket.dueDate}
      fineAmount={ticket.fineAmount}
      onClick={onClick}
    />
  );
}

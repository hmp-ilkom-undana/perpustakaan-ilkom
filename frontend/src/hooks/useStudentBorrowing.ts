import { useState, useMemo } from "react";
import { authClient } from "@/lib/auth-client";
import { useMyBorrowingHistoryQuery } from "@/hooks/queries/useBorrowingQuery";
import { useSystemSettingQuery } from "@/hooks/queries/useSettingQuery";
import { useCancelBorrowingMutation } from "@/hooks/queries/useBorrowingMutation";
import { BorrowingStatus } from "@/components/TicketProgress";

export interface StudentTicketItem {
  id: string;
  pickupCode: string;
  archiveTitle: string;
  archiveType: string;
  status: BorrowingStatus;
  fineAmount: number;
  requestDate: string;
  dueDate?: string;
  accDate?: string;
  pickupDeadline?: string;
}

const ACTIVE_STATUSES: string[] = [
  "REQUESTED",
  "WAITING_PICKUP",
  "BORROWED",
  "OVERDUE",
];

function addBusinessDays(
  startDate: Date,
  daysToAdd: number,
  operatingDays: number[] = [1, 2, 3, 4, 5]
): Date {
  const filteredDays = operatingDays?.filter((day) => day >= 0 && day <= 6) ?? [];
  const validDays = filteredDays.length ? filteredDays : [1, 2, 3, 4, 5];
  const result = new Date(startDate);
  let added = 0;
  let safetyCounter = 0;
  while (added < daysToAdd && safetyCounter < 100) {
    result.setDate(result.getDate() + 1);
    safetyCounter++;
    if (validDays.includes(result.getDay())) {
      added++;
    }
  }
  return result;
}

export function useStudentBorrowing() {
  const { data: session } = authClient.useSession();
  const { data: setting } = useSystemSettingQuery();
  const { data: rawHistory = [], isPending: isLoading } = useMyBorrowingHistoryQuery();
  const cancelMutation = useCancelBorrowingMutation();

  const [selectedTicket, setSelectedTicket] = useState<StudentTicketItem | null>(null);
  const [cancelTicketTarget, setCancelTicketTarget] = useState<StudentTicketItem | null>(null);

  const tickets: StudentTicketItem[] = useMemo(() => {
    const pickupDuration = setting?.pickupDurationDays ?? 3;
    const operatingDays = setting?.operatingDays ?? [1, 2, 3, 4, 5];

    return rawHistory
      .filter((item: any) => ACTIVE_STATUSES.includes(item.status))
      .map((item: any) => {
        const id = item.id;
        const pickupCode =
          item.pickupCode || `PK-${id.substring(0, 6).toUpperCase()}`;
        const archiveTitle = item.archive?.title || "Judul Tidak Tersedia";
        const archiveType = item.archive?.archiveType || "Arsip";
        const status = item.status as BorrowingStatus;
        const fineAmount = item.fineAmount || 0;

        const requestDate = new Date(item.borrowDate).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        const dueDate = item.returnDate
          ? new Date(item.returnDate).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : undefined;

        const accDate = item.accDate
          ? new Date(item.accDate).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : undefined;

        const pickupDeadline = item.accDate
          ? (() => {
              const deadlineDate = addBusinessDays(
                new Date(item.accDate),
                pickupDuration,
                operatingDays
              );
              return (
                deadlineDate.toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }) + ", 16:00"
              );
            })()
          : undefined;

        return {
          id,
          pickupCode,
          archiveTitle,
          archiveType,
          status,
          fineAmount,
          requestDate,
          dueDate,
          accDate,
          pickupDeadline,
        };
      });
  }, [rawHistory, setting]);

  const toggleTicket = (ticket: StudentTicketItem) => {
    setSelectedTicket((prev) => (prev?.id === ticket.id ? null : ticket));
  };

  const handleContactAdminWa = (ticket: StudentTicketItem) => {
    const rawNumber = setting?.adminWaNumber || "082339113591";
    const cleanNumber = rawNumber.replace(/\D/g, "");
    const formattedNumber = cleanNumber.startsWith("0")
      ? "62" + cleanNumber.slice(1)
      : cleanNumber;
    const studentName = session?.user?.name || "Mahasiswa";
    const studentNim = (session?.user as any)?.nim || "-";
    const archiveType = ticket.archiveType || "Arsip";

    const message = encodeURIComponent(
      `Halo ${setting?.adminContactName || "Admin Perpustakaan ILKOM"},\n\nSaya ingin konfirmasi pembayaran denda peminjaman:\n- Nama: ${studentName}\n- NIM: ${studentNim}\n- Judul ${archiveType}: ${ticket.archiveTitle}\n- Total Denda: Rp ${(ticket.fineAmount || 0).toLocaleString("id-ID")}\n\nMohon informasi petunjuk pembayarannya. Terima kasih.`
    );

    window.open(
      `https://wa.me/${formattedNumber}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const confirmCancel = async () => {
    if (!cancelTicketTarget) return;
    try {
      await cancelMutation.mutateAsync(cancelTicketTarget.id);
      if (selectedTicket?.id === cancelTicketTarget.id) {
        setSelectedTicket(null);
      }
      setCancelTicketTarget(null);
    } catch {
      // Error handling is handled in mutation onError toast
    }
  };

  return {
    tickets,
    isLoading,
    isCancelling: cancelMutation.isPending,
    selectedTicket,
    setSelectedTicket,
    toggleTicket,
    cancelTicketTarget,
    setCancelTicketTarget,
    confirmCancel,
    handleContactAdminWa,
  };
}

import { useState, useMemo } from "react";
import { authClient } from "@/lib/auth-client";
import { useMyBorrowingHistoryQuery } from "@/hooks/queries/useBorrowingQuery";
import { useSystemSettingQuery } from "@/hooks/queries/useSettingQuery";

export type HistoryStatus =
  | "RETURNED"
  | "CANCELLED"
  | "REJECTED"
  | "DAMAGED"
  | "LOST";

export interface StudentHistoryItem {
  id: string;
  pickupCode: string;
  title: string;
  type: string;
  borrowDate: string;
  returnDate: string;
  status: HistoryStatus;
  fine?: number;
  paymentDate?: string;
  note?: string;
}

const COMPLETED_STATUSES: string[] = [
  "RETURNED",
  "CANCELLED",
  "REJECTED",
  "DAMAGED",
  "LOST",
];

export function useStudentHistory() {
  const { data: session } = authClient.useSession();
  const { data: setting } = useSystemSettingQuery();
  const { data: rawHistory = [], isPending: isLoading } = useMyBorrowingHistoryQuery();

  const [selectedItem, setSelectedItem] = useState<StudentHistoryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const historyData: StudentHistoryItem[] = useMemo(() => {
    return rawHistory
      .filter((item: any) => COMPLETED_STATUSES.includes(item.status))
      .map((item: any) => {
        const id = item.id;
        const pickupCode =
          item.pickupCode || `PK-${id.substring(0, 6).toUpperCase()}`;
        const title = item.archive?.title || "Judul Tidak Tersedia";
        const type = item.archive?.archiveType || "Arsip";
        const status = item.status as HistoryStatus;
        const fine = item.fineAmount;

        const borrowDate = new Date(item.borrowDate).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        const returnDate = item.returnDate
          ? new Date(item.returnDate).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "-";

        const paymentDate = item.finePaidAt
          ? new Date(item.finePaidAt).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : undefined;

        const note = item.catatanKondisiKembali || "-";

        return {
          id,
          pickupCode,
          title,
          type,
          borrowDate,
          returnDate,
          status,
          fine,
          paymentDate,
          note,
        };
      });
  }, [rawHistory]);

  const openDetail = (item: StudentHistoryItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const closeDetail = () => {
    setIsDialogOpen(false);
  };

  const handleContactAdminWa = (item: StudentHistoryItem) => {
    const rawNumber = setting?.adminWaNumber || "082339113591";
    const cleanNumber = rawNumber.replace(/\D/g, "");
    const formattedNumber = cleanNumber.startsWith("0")
      ? "62" + cleanNumber.slice(1)
      : cleanNumber;
    const studentName = session?.user?.name || "Mahasiswa";
    const studentNim = (session?.user as any)?.nim || "-";
    const archiveType = item.type || "Arsip";

    const message = encodeURIComponent(
      `Halo ${setting?.adminContactName || "Admin Perpustakaan ILKOM"},\n\nSaya ingin konfirmasi pembayaran denda peminjaman:\n- Nama: ${studentName}\n- NIM: ${studentNim}\n- Judul ${archiveType}: ${item.title}\n- Total Denda: Rp ${(item.fine || 0).toLocaleString("id-ID")}\n\nMohon informasi petunjuk pembayarannya. Terima kasih.`
    );

    window.open(
      `https://wa.me/${formattedNumber}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return {
    historyData,
    isLoading,
    selectedItem,
    isDialogOpen,
    setIsDialogOpen,
    openDetail,
    closeDetail,
    handleContactAdminWa,
  };
}

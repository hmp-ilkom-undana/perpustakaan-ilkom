import { useState, useMemo } from "react";
import { authClient } from "@/lib/auth-client";
import { useMyBorrowingHistoryQuery } from "@/hooks/queries/useBorrowingQuery";
import { useSystemSettingQuery } from "@/hooks/queries/useSettingQuery";
import { formatRupiah } from "@/lib/utils";

export type HistoryStatus =
  | "RETURNED"
  | "CANCELLED"
  | "REJECTED"
  | "DAMAGED"
  | "LOST";

export type HistoryFilter = "ALL" | "UNPAID_FINE" | "PAID_OR_CLEAN";

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
  finePaymentMethod?: string;
  fineReceivedBy?: string;
  fineNotes?: string;
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
  const [activeFilter, setActiveFilter] = useState<HistoryFilter>("ALL");

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

        const formatDate = (dateStr: any) => {
          if (!dateStr) return "-";
          const date = new Date(dateStr);
          return isNaN(date.getTime())
            ? "-"
            : date.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
        };

        const borrowDate = formatDate(item.borrowDate);
        const returnDate = formatDate(item.returnDate);
        const paymentDate = item.finePaidAt
          ? formatDate(item.finePaidAt)
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
          finePaymentMethod: item.finePaymentMethod,
          fineReceivedBy: item.fineReceivedBy,
          fineNotes: item.fineNotes,
          note,
        };
      });
  }, [rawHistory]);

  const unpaidFinesList = useMemo(() => {
    return historyData.filter(
      (item) => item.fine && item.fine > 0 && !item.paymentDate
    );
  }, [historyData]);

  const unpaidFinesCount = unpaidFinesList.length;

  const totalUnpaidFineAmount = useMemo(() => {
    return unpaidFinesList.reduce((sum, item) => sum + (item.fine || 0), 0);
  }, [unpaidFinesList]);

  const paidOrCleanCount = useMemo(() => {
    return historyData.filter(
      (item) => !item.fine || item.fine === 0 || item.paymentDate
    ).length;
  }, [historyData]);

  const filteredHistory = useMemo(() => {
    if (activeFilter === "UNPAID_FINE") {
      return unpaidFinesList;
    }
    if (activeFilter === "PAID_OR_CLEAN") {
      return historyData.filter(
        (item) => !item.fine || item.fine === 0 || item.paymentDate
      );
    }
    return historyData;
  }, [historyData, activeFilter, unpaidFinesList]);

  const openDetail = (item: StudentHistoryItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const closeDetail = () => {
    setIsDialogOpen(false);
  };

  const handleContactAdminWa = (item?: StudentHistoryItem | null) => {
    const rawNumber = setting?.adminWaNumber || "082339113591";
    const cleanNumber = rawNumber.replace(/\D/g, "");
    const formattedNumber = cleanNumber.startsWith("0")
      ? "62" + cleanNumber.slice(1)
      : cleanNumber;
    const studentName = session?.user?.name || "Mahasiswa";
    const studentNim = (session?.user as any)?.nim || "-";

    let message: string;
    if (item) {
      const archiveType = item.type || "Arsip";
      message = encodeURIComponent(
        `Halo ${setting?.adminContactName || "Admin Perpustakaan ILKOM"},\n\nSaya ingin konfirmasi pembayaran denda peminjaman:\n- Nama: ${studentName}\n- NIM: ${studentNim}\n- Judul ${archiveType}: ${item.title}\n- Total Denda: ${formatRupiah(item.fine)}\n\nMohon informasi petunjuk pembayarannya. Terima kasih.`
      );
    } else {
      message = encodeURIComponent(
        `Halo ${setting?.adminContactName || "Admin Perpustakaan ILKOM"},\n\nSaya ingin konfirmasi pembayaran total denda peminjaman:\n- Nama: ${studentName}\n- NIM: ${studentNim}\n- Total Tunggakan: ${formatRupiah(totalUnpaidFineAmount)} (${unpaidFinesCount} Transaksi)\n\nMohon informasi petunjuk pembayarannya. Terima kasih.`
      );
    }

    window.open(
      `https://wa.me/${formattedNumber}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return {
    historyData,
    filteredHistory,
    isLoading,
    selectedItem,
    isDialogOpen,
    setIsDialogOpen,
    activeFilter,
    setActiveFilter,
    unpaidFinesCount,
    totalUnpaidFineAmount,
    paidOrCleanCount,
    openDetail,
    closeDetail,
    handleContactAdminWa,
  };
}

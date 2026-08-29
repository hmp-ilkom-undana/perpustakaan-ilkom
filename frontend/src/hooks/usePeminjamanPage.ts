import { useState, useMemo, useCallback, useEffect } from "react";
import { useLocation, useSearch } from "@tanstack/react-router";
import { useStudentBorrowing, StudentTicketItem } from "./useStudentBorrowing";
import { useStudentHistory, StudentHistoryItem, HistoryStatus } from "./useStudentHistory";
import { BorrowingStatus } from "@/components/peminjaman";

export type PeminjamanFilter = "ALL" | "ACTIVE" | "UNPAID_FINE" | "COMPLETED";

export interface UnifiedLoanItem {
  id: string;
  sourceType: "ACTIVE" | "HISTORY";
  pickupCode: string;
  title: string;
  archiveType: string;
  status: BorrowingStatus | HistoryStatus;
  dateDisplay: string;
  fineAmount?: number;
  hasUnpaidFine: boolean;
  activeTicket?: StudentTicketItem;
  historyItem?: StudentHistoryItem;
}

export function usePeminjamanPage() {
  const [activeFilter, setActiveFilter] = useState<PeminjamanFilter>("ALL");
  const location = useLocation();
  const search = useSearch({ strict: false }) as {
    selectedId?: string;
    filter?: PeminjamanFilter;
  };

  const borrowing = useStudentBorrowing();
  const history = useStudentHistory();

  const isLoading = borrowing.isLoading || history.isLoading;

  // 1. Map Active Loans
  const activeItems: UnifiedLoanItem[] = useMemo(() => {
    return borrowing.tickets.map((ticket) => ({
      id: ticket.id,
      sourceType: "ACTIVE" as const,
      pickupCode: ticket.pickupCode,
      title: ticket.archiveTitle,
      archiveType: ticket.archiveType,
      status: ticket.status,
      dateDisplay: `${ticket.requestDate}${ticket.dueDate ? ` → ${ticket.dueDate}` : ""}`,
      fineAmount: ticket.fineAmount,
      hasUnpaidFine:
        ticket.status === "OVERDUE" ||
        Boolean(ticket.fineAmount && ticket.fineAmount > 0),
      activeTicket: ticket,
    }));
  }, [borrowing.tickets]);

  // 2. Map Completed History Items
  const historyItems: UnifiedLoanItem[] = useMemo(() => {
    return history.historyData.map((item) => ({
      id: item.id,
      sourceType: "HISTORY" as const,
      pickupCode: item.pickupCode,
      title: item.title,
      archiveType: item.type,
      status: item.status,
      dateDisplay: `${item.borrowDate} → ${item.returnDate}`,
      fineAmount: item.fine,
      hasUnpaidFine: Boolean(item.fine && item.fine > 0 && !item.paymentDate),
      historyItem: item,
    }));
  }, [history.historyData]);

  // 3. Combined List (Active first, then History)
  const allItems = useMemo(() => {
    return [...activeItems, ...historyItems];
  }, [activeItems, historyItems]);

  // 4. Completed Clean Items (Only returned and with no unpaid fines)
  const completedCleanItems = useMemo(() => {
    return historyItems.filter(
      (item) => item.status === "RETURNED" && !item.hasUnpaidFine
    );
  }, [historyItems]);

  // 5. Statistics
  const allCount = allItems.length;
  const activeCount = activeItems.length;
  const unpaidCount = useMemo(() => {
    return allItems.filter((item) => item.hasUnpaidFine).length;
  }, [allItems]);
  const completedCount = completedCleanItems.length;

  // 6. Filtered Items
  const filteredItems = useMemo(() => {
    switch (activeFilter) {
      case "ACTIVE":
        return activeItems;
      case "UNPAID_FINE":
        return allItems.filter((item) => item.hasUnpaidFine);
      case "COMPLETED":
        return completedCleanItems;
      case "ALL":
      default:
        return allItems;
    }
  }, [activeFilter, allItems, activeItems, completedCleanItems]);

  // 7. Handle Item Click (Opens appropriate modal)
  const handleItemClick = useCallback(
    (item: UnifiedLoanItem) => {
      if (item.sourceType === "ACTIVE" && item.activeTicket) {
        borrowing.openDetail(item.activeTicket);
      } else if (item.sourceType === "HISTORY" && item.historyItem) {
        history.openDetail(item.historyItem);
      }
    },
    [borrowing, history]
  );

  // 8. Deep-Link Navigation Support (Reactive URL Search Params & Auto-Open)
  useEffect(() => {
    const rawUrlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const selectedIdParam = search?.selectedId || rawUrlParams?.get("selectedId");
    const filterParam = search?.filter || (rawUrlParams?.get("filter") as PeminjamanFilter | null);

    if (filterParam && ["ALL", "ACTIVE", "UNPAID_FINE", "COMPLETED"].includes(filterParam)) {
      setActiveFilter(filterParam);
    }

    if (!selectedIdParam || isLoading) return;

    // A. Cari di Active Tickets
    const activeMatch = borrowing.tickets.find((t) => String(t.id) === String(selectedIdParam));
    if (activeMatch) {
      borrowing.openDetail(activeMatch);
      return;
    }

    // B. Cari di History Items
    const historyMatch = history.historyData.find((h) => String(h.id) === String(selectedIdParam));
    if (historyMatch) {
      history.openDetail(historyMatch);
      return;
    }

    // C. Fallback di allItems
    const target = allItems.find((item) => String(item.id) === String(selectedIdParam));
    if (target) {
      if (target.sourceType === "ACTIVE" && target.activeTicket) {
        borrowing.openDetail(target.activeTicket);
      } else if (target.sourceType === "HISTORY" && target.historyItem) {
        history.openDetail(target.historyItem);
      }
    }
  }, [
    search?.selectedId,
    search?.filter,
    location.search,
    isLoading,
    borrowing.tickets,
    history.historyData,
    allItems,
  ]);

  return {
    activeFilter,
    setActiveFilter,
    filteredItems,
    isLoading,
    allCount,
    activeCount,
    unpaidCount,
    completedCount,
    handleItemClick,
    borrowing,
    history,
  };
}

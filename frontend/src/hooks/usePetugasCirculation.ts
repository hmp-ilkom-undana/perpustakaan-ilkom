import { useState, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Clock, Package, BookOpen, AlertCircle, LucideIcon } from "lucide-react";
import type { CirculationItem, CircStatus } from "@/services/borrowing.service";
import { useBorrowingActiveQuery } from "@/hooks/queries/useBorrowingQuery";

export type ActiveCircStatus = "REQUESTED" | "WAITING_PICKUP" | "BORROWED" | "OVERDUE";

export interface StatusColumnConfig {
  id: ActiveCircStatus;
  label: string;
  icon: LucideIcon;
  badgeVariant: "sky" | "orange" | "emerald" | "rose";
  accentColor: string;
  items: CirculationItem[];
}

export function usePetugasCirculation() {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveCircStatus>("REQUESTED");

  const { data: rawCirculations = [], isPending: isLoading, refetch } = useBorrowingActiveQuery();

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredCirculations = useMemo(() => {
    if (!normalizedQuery) return rawCirculations;

    return rawCirculations.filter((item) => {
      const idMatch = item.id.toLowerCase().includes(normalizedQuery);
      const codeMatch = item.pickupCode?.toLowerCase().includes(normalizedQuery);
      const studentMatch = item.studentName.toLowerCase().includes(normalizedQuery);
      const nimMatch = item.studentId.toLowerCase().includes(normalizedQuery);
      const archiveMatch = item.archiveTitle.toLowerCase().includes(normalizedQuery);

      return idMatch || codeMatch || studentMatch || nimMatch || archiveMatch;
    });
  }, [rawCirculations, normalizedQuery]);

  const requestedItems = useMemo(
    () => filteredCirculations.filter((i) => i.status === "REQUESTED"),
    [filteredCirculations]
  );

  const waitingItems = useMemo(
    () => filteredCirculations.filter((i) => i.status === "WAITING_PICKUP"),
    [filteredCirculations]
  );

  const borrowedItems = useMemo(
    () => filteredCirculations.filter((i) => i.status === "BORROWED"),
    [filteredCirculations]
  );

  const overdueItems = useMemo(
    () => filteredCirculations.filter((i) => i.status === "OVERDUE"),
    [filteredCirculations]
  );

  const counts = useMemo(
    () => ({
      REQUESTED: requestedItems.length,
      WAITING_PICKUP: waitingItems.length,
      BORROWED: borrowedItems.length,
      OVERDUE: overdueItems.length,
      total: filteredCirculations.length,
    }),
    [requestedItems.length, waitingItems.length, borrowedItems.length, overdueItems.length, filteredCirculations.length]
  );

  const columns: StatusColumnConfig[] = useMemo(
    () => [
      {
        id: "REQUESTED",
        label: "Menunggu ACC",
        icon: Clock,
        badgeVariant: "sky",
        accentColor: "text-blue-600",
        items: requestedItems,
      },
      {
        id: "WAITING_PICKUP",
        label: "Siap Diambil",
        icon: Package,
        badgeVariant: "orange",
        accentColor: "text-orange-600",
        items: waitingItems,
      },
      {
        id: "BORROWED",
        label: "Sedang Dipinjam",
        icon: BookOpen,
        badgeVariant: "emerald",
        accentColor: "text-emerald-600",
        items: borrowedItems,
      },
      {
        id: "OVERDUE",
        label: "Terlambat",
        icon: AlertCircle,
        badgeVariant: "rose",
        accentColor: "text-rose-600",
        items: overdueItems,
      },
    ],
    [requestedItems, waitingItems, borrowedItems, overdueItems]
  );

  const handleNavigateToDetail = useCallback(
    (id: string) => {
      const isApiPathAdmin = location.pathname.startsWith("/admin");
      if (isApiPathAdmin) {
        navigate({
          to: "/admin/sirkulasi/$id",
          params: { id },
        });
      } else {
        navigate({
          to: "/petugas/sirkulasi/$id",
          params: { id },
        });
      }
    },
    [location.pathname, navigate]
  );

  return {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    rawCirculations,
    filteredCirculations,
    requestedItems,
    waitingItems,
    borrowedItems,
    overdueItems,
    counts,
    columns,
    isLoading,
    refetch,
    handleNavigateToDetail,
  };
}

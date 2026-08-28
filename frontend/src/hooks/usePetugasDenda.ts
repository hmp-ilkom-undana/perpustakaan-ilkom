import { useState, useEffect, useMemo } from "react";
import {
  useFineListQuery,
  useFineStatsQuery,
} from "./queries/useFineQuery";
import { usePayFineMutation } from "./queries/useFineMutation";
import type { FineItem, FineStats } from "@/services/fine.service";

export type PaymentMethod = "Tunai" | "Transfer";

export type FineBadgeVariant = "rose" | "amber" | "sky" | "orange" | "outline";

/**
 * Helper murni untuk memetakan jenis pelanggaran denda ke varian CVA Badge
 */
export function getFineBadgeVariant(fineType: string): FineBadgeVariant {
  if (fineType === "Kerusakan Fisik") return "rose";
  if (fineType === "Kehilangan Arsip") return "amber";
  if (fineType === "Terlambat") return "sky";
  return "outline";
}

export function usePetugasDenda() {
  // 1. State Pencarian & Tab Navigasi
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"UNPAID" | "PAID">("UNPAID");

  // Debounce search query (400ms) untuk mencegah keystroke spam ke server
  useEffect(() => {
    const handler = setTimeout(() => {
      setActiveSearch(searchQuery);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 2. TanStack Query & Mutation Layer
  const {
    data: stats,
    isLoading: isStatsLoading,
  } = useFineStatsQuery();

  const {
    data: rawFines = [],
    isLoading: isFinesLoading,
    isFetching,
  } = useFineListQuery({
    status: activeTab,
    search: activeSearch.trim() || undefined,
  });

  // Urutkan data denda secara kronologis (paling baru di paling atas)
  const fines = useMemo(() => {
    return [...rawFines].sort((a, b) => {
      if (activeTab === "PAID") {
        const timeA = a.paidAt ? new Date(a.paidAt).getTime() : 0;
        const timeB = b.paidAt ? new Date(b.paidAt).getTime() : 0;
        if (timeB !== timeA) return timeB - timeA;
        const eventA = new Date(a.returnDate || a.createdAt).getTime();
        const eventB = new Date(b.returnDate || b.createdAt).getTime();
        return eventB - eventA;
      } else {
        const timeA = new Date(a.returnDate || a.createdAt).getTime();
        const timeB = new Date(b.returnDate || b.createdAt).getTime();
        return timeB - timeA;
      }
    });
  }, [rawFines, activeTab]);

  const payFineMutation = usePayFineMutation();

  // 3. State Modal Kasir Pembayaran
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedFine, setSelectedFine] = useState<FineItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Tunai");
  const [paymentNotes, setPaymentNotes] = useState("");

  // 4. Action Handlers: Dialog Pelunasan
  const handleOpenPayment = (fine: FineItem) => {
    setSelectedFine(fine);
    setPaymentMethod("Tunai");
    setPaymentNotes("");
    setIsPaymentOpen(true);
  };

  const handleClosePayment = () => {
    setIsPaymentOpen(false);
    setSelectedFine(null);
    setPaymentNotes("");
  };

  const handleConfirmPayment = async () => {
    if (!selectedFine) return;

    try {
      await payFineMutation.mutateAsync({
        id: selectedFine.id,
        payload: {
          paymentMethod,
          notes: paymentNotes.trim() || undefined,
        },
      });
      setIsPaymentOpen(false);
      setSelectedFine(null);
    } catch {
      // Error handled by mutation toast
    }
  };

  // 5. Action Handlers: Search Reset
  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveSearch("");
  };

  return {
    // Data & Query States
    fines,
    stats: (stats as FineStats | undefined) ?? {
      totalUnpaidAmount: 0,
      unpaidCount: 0,
      totalPaidAmount: 0,
      paidCount: 0,
      blockedStudentsCount: 0,
    },
    isStatsLoading,
    isFinesLoading,
    isFetching,

    // Search & Tab States
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    handleClearSearch,

    // Payment Modal States & Handlers
    isPaymentOpen,
    setIsPaymentOpen,
    selectedFine,
    paymentMethod,
    setPaymentMethod,
    paymentNotes,
    setPaymentNotes,
    isPaying: payFineMutation.isPending,
    handleOpenPayment,
    handleClosePayment,
    handleConfirmPayment,

    // UI Helper
    getFineBadgeVariant,
  };
}

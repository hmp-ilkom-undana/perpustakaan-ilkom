import { useState, useMemo, useCallback } from "react";
import { useStudentsQuery } from "./queries/useUserQuery";
import type { UserItem } from "@/services/user.service";
import { toast } from "sonner";

export type StudentStatusFilter = "ALL" | "Aktif" | "Non-Aktif";

export function useAdminPengguna() {
  // 1. Filter & Search State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StudentStatusFilter>("ALL");

  // 2. Query Layer Integration (TanStack Query)
  const {
    data: studentsData,
    isLoading,
    isFetching,
    refetch,
  } = useStudentsQuery();

  const students = useMemo(() => studentsData || [], [studentsData]);

  // 3. Modal / Dialog States
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // 4. Filtered Data Computation
  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return students.filter((item) => {
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.identifier.toLowerCase().includes(query) ||
        (item.nim && item.nim.toLowerCase().includes(query)) ||
        (item.email && item.email.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "ALL" ? true : item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [students, search, statusFilter]);

  // 5. Aggregate Metric Statistics Computation
  const stats = useMemo(() => {
    const total = students.length;
    const active = students.filter((s) => s.status === "Aktif").length;
    const inactive = students.filter((s) => s.status === "Non-Aktif").length;
    const totalBorrowings = students.reduce(
      (acc, s) => acc + (s.activeBorrowings || 0),
      0,
    );

    return { total, active, inactive, totalBorrowings };
  }, [students]);

  // 6. Action Handlers (Wrapped in useCallback to preserve referential stability)
  const handleOpenDetail = useCallback((user: UserItem) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
  }, []);

  const handleOpenHistory = useCallback((user: UserItem) => {
    setSelectedUser(user);
    setIsHistoryOpen(true);
  }, []);

  const handleCloseHistory = useCallback(() => {
    setIsHistoryOpen(false);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearch("");
    setStatusFilter("ALL");
  }, []);

  const handleWhatsApp = useCallback((user: UserItem) => {
    if (!user.wa_number) {
      toast.error(`Mahasiswa ${user.name} belum mencantumkan nomor WhatsApp`);
      return;
    }

    let cleanedNumber = user.wa_number.replace(/\D/g, "");
    if (cleanedNumber.startsWith("0")) {
      cleanedNumber = "62" + cleanedNumber.slice(1);
    } else if (!cleanedNumber.startsWith("62")) {
      cleanedNumber = "62" + cleanedNumber;
    }

    const greetingMessage = encodeURIComponent(
      `Halo ${user.name} (${user.nim || user.identifier}), kami dari Layanan Perpustakaan ILKOM Undana. Ingin mengonfirmasi status peminjaman arsip dan sirkulasi Anda. Terima kasih.`,
    );

    window.open(
      `https://wa.me/${cleanedNumber}?text=${greetingMessage}`,
      "_blank",
      "noopener,noreferrer",
    );
    toast.success(`Membuka WhatsApp untuk menghubungi ${user.name}`);
  }, []);

  const isFiltered = Boolean(search.trim()) || statusFilter !== "ALL";

  return {
    // Data & Stats
    students,
    filteredStudents,
    stats,
    totalCount: students.length,
    filteredCount: filteredStudents.length,

    // Loading State
    isLoading,
    isFetching,
    refetch,

    // Search & Filter State
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    handleResetFilters,
    isFiltered,

    // Dialog State & Navigation
    selectedUser,
    isDetailOpen,
    setIsDetailOpen,
    isHistoryOpen,
    setIsHistoryOpen,
    handleOpenDetail,
    handleCloseDetail,
    handleOpenHistory,
    handleCloseHistory,

    // Action Handlers
    handleWhatsApp,
  };
}

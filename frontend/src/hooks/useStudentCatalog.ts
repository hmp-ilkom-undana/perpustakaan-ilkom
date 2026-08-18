import { useState, useEffect, useMemo } from "react";
import { usePublicArchiveQuery } from "./queries/useArchiveQuery";
import { useMyBorrowingHistoryQuery } from "./queries/useBorrowingQuery";

export interface StudentArchiveItem {
  id: string;
  archiveCode: string;
  title: string;
  author: string;
  year: number;
  archiveType: string;
  category: string;
  quantity: number;
  reservedQuantity: number;
  shelfLocation?: string | null;
  status: string;
  isRequestedByCurrentUser?: boolean;
}

export function useStudentCatalog() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("Semua");
  const [filterCategory, setFilterCategory] = useState<string>("Semua");
  const [filterAvailability, setFilterAvailability] = useState<string>("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArchive, setSelectedArchive] = useState<StudentArchiveItem | null>(null);

  const limit = 8;

  // Debounce search input (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Handle filter changes (auto reset page to 1)
  const handleFilterTypeChange = (type: string) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  const handleFilterCategoryChange = (category: string) => {
    setFilterCategory(category);
    setCurrentPage(1);
  };

  const handleFilterAvailabilityChange = (avail: string) => {
    setFilterAvailability(avail);
    setCurrentPage(1);
  };

  // Queries
  const { data: archiveResponse, isPending: isLoadingArchives } = usePublicArchiveQuery({
    page: currentPage,
    limit,
    search: debouncedSearch || undefined,
    type: filterType !== "Semua" ? filterType : undefined,
    category: filterCategory !== "Semua" ? filterCategory : undefined,
  });

  const { data: myBorrowings = [] } = useMyBorrowingHistoryQuery();

  const activeRequestedIds = useMemo(() => {
    const activeStatuses = ["REQUESTED", "WAITING_PICKUP", "BORROWED", "OVERDUE"];
    const ids = new Set<string>();
    myBorrowings
      .filter((b: any) => activeStatuses.includes(b.status))
      .forEach((b: any) => ids.add(b.archiveId || b.archive?.id));
    return ids;
  }, [myBorrowings]);

  const rawArchives = archiveResponse?.data ?? [];
  const meta = archiveResponse?.meta ?? {
    total: 0,
    totalPages: 1,
    page: 1,
    limit,
  };

  // Map and apply client availability filter if needed
  const archives: StudentArchiveItem[] = useMemo(() => {
    return rawArchives
      .map((item: any) => ({
        id: item.id,
        archiveCode: item.archiveCode || `ARC-${item.id.substring(0, 6)}`,
        title: item.title,
        author: item.author,
        year: item.year,
        archiveType: item.archiveType,
        category: item.category,
        quantity: item.quantity ?? 1,
        reservedQuantity: item.reservedQuantity ?? 0,
        shelfLocation: item.shelfLocation,
        status: item.status || "TERSEDIA",
        isRequestedByCurrentUser: activeRequestedIds.has(item.id),
      }))
      .filter((archive: StudentArchiveItem) => {
        if (filterAvailability === "Semua") return true;
        const availableStock = archive.quantity - archive.reservedQuantity;
        const isAvailable = availableStock > 0 && archive.status !== "DIPINJAM";

        if (filterAvailability === "Tersedia") return isAvailable;
        if (filterAvailability === "Dipinjam") return !isAvailable;
        return true;
      });
  }, [rawArchives, activeRequestedIds, filterAvailability]);

  return {
    searchInput,
    setSearchInput,
    filterType,
    filterCategory,
    filterAvailability,
    handleFilterTypeChange,
    handleFilterCategoryChange,
    handleFilterAvailabilityChange,
    currentPage,
    setCurrentPage,
    selectedArchive,
    setSelectedArchive,
    archives,
    meta,
    isLoading: isLoadingArchives,
  };
}

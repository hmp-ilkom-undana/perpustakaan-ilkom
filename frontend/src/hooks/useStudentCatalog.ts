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
  userBorrowStatus?: string;
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

  const userBorrowMap = useMemo(() => {
    const activeStatuses = ["REQUESTED", "WAITING_PICKUP", "BORROWED", "OVERDUE"];
    const map = new Map<string, string>();
    myBorrowings
      .filter((b: any) => activeStatuses.includes(b.status))
      .forEach((b: any) => {
        const archId = b.archiveId || b.archive?.id;
        if (archId) map.set(archId, b.status);
      });
    return map;
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
      .map((item: any) => {
        const userStatus = userBorrowMap.get(item.id);
        return {
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
          userBorrowStatus: userStatus,
          isRequestedByCurrentUser: userStatus === "REQUESTED",
        };
      })
      .filter((archive: StudentArchiveItem) => {
        if (filterAvailability === "Semua") return true;
        const availableStock = archive.quantity - archive.reservedQuantity;
        const isAvailable = availableStock > 0 && archive.status !== "DIPINJAM";

        if (filterAvailability === "Tersedia") return isAvailable;
        if (filterAvailability === "Dipinjam") return !isAvailable;
        return true;
      });
  }, [rawArchives, userBorrowMap, filterAvailability]);

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

import { useState, useEffect } from "react";
import {
  useActivityLogsQuery,
  useActivityLogStatsQuery,
} from "./queries/useActivityLogQuery";
import type {
  ActivityLogItem,
  ActivityRole,
} from "@/services/activity-log.service";

export function useAdminActivityLog() {
  // 1. State Filter & Search
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<ActivityRole | "ALL">("ALL");
  const [selectedEntity, setSelectedEntity] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const limit = 15;

  // Debounce input pencarian (400ms) untuk mencegah server spam
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset ke halaman pertama saat mencari
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset page ke 1 saat filter role atau entitas berganti
  const handleRoleChange = (role: ActivityRole | "ALL") => {
    setSelectedRole(role);
    setPage(1);
  };

  const handleEntityChange = (entity: string) => {
    setSelectedEntity(entity);
    setPage(1);
  };

  // Reset seluruh filter
  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedRole("ALL");
    setSelectedEntity("ALL");
    setPage(1);
  };

  const isFiltered =
    Boolean(debouncedSearch.trim()) ||
    selectedRole !== "ALL" ||
    selectedEntity !== "ALL";

  // 2. TanStack Query Layer
  const {
    data: logsResponse,
    isLoading: isLogsLoading,
    isFetching: isLogsFetching,
    refetch: refetchLogs,
  } = useActivityLogsQuery({
    search: debouncedSearch.trim() || undefined,
    role: selectedRole !== "ALL" ? selectedRole : undefined,
    entity: selectedEntity !== "ALL" ? selectedEntity : undefined,
    page,
    limit,
  });

  const {
    data: stats,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useActivityLogStatsQuery();

  // 3. State Modal Inspeksi Detail
  const [selectedLog, setSelectedLog] = useState<ActivityLogItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleSelectLog = (log: ActivityLogItem) => {
    setSelectedLog(log);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedLog(null);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    // Data
    logs: logsResponse?.data || [],
    stats,
    meta: logsResponse?.meta || { total: 0, page: 1, limit, totalPages: 1 },

    // Loading states
    isLoading: isLogsLoading,
    isStatsLoading,
    isFetching: isLogsFetching,

    // Filter states & handlers
    search,
    setSearch,
    selectedRole,
    handleRoleChange,
    selectedEntity,
    handleEntityChange,
    handleResetFilters,
    isFiltered,

    // Pagination
    page,
    totalPages: logsResponse?.meta?.totalPages || 1,
    totalLogs: logsResponse?.meta?.total || 0,
    handlePageChange,

    // Modal detail
    selectedLog,
    isDetailOpen,
    handleSelectLog,
    handleCloseDetail,

    // Refetch action
    refetchAll: () => {
      refetchLogs();
      refetchStats();
    },
  };
}

import { useState, useMemo, useCallback } from "react";
import { useStaffQuery } from "./queries/useUserQuery";
import {
  useCreateBatchStaffMutation,
  useUpdateStaffMutation,
  useResetPasswordMutation,
  useToggleStaffStatusMutation,
  useDeleteStaffMutation,
} from "./queries/useUserMutation";
import type { UserItem } from "@/services/user.service";

export type StaffStatusFilter = "ALL" | "Aktif" | "Non-Aktif";

export function useAdminPetugas() {
  // 1. Filter & Search State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StaffStatusFilter>("ALL");

  // 2. Query Layer Integration (TanStack Query)
  const {
    data: staffData,
    isLoading,
    isFetching,
    refetch,
  } = useStaffQuery();

  const staffList = useMemo(() => staffData || [], [staffData]);

  // 3. Mutation Hooks
  const createBatchMutation = useCreateBatchStaffMutation();
  const updateMutation = useUpdateStaffMutation();
  const resetPasswordMutation = useResetPasswordMutation();
  const toggleStatusMutation = useToggleStaffStatusMutation();
  const deleteMutation = useDeleteStaffMutation();

  // 4. Modal / Dialog States
  const [selectedStaff, setSelectedStaff] = useState<UserItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isToggleStatusOpen, setIsToggleStatusOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // 5. Filtered Data Computation
  const filteredStaff = useMemo(() => {
    const query = search.trim().toLowerCase();
    return staffList.filter((item) => {
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.identifier.toLowerCase().includes(query) ||
        (item.email && item.email.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "ALL" ? true : item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [staffList, search, statusFilter]);

  // 6. Aggregate Metric Statistics Computation
  const stats = useMemo(() => {
    const total = staffList.length;
    const active = staffList.filter((s) => s.status === "Aktif").length;
    const inactive = staffList.filter((s) => s.status === "Non-Aktif").length;

    return { total, active, inactive };
  }, [staffList]);

  // 7. Action Handlers (Wrapped in useCallback)
  const handleOpenCreate = useCallback(() => {
    setSelectedStaff(null);
    setFormMode("create");
    setIsFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((staff: UserItem) => {
    setSelectedStaff(staff);
    setFormMode("edit");
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  const handleBatchCreateStaff = useCallback(
    async (staffListToCreate: Array<{ email: string; password?: string }>) => {
      const res = await createBatchMutation.mutateAsync(staffListToCreate);
      if (res && res.totalCreated > 0) {
        setIsFormOpen(false);
      }
    },
    [createBatchMutation],
  );

  const handleSaveStaff = useCallback(
    async (staffData: Partial<UserItem> & { password?: string }) => {
      if (!staffData.id) return;
      await updateMutation.mutateAsync({
        id: staffData.id,
        data: {
          name: staffData.name,
          email: staffData.email,
          wa_number: staffData.wa_number,
          status: staffData.status,
          password: staffData.password,
        },
      });
      setIsFormOpen(false);
    },
    [updateMutation],
  );

  const handleOpenResetPassword = useCallback((staff: UserItem) => {
    setSelectedStaff(staff);
    setIsResetOpen(true);
  }, []);

  const handleCloseResetPassword = useCallback(() => {
    setIsResetOpen(false);
  }, []);

  const handleConfirmResetPassword = useCallback(
    async (staff: UserItem) => {
      await resetPasswordMutation.mutateAsync(staff.email || staff.identifier);
      setIsResetOpen(false);
    },
    [resetPasswordMutation],
  );

  const handleOpenToggleStatus = useCallback((staff: UserItem) => {
    setSelectedStaff(staff);
    setIsToggleStatusOpen(true);
  }, []);

  const handleCloseToggleStatus = useCallback(() => {
    setIsToggleStatusOpen(false);
  }, []);

  const handleConfirmToggleStatus = useCallback(
    async (staff: UserItem) => {
      const nextStatus = staff.status === "Aktif" ? "Non-Aktif" : "Aktif";
      await toggleStatusMutation.mutateAsync({
        id: staff.id,
        status: nextStatus,
      });
      setIsToggleStatusOpen(false);
    },
    [toggleStatusMutation],
  );

  const handleOpenDelete = useCallback((staff: UserItem) => {
    setSelectedStaff(staff);
    setIsDeleteOpen(true);
  }, []);

  const handleCloseDelete = useCallback(() => {
    setIsDeleteOpen(false);
  }, []);

  const handleConfirmDelete = useCallback(
    async (staff: UserItem) => {
      await deleteMutation.mutateAsync(staff.id);
      setIsDeleteOpen(false);
    },
    [deleteMutation],
  );

  const handleResetFilters = useCallback(() => {
    setSearch("");
    setStatusFilter("ALL");
  }, []);

  const isFiltered = Boolean(search.trim()) || statusFilter !== "ALL";
  const isSubmitting =
    createBatchMutation.isPending ||
    updateMutation.isPending ||
    resetPasswordMutation.isPending ||
    toggleStatusMutation.isPending ||
    deleteMutation.isPending;

  return {
    // Data & Stats
    staffList,
    filteredStaff,
    stats,
    totalCount: staffList.length,
    filteredCount: filteredStaff.length,

    // Loading & Mutation State
    isLoading,
    isFetching,
    isSubmitting,
    refetch,

    // Search & Filter State
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    handleResetFilters,
    isFiltered,

    // Dialog State & Navigation
    selectedStaff,
    isFormOpen,
    setIsFormOpen,
    formMode,
    isResetOpen,
    setIsResetOpen,
    isToggleStatusOpen,
    setIsToggleStatusOpen,
    isDeleteOpen,
    setIsDeleteOpen,

    // Action Handlers
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleBatchCreateStaff,
    handleSaveStaff,
    handleOpenResetPassword,
    handleCloseResetPassword,
    handleConfirmResetPassword,
    handleOpenToggleStatus,
    handleCloseToggleStatus,
    handleConfirmToggleStatus,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,
  };
}

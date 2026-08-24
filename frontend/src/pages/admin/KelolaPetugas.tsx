import { useMemo } from "react";
import { ShieldCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useAdminPetugas } from "@/hooks/useAdminPetugas";
import {
  StaffStatsHeader,
  StaffFilterBar,
  StaffFormDialog,
  StaffResetPasswordDialog,
  StaffStatusToggleDialog,
  StaffDeleteDialog,
  getStaffColumns,
} from "@/components/pengguna";

export default function KelolaPetugas() {
  const {
    staffList,
    filteredStaff,
    stats,
    isLoading,
    isFetching,
    isSubmitting,
    refetch,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
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
    handleOpenCreate,
    handleBatchCreateStaff,
    handleSaveStaff,
    handleOpenResetPassword,
    handleConfirmResetPassword,
    handleOpenToggleStatus,
    handleConfirmToggleStatus,
    handleOpenDelete,
    handleConfirmDelete,
  } = useAdminPetugas();

  const columns = useMemo(
    () =>
      getStaffColumns({
        onToggleStatus: handleOpenToggleStatus,
        onResetPassword: handleOpenResetPassword,
        onDelete: handleOpenDelete,
      }),
    [handleOpenToggleStatus, handleOpenResetPassword, handleOpenDelete],
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-blue-900">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-blue-900 text-white rounded-md shadow-[2px_2px_0px_#1E3A8A]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-900">
              Kelola Petugas
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Manajemen akun staf operasional perpustakaan, hak akses, dan penambahan petugas baru.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="self-start sm:self-auto h-9 px-3.5 text-xs font-bold border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] hover:bg-slate-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 mr-1.5 ${isFetching ? "animate-spin text-blue-900" : ""}`}
          />
          Segarkan Data
        </Button>
      </div>

      {/* Summary Metric Cards */}
      <StaffStatsHeader stats={stats} isLoading={isLoading} />

      {/* Main Table Container */}
      <div className="bg-white rounded-lg border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] overflow-hidden">
        <StaffFilterBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onOpenCreate={handleOpenCreate}
        />

        <DataTable
          columns={columns}
          data={filteredStaff}
          isLoading={isLoading}
          headerClassName="bg-slate-100 border-b-2 border-blue-900 text-blue-900 font-bold"
          emptyText="Tidak ada data petugas yang cocok dengan pencarian atau filter."
        />

        <div className="p-4 border-t-2 border-blue-900 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 gap-2">
          <div>
            Menampilkan <span className="font-bold text-blue-900">{filteredStaff.length}</span> dari{" "}
            <span className="font-bold text-blue-900">{staffList.length}</span> petugas terdaftar
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            *Untuk mengubah sandi atau hak akses, gunakan menu aksi di sebelah kanan.
          </div>
        </div>
      </div>

      {/* Modals & Dialogs */}
      <StaffFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        staff={selectedStaff}
        mode={formMode}
        isSubmitting={isSubmitting}
        onSubmitSingle={handleSaveStaff}
        onSubmitBatch={handleBatchCreateStaff}
      />

      <StaffResetPasswordDialog
        staff={selectedStaff}
        isOpen={isResetOpen}
        onOpenChange={setIsResetOpen}
        onConfirm={handleConfirmResetPassword}
      />

      <StaffStatusToggleDialog
        staff={selectedStaff}
        isOpen={isToggleStatusOpen}
        onOpenChange={setIsToggleStatusOpen}
        onConfirm={handleConfirmToggleStatus}
      />

      <StaffDeleteDialog
        staff={selectedStaff}
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

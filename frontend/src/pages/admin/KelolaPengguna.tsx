import { useMemo } from "react";
import { Users, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useAdminPengguna } from "@/hooks/useAdminPengguna";
import {
  StudentStatsHeader,
  StudentFilterBar,
  StudentDetailDialog,
  StudentHistoryDialog,
  getStudentColumns,
} from "@/components/pengguna";

export default function KelolaPengguna() {
  const {
    students,
    filteredStudents,
    stats,
    isLoading,
    isFetching,
    refetch,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    selectedUser,
    isDetailOpen,
    setIsDetailOpen,
    isHistoryOpen,
    setIsHistoryOpen,
    handleOpenDetail,
    handleOpenHistory,
    handleWhatsApp,
  } = useAdminPengguna();

  const columns = useMemo(
    () => getStudentColumns({ onViewDetail: handleOpenDetail }),
    [handleOpenDetail],
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Refresh CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-blue-900 text-white rounded-md shadow-[2px_2px_0px_#1E3A8A]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-900">
              Kelola Pengguna
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Manajemen akun mahasiswa, pemantauan status keanggotaan, dan audit sirkulasi peminjaman.
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
      <StudentStatsHeader stats={stats} isLoading={isLoading} />

      {/* Main Table Container */}
      <div className="bg-white rounded-lg border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] overflow-hidden">
        <StudentFilterBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <DataTable
          columns={columns}
          data={filteredStudents}
          isLoading={isLoading}
          headerClassName="bg-slate-100 border-b-2 border-blue-900 text-blue-900 font-bold"
          emptyText="Tidak ada data mahasiswa yang cocok dengan pencarian atau filter."
        />

        <div className="p-4 border-t-2 border-blue-900 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 gap-2">
          <div>
            Menampilkan <span className="font-bold text-blue-900">{filteredStudents.length}</span> dari{" "}
            <span className="font-bold text-blue-900">{students.length}</span> mahasiswa terdaftar
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <StudentDetailDialog
        user={selectedUser}
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onViewHistory={handleOpenHistory}
        onWhatsApp={handleWhatsApp}
      />

      <StudentHistoryDialog
        user={selectedUser}
        isOpen={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
      />
    </div>
  );
}

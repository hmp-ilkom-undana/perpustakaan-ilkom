import { useAdminActivityLog } from "@/hooks/useAdminActivityLog";
import {
  LogStatsHeader,
  LogFilterBar,
  LogTable,
  LogDetailDialog,
} from "@/components/log-aktivitas";
import { History, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LogAktivitas() {
  const {
    logs,
    stats,
    isLoading,
    isStatsLoading,
    isFetching,
    search,
    setSearch,
    selectedRole,
    handleRoleChange,
    selectedEntity,
    handleEntityChange,
    handleResetFilters,
    isFiltered,
    page,
    totalPages,
    totalLogs,
    handlePageChange,
    selectedLog,
    isDetailOpen,
    handleSelectLog,
    handleCloseDetail,
    refetchAll,
  } = useAdminActivityLog();

  return (
    <div className="space-y-6 pb-12">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-400 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] flex items-center justify-center">
              <History className="w-5 h-5 text-blue-950" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-blue-950 tracking-tight">
                Log Aktivitas Sistem
              </h1>
              <p className="text-xs font-semibold text-slate-500">
                Audit trail lengkap tindakan administratif dan operasional staf & admin
              </p>
            </div>
          </div>
        </div>

        {/* REFRESH ACTION */}
        <Button
          variant="outline"
          size="sm"
          onClick={refetchAll}
          disabled={isFetching}
          className="self-start sm:self-auto h-9 px-3.5 text-xs font-bold border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] hover:bg-slate-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 mr-1.5 ${isFetching ? "animate-spin text-blue-900" : ""}`}
          />
          Segarkan Data
        </Button>
      </div>

      {/* METRIC CARDS HEADER */}
      <LogStatsHeader stats={stats} isLoading={isStatsLoading} />

      {/* FILTER & SEARCH BAR */}
      <LogFilterBar
        search={search}
        onSearchChange={setSearch}
        selectedRole={selectedRole}
        onRoleChange={handleRoleChange}
        selectedEntity={selectedEntity}
        onEntityChange={handleEntityChange}
        onResetFilters={handleResetFilters}
        isFiltered={isFiltered}
        totalResults={totalLogs}
      />

      {/* LOG ACTIVITY TABLE */}
      <LogTable
        logs={logs}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        totalLogs={totalLogs}
        onPageChange={handlePageChange}
        onSelectLog={handleSelectLog}
      />

      {/* INSPECTION DETAIL MODAL */}
      <LogDetailDialog
        log={selectedLog}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
}

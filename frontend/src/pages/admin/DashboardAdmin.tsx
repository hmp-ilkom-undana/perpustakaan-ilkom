import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import {
  DashboardHeader,
  DashboardKpiGrid,
  CirculationTrendChart,
  CategoryPieSection,
  OperationalAlertsCard,
  RecentActivityStream,
  DashboardSkeleton,
} from "@/components/dashboard-admin";
import { ShieldAlert, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardAdmin() {
  const {
    period,
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
    formattedStats,
    handlePeriodChange,
    handleExportLpj,
    handleNavigate,
  } = useAdminDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6 text-red-900 shadow-[4px_4px_0px_#DC2626] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-red-600 shrink-0" />
          <div>
            <h2 className="font-black text-base sm:text-lg">Gagal Memuat Data Dashboard</h2>
            <p className="text-xs sm:text-sm mt-0.5 text-red-700">
              Terjadi kesalahan saat mengambil statistik agregasi dari server. Silakan coba lagi.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="border-2 border-red-700 text-red-900 font-bold text-xs bg-white hover:bg-red-100 shadow-[2px_2px_0px_#B91C1C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 animate-in fade-in duration-500">
      {/* 1. Header & Controls */}
      <DashboardHeader
        period={period}
        onPeriodChange={handlePeriodChange}
        onExportLpj={handleExportLpj}
        onRefresh={() => refetch()}
        isFetching={isFetching}
      />

      {/* 2. Hero KPI Metric Cards (2x2 / 4 Columns) */}
      <DashboardKpiGrid
        stats={data.stats}
        formattedStats={formattedStats}
        onNavigate={handleNavigate}
      />

      {/* 3. Main Analytics & Visuals (70% : 30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col">
          <CirculationTrendChart data={data.trendData} className="flex-1" />
        </div>
        <div className="lg:col-span-3 flex flex-col">
          <CategoryPieSection categories={data.topCategories} className="flex-1" />
        </div>
      </div>

      {/* 4. Operational & Audit Control (50% : 50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OperationalAlertsCard
          alerts={data.alerts}
          onNavigate={handleNavigate}
        />
        <RecentActivityStream
          logs={data.recentLogs}
          onNavigate={handleNavigate}
        />
      </div>
    </div>
  );
}

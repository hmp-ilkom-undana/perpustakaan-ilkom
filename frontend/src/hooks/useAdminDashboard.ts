import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAdminDashboardQuery } from "./queries/useAdminDashboardQuery";
import type { DashboardPeriod } from "@/services/dashboard.service";
import { exportDashboardToExcel } from "@/services/excel-export.service";
import { toast } from "sonner";
import { formatRupiah } from "@/lib/utils";

export function useAdminDashboard() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<DashboardPeriod>("bulan_ini");

  const { data, isLoading, isFetching, isError, refetch } = useAdminDashboardQuery(period);

  const handlePeriodChange = useCallback((newPeriod: string) => {
    if (
      newPeriod === "hari_ini" ||
      newPeriod === "7_hari" ||
      newPeriod === "bulan_ini" ||
      newPeriod === "semester_ini" ||
      newPeriod === "tahun_ini"
    ) {
      setPeriod(newPeriod);
    }
  }, []);

  const handleExportLpj = useCallback(async () => {
    if (!data) {
      toast.error("Data belum siap untuk diunduh.");
      return;
    }

    const toastId = toast.loading("Sedang menyiapkan file Excel...");
    try {
      await exportDashboardToExcel(data);
      toast.success("Laporan berhasil diunduh dalam format Excel (.xlsx)!", { id: toastId });
    } catch (err) {
      console.error("[ExportExcel] Error:", err);
      toast.error("Gagal mengekspor laporan ke Excel.", { id: toastId });
    }
  }, [data]);

  const handleNavigate = useCallback(
    (path: string) => {
      navigate({ to: path });
    },
    [navigate],
  );

  // Formatted currency helpers
  const formattedStats = useMemo(() => {
    if (!data) return null;
    return {
      kasTerkumpul: formatRupiah(data.stats.keuangan.totalKasTerkumpul),
      tunggakan: formatRupiah(data.stats.keuangan.totalTunggakan),
    };
  }, [data]);

  return {
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
  };
}

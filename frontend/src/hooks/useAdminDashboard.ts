import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAdminDashboardQuery } from "./queries/useAdminDashboardQuery";
import type { DashboardPeriod } from "@/services/dashboard.service";
import { toast } from "sonner";

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

  const handleExportLpj = useCallback(() => {
    if (!data) {
      toast.error("Data belum siap untuk diunduh.");
      return;
    }

    try {
      const reportContent = [
        `LAPORAN EKSEKUTIF PERPUSTAKAAN ILKOM - PERIODE: ${data.period.toUpperCase()}`,
        `Tanggal Generate: ${new Date().toLocaleString("id-ID")}`,
        "==================================================",
        "",
        "[1. RINGKASAN KOLEKSI]",
        `- Total Koleksi: ${data.stats.koleksi.total} judul/eksemplar`,
        `- Tersedia di Rak: ${data.stats.koleksi.tersedia}`,
        `- Sedang Dipinjam: ${data.stats.koleksi.dipinjam}`,
        `- Skripsi: ${data.stats.koleksi.byType.skripsi}`,
        `- Ringkasan Skripsi: ${data.stats.koleksi.byType.ringkasan}`,
        `- Naskah Publikasi: ${data.stats.koleksi.byType.naskah}`,
        "",
        "[2. SIRKULASI AKTIF]",
        `- Total Sirkulasi Berjalan: ${data.stats.sirkulasi.totalAktif}`,
        `- Menunggu ACC: ${data.stats.sirkulasi.waitingAcc}`,
        `- Siap Diambil: ${data.stats.sirkulasi.waitingPickup}`,
        `- Membawa Fisik: ${data.stats.sirkulasi.borrowed}`,
        `- Terlambat (Overdue): ${data.stats.sirkulasi.overdue}`,
        "",
        "[3. KEUANGAN & DENDA]",
        `- Kas Denda Terkumpul (Lunas): Rp ${data.stats.keuangan.totalKasTerkumpul.toLocaleString("id-ID")}`,
        `- Tunggakan Denda Aktif: Rp ${data.stats.keuangan.totalTunggakan.toLocaleString("id-ID")}`,
        `- Mahasiswa Terkunci/Terblokir: ${data.stats.keuangan.mahasiswaTerblokir} orang`,
        "",
        "[4. KEANGGOTAAN]",
        `- Total Mahasiswa: ${data.stats.pengguna.totalMahasiswa}`,
        `- Mahasiswa Aktif Meminjam: ${data.stats.pengguna.mahasiswaAktifMeminjam}`,
        `- Total Petugas: ${data.stats.pengguna.totalPetugas}`,
        "",
        "[5. KATEGORI RISET TERPOPULER]",
        ...data.topCategories.map((c) => `- ${c.name}: ${c.count} judul (${c.percentage}%)`),
      ].join("\n");

      const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Laporan_Eksekutif_Perpus_ILKOM_${data.period}_${Date.now()}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Laporan Eksekutif LPJ berhasil diunduh!");
    } catch {
      toast.error("Gagal mengekspor laporan LPJ.");
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
      kasTerkumpul: `Rp ${data.stats.keuangan.totalKasTerkumpul.toLocaleString("id-ID")}`,
      tunggakan: `Rp ${data.stats.keuangan.totalTunggakan.toLocaleString("id-ID")}`,
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

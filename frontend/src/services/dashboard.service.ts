import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

export type DashboardPeriod = "hari_ini" | "7_hari" | "bulan_ini" | "semester_ini" | "tahun_ini";

export interface DashboardStatsResponse {
  period: DashboardPeriod;
  stats: {
    koleksi: {
      total: number;
      tersedia: number;
      dipinjam: number;
      byType: {
        skripsi: number;
        ringkasan: number;
        naskah: number;
      };
    };
    sirkulasi: {
      totalAktif: number;
      waitingAcc: number;
      waitingPickup: number;
      borrowed: number;
      overdue: number;
    };
    keuangan: {
      totalKasTerkumpul: number;
      totalTunggakan: number;
      mahasiswaTerblokir: number;
    };
    pengguna: {
      totalMahasiswa: number;
      mahasiswaAktifMeminjam: number;
      totalPetugas: number;
    };
  };
  trendData: Array<{
    label: string;
    pengajuan: number;
    pengembalian: number;
  }>;
  topCategories: Array<{
    name: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  alerts: Array<{
    id: string;
    title: string;
    detail: string;
    desc: string;
    type: "danger" | "warning" | "info";
    targetUrl: string;
  }>;
  recentLogs: Array<{
    id: string;
    userName: string;
    userRole: string;
    action: string;
    description: string;
    createdAt: string;
  }>;
}

export const dashboardService = {
  async getStats(period: DashboardPeriod = "bulan_ini"): Promise<DashboardStatsResponse> {
    const response = await api.get<DashboardStatsResponse>(`/api/admin/dashboard/stats`, {
      params: { period },
    });
    return response.data;
  },
};

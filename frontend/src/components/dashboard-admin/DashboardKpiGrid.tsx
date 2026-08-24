import {
  Library,
  RefreshCcw,
  BadgeDollarSign,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DashboardStatsResponse } from "@/services/dashboard.service";

interface DashboardKpiGridProps {
  stats: DashboardStatsResponse["stats"];
  formattedStats: {
    kasTerkumpul: string;
    tunggakan: string;
  } | null;
  onNavigate: (path: string) => void;
}

export function DashboardKpiGrid({
  stats,
  formattedStats,
  onNavigate,
}: DashboardKpiGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      
      {/* 1. Total Koleksi Arsip Card */}
      <div 
        onClick={() => onNavigate("/admin/katalog")}
        className="bg-white border-2 border-blue-900 rounded-lg p-5 shadow-[4px_4px_0px_#1E3A8A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#1E3A8A] transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Koleksi Arsip
            </span>
            <div className="w-8 h-8 rounded-md bg-blue-100 border-2 border-blue-900 flex items-center justify-center text-blue-900 group-hover:bg-blue-900 group-hover:text-white transition-colors">
              <Library className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-3xl font-black text-blue-950 tracking-tight">
              {stats.koleksi.total.toLocaleString("id-ID")}
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <Badge className="bg-emerald-100 text-emerald-900 border border-emerald-400 font-bold text-[10px] px-1.5 py-0">
                {stats.koleksi.tersedia} Tersedia
              </Badge>
              <span className="text-[10px] text-slate-400 font-bold">•</span>
              <span className="text-xs font-semibold text-slate-600">
                {stats.koleksi.dipinjam} Dipinjam
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>{stats.koleksi.byType.skripsi} Skripsi • {stats.koleksi.byType.ringkasan} RKS</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-blue-900 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* 2. Sirkulasi Berjalan Card */}
      <div 
        onClick={() => onNavigate("/admin/sirkulasi")}
        className="bg-white border-2 border-blue-900 rounded-lg p-5 shadow-[4px_4px_0px_#1E3A8A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#1E3A8A] transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Sirkulasi Berjalan
            </span>
            <div className="w-8 h-8 rounded-md bg-amber-100 border-2 border-blue-900 flex items-center justify-center text-amber-900 group-hover:bg-amber-400 group-hover:text-blue-950 transition-colors">
              <RefreshCcw className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-3xl font-black text-blue-950 tracking-tight">
              {stats.sirkulasi.totalAktif.toLocaleString("id-ID")}
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <Badge className="bg-amber-100 text-amber-900 border border-amber-400 font-bold text-[10px] px-1.5 py-0">
                {stats.sirkulasi.waitingAcc} Antre ACC
              </Badge>
              <span className="text-[10px] text-slate-400 font-bold">•</span>
              <span className="text-xs font-semibold text-slate-600">
                {stats.sirkulasi.waitingPickup} Siap Ambil
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>{stats.sirkulasi.borrowed} Membawa Fisik • {stats.sirkulasi.overdue} Telat</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-blue-900 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* 3. Kas Denda Terkumpul Card */}
      <div 
        onClick={() => onNavigate("/admin/denda")}
        className="bg-white border-2 border-blue-900 rounded-lg p-5 shadow-[4px_4px_0px_#1E3A8A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#1E3A8A] transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Kas Denda Terkumpul
            </span>
            <div className="w-8 h-8 rounded-md bg-emerald-100 border-2 border-blue-900 flex items-center justify-center text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <BadgeDollarSign className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight truncate">
              {formattedStats?.kasTerkumpul || "Rp 0"}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>100% Tercatat Kasir Loket</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>Buku Kas LPJ HMP</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-blue-900 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* 4. Tunggakan Denda Aktif Card */}
      <div 
        onClick={() => onNavigate("/admin/denda")}
        className="bg-red-50/40 border-2 border-red-800 rounded-lg p-5 shadow-[4px_4px_0px_#991B1B] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#991B1B] transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-800">
              Tunggakan Denda Aktif
            </span>
            <div className="w-8 h-8 rounded-md bg-red-100 border-2 border-red-800 flex items-center justify-center text-red-800 group-hover:bg-red-700 group-hover:text-white transition-colors">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-red-700 tracking-tight truncate">
              {formattedStats?.tunggakan || "Rp 0"}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-red-700">
              <Lock className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>{stats.keuangan.mahasiswaTerblokir} Mahasiswa Terblokir</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-red-200 flex items-center justify-between text-[11px] text-red-800 font-semibold">
          <span>Perlu Penyelesaian Administrasi</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

    </div>
  );
}

import { AlertCircle, DollarSign, Users, CheckCircle2 } from "lucide-react";
import type { FineStats } from "@/services/fine.service";
import { formatRupiah } from "@/lib/utils";

interface FineMetricCardsProps {
  stats: FineStats;
  isLoading: boolean;
}

export function FineMetricCards({ stats, isLoading }: FineMetricCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] flex flex-col justify-between gap-4 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 bg-slate-200 rounded" />
              <div className="w-8 h-8 rounded-lg bg-slate-200" />
            </div>
            <div className="space-y-2">
              <div className="h-8 w-40 bg-slate-300 rounded" />
              <div className="h-3 w-28 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
      {/* Card 1: Total Tunggakan Aktif */}
      <div className="bg-white p-5 rounded-xl border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] flex flex-col justify-between gap-4 transition-all hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            Total Tunggakan Aktif
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-100 border-2 border-blue-900 flex items-center justify-center shadow-[1.5px_1.5px_0px_#1E3A8A]">
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">
            {formatRupiah(stats.totalUnpaidAmount)}
          </p>
          <p className="text-xs font-bold text-slate-500 mt-1">
            Dari <span className="text-blue-950 font-black">{stats.unpaidCount || 0}</span> tagihan belum dibayar
          </p>
        </div>
      </div>

      {/* Card 2: Terkumpul (Bulan Ini) */}
      <div className="bg-white p-5 rounded-xl border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] flex flex-col justify-between gap-4 transition-all hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-4 h-4" />
            Terkumpul (Bulan Ini)
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-100 border-2 border-blue-900 flex items-center justify-center shadow-[1.5px_1.5px_0px_#1E3A8A]">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">
            {formatRupiah(stats.totalPaidAmount)}
          </p>
          <p className="text-xs font-bold text-slate-500 mt-1">
            Dari <span className="text-blue-950 font-black">{stats.paidCount || 0}</span> transaksi lunas
          </p>
        </div>
      </div>

      {/* Card 3: Mahasiswa Terblokir */}
      <div className="bg-white p-5 rounded-xl border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] flex flex-col justify-between gap-4 transition-all hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            Mahasiswa Terblokir
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-100 border-2 border-blue-900 flex items-center justify-center shadow-[1.5px_1.5px_0px_#1E3A8A]">
            <Users className="w-4 h-4 text-amber-700" />
          </div>
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">
            {stats.blockedStudentsCount || 0} Orang
          </p>
          <p className="text-xs font-bold text-slate-500 mt-1">
            Akses peminjaman terkunci otomatis
          </p>
        </div>
      </div>
    </div>
  );
}

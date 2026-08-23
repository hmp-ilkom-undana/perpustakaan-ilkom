import { ShieldCheck, UserCheck, UserX } from "lucide-react";

interface StaffStatsHeaderProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
  };
  isLoading?: boolean;
}

export function StaffStatsHeader({ stats, isLoading }: StaffStatsHeaderProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {/* Metric 1: Total Petugas */}
      <div className="p-4 bg-white border-2 border-blue-900 rounded-lg shadow-[4px_4px_0px_#1E3A8A] flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-blue-900">
            Total Petugas
          </span>
          <ShieldCheck className="w-4 h-4 text-blue-900" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-blue-950">
          {isLoading ? "-" : stats.total}
        </div>
        <p className="text-[11px] font-semibold text-slate-500 mt-1">
          Staf perpustakaan terdaftar
        </p>
      </div>

      {/* Metric 2: Petugas Aktif */}
      <div className="p-4 bg-white border-2 border-blue-900 rounded-lg shadow-[4px_4px_0px_#1E3A8A] flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
            Petugas Aktif
          </span>
          <UserCheck className="w-4 h-4 text-emerald-700" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-emerald-700">
          {isLoading ? "-" : stats.active}
        </div>
        <p className="text-[11px] font-semibold text-slate-500 mt-1">
          Akses operasional aktif
        </p>
      </div>

      {/* Metric 3: Akses Dinonaktifkan */}
      <div className="p-4 bg-white border-2 border-blue-900 rounded-lg shadow-[4px_4px_0px_#1E3A8A] flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-rose-800">
            Akses Dinonaktifkan
          </span>
          <UserX className="w-4 h-4 text-rose-700" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-rose-700">
          {isLoading ? "-" : stats.inactive}
        </div>
        <p className="text-[11px] font-semibold text-slate-500 mt-1">
          Akses login terkunci
        </p>
      </div>
    </div>
  );
}

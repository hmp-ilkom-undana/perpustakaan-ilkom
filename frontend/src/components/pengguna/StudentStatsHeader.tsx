import { Users, UserCheck, UserX, BookOpen } from "lucide-react";

interface StudentStatsHeaderProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    totalBorrowings: number;
  };
  isLoading?: boolean;
}

export function StudentStatsHeader({ stats, isLoading }: StudentStatsHeaderProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Metric 1: Total Mahasiswa */}
      <div className="p-4 bg-white border-2 border-blue-900 rounded-lg shadow-[4px_4px_0px_#1E3A8A] flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-blue-900">
            Total Mahasiswa
          </span>
          <Users className="w-4 h-4 text-blue-900" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-blue-950">
          {isLoading ? "-" : stats.total}
        </div>
        <p className="text-[11px] font-semibold text-slate-500 mt-1">
          Terdaftar di sistem
        </p>
      </div>

      {/* Metric 2: Akun Aktif */}
      <div className="p-4 bg-white border-2 border-blue-900 rounded-lg shadow-[4px_4px_0px_#1E3A8A] flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
            Akun Aktif
          </span>
          <UserCheck className="w-4 h-4 text-emerald-700" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-emerald-700">
          {isLoading ? "-" : stats.active}
        </div>
        <p className="text-[11px] font-semibold text-slate-500 mt-1">
          Dapat meminjam buku
        </p>
      </div>

      {/* Metric 3: Non-Aktif */}
      <div className="p-4 bg-white border-2 border-blue-900 rounded-lg shadow-[4px_4px_0px_#1E3A8A] flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-rose-800">
            Non-Aktif
          </span>
          <UserX className="w-4 h-4 text-rose-700" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-rose-700">
          {isLoading ? "-" : stats.inactive}
        </div>
        <p className="text-[11px] font-semibold text-slate-500 mt-1">
          Akses dinonaktifkan
        </p>
      </div>

      {/* Metric 4: Pinjaman Aktif */}
      <div className="p-4 bg-white border-2 border-blue-900 rounded-lg shadow-[4px_4px_0px_#1E3A8A] flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-amber-800">
            Pinjaman Aktif
          </span>
          <BookOpen className="w-4 h-4 text-amber-700" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-blue-900">
          {isLoading ? "-" : stats.totalBorrowings}
        </div>
        <p className="text-[11px] font-semibold text-slate-500 mt-1">
          Buku sedang dipinjam
        </p>
      </div>
    </div>
  );
}

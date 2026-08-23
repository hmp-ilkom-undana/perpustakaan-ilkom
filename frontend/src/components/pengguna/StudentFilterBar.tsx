import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { StudentStatusFilter } from "@/hooks/useAdminPengguna";

interface StudentFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: StudentStatusFilter;
  onStatusFilterChange: (status: StudentStatusFilter) => void;
}

export function StudentFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: StudentFilterBarProps) {
  return (
    <div className="p-4 sm:p-5 border-b-2 border-blue-900 bg-slate-50/70 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
      {/* Search Input Box */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Cari berdasarkan NIM, Nama, atau Email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-11 text-sm border-2 border-blue-900 bg-white rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-blue-900 font-medium"
        />
      </div>

      {/* Status Filter Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 bg-white p-1 border-2 border-blue-900 rounded-md shadow-[2px_2px_0px_#1E3A8A]">
          <span className="text-xs font-black text-blue-900 px-2 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Status:
          </span>
          <button
            type="button"
            onClick={() => onStatusFilterChange("ALL")}
            className={`px-2.5 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
              statusFilter === "ALL"
                ? "bg-blue-900 text-white shadow-[1px_1px_0px_#1E3A8A]"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange("Aktif")}
            className={`px-2.5 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
              statusFilter === "Aktif"
                ? "bg-emerald-600 text-white shadow-[1px_1px_0px_#1E3A8A]"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Aktif
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange("Non-Aktif")}
            className={`px-2.5 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
              statusFilter === "Non-Aktif"
                ? "bg-rose-600 text-white shadow-[1px_1px_0px_#1E3A8A]"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Non-Aktif
          </button>
        </div>
      </div>
    </div>
  );
}

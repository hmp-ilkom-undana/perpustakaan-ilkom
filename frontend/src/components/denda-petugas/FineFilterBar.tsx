import { Search, AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface FineFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  activeTab: "UNPAID" | "PAID";
  onTabChange: (tab: "UNPAID" | "PAID") => void;
  unpaidCount: number;
  paidCount: number;
  isFetching: boolean;
  isFinesLoading: boolean;
}

export function FineFilterBar({
  searchQuery,
  onSearchChange,
  onClearSearch,
  activeTab,
  onTabChange,
  unpaidCount,
  paidCount,
  isFetching,
  isFinesLoading,
}: FineFilterBarProps) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] space-y-3.5">
      {/* SEARCH INPUT */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-900 pointer-events-none" />
        <Input
          placeholder="Cari NIM, Nama Mahasiswa, Judul Arsip, atau Kode Transaksi..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10 w-full bg-slate-50 border-2 border-blue-900 font-bold text-slate-800 placeholder:text-slate-400 shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:bg-white rounded-lg h-11"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={onClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer p-1"
            title="Hapus pencarian"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* TAB SELECTORS */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => onTabChange("UNPAID")}
          className={`px-4 py-2.5 rounded-lg border-2 border-blue-900 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "UNPAID"
              ? "bg-rose-600 text-white shadow-[3px_3px_0px_#1E3A8A]"
              : "bg-white text-slate-700 hover:bg-slate-50 shadow-[2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px]"
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          Menunggu Pelunasan
          <Badge
            variant={activeTab === "UNPAID" ? "outline" : "rose"}
            className={`ml-1 text-[10px] font-black ${
              activeTab === "UNPAID"
                ? "bg-white text-rose-700 border-rose-700 shadow-none"
                : ""
            }`}
          >
            {unpaidCount}
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("PAID")}
          className={`px-4 py-2.5 rounded-lg border-2 border-blue-900 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "PAID"
              ? "bg-emerald-600 text-white shadow-[3px_3px_0px_#1E3A8A]"
              : "bg-white text-slate-700 hover:bg-slate-50 shadow-[2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px]"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Riwayat Pelunasan
          <Badge
            variant={activeTab === "PAID" ? "outline" : "emerald"}
            className={`ml-1 text-[10px] font-black ${
              activeTab === "PAID"
                ? "bg-white text-emerald-800 border-emerald-800 shadow-none"
                : ""
            }`}
          >
            {paidCount}
          </Badge>
        </button>

        {isFetching && !isFinesLoading && (
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 ml-auto animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-900" />
            Menyinkronkan data...
          </span>
        )}
      </div>
    </div>
  );
}

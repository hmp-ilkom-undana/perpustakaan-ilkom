import { Search, X } from "lucide-react";

interface CirculationSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
}

export function CirculationSearchBar({
  searchQuery,
  onSearchChange,
  onClear,
}: CirculationSearchBarProps) {
  return (
    <div className="relative group w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-500 transition-colors">
        <Search className="w-5 h-5" />
      </div>
      <input
        type="text"
        className="block w-full pl-12 pr-10 py-3.5 bg-white border-2 border-blue-900 rounded-xl text-sm md:text-base font-semibold text-blue-950 placeholder:text-slate-400 shadow-[2px_2px_0px_#1E3A8A] focus:shadow-[4px_4px_0px_#F97316] focus:border-orange-500 transition-all outline-none"
        placeholder="Cari kode transaksi, NIM, nama mahasiswa, atau judul arsip..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchQuery && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-rose-600 transition-colors"
          aria-label="Bersihkan pencarian"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface KatalogFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  filterType: string;
  onTypeChange: (value: string) => void;
  filterCategory: string;
  onCategoryChange: (value: string) => void;
}

export function KatalogFilterBar({
  searchQuery,
  onSearchChange,
  onClearSearch,
  filterType,
  onTypeChange,
  filterCategory,
  onCategoryChange,
}: KatalogFilterBarProps) {
  return (
    <div className="bg-white p-4 border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] rounded-xl flex flex-col md:flex-row gap-3 items-center relative z-20">
      {/* SEARCH INPUT */}
      <div className="relative w-full md:flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
        <Input
          placeholder="Cari berdasarkan judul, penulis, atau kode arsip..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10 w-full border-2 border-blue-900 bg-white font-semibold text-blue-950 shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:border-blue-900 rounded-lg h-11 placeholder:text-slate-400"
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

      {/* DROPDOWN FILTERS */}
      <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-2.5">
        <Select
          value={filterType || "all"}
          onValueChange={(val) => onTypeChange(val || "all")}
        >
          <SelectTrigger className="w-full sm:w-44 h-11 text-xs md:text-sm font-bold text-blue-950 bg-white border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] rounded-lg">
            <SelectValue placeholder="Semua Jenis" />
          </SelectTrigger>
          <SelectContent className="w-[var(--anchor-width)] max-w-[calc(100vw-32px)]">
            <SelectItem value="all">Semua Jenis</SelectItem>
            <SelectItem value="Skripsi">Skripsi</SelectItem>
            <SelectItem value="Ringkasan Skripsi">Ringkasan Skripsi</SelectItem>
            <SelectItem value="Naskah Publikasi">Naskah Publikasi</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filterCategory || "all"}
          onValueChange={(val) => onCategoryChange(val || "all")}
        >
          <SelectTrigger className="w-full sm:w-48 h-11 text-xs md:text-sm font-bold text-blue-950 bg-white border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] rounded-lg">
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent className="w-[var(--anchor-width)] max-w-[calc(100vw-32px)]">
            <SelectItem value="all">Semua Kategori</SelectItem>
            <SelectItem value="Machine Learning">Machine Learning</SelectItem>
            <SelectItem value="Sistem Informasi">Sistem Informasi</SelectItem>
            <SelectItem value="Sistem Pakar">Sistem Pakar</SelectItem>
            <SelectItem value="SPK">SPK</SelectItem>
            <SelectItem value="Kriptografi">Kriptografi</SelectItem>
            <SelectItem value="Umum">Umum</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

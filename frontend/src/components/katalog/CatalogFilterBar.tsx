import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CatalogFilterBarProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onTypeChange: (value: string) => void;
  filterCategory: string;
  onCategoryChange: (value: string) => void;
  filterAvailability: string;
  onAvailabilityChange: (value: string) => void;
}

export function CatalogFilterBar({
  searchInput,
  onSearchChange,
  filterType,
  onTypeChange,
  filterCategory,
  onCategoryChange,
  filterAvailability,
  onAvailabilityChange,
}: CatalogFilterBarProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-3 w-full">
      {/* Input Pencarian Judul / Penulis */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-950/60" />
        <Input
          type="text"
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari judul arsip, penulis, atau kata kunci..."
          className="pl-10 h-10 w-full"
        />
      </div>

      {/* Row Filter Dropdowns */}
      <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center">
        {/* Filter Jenis Arsip */}
        <div className="flex-1 sm:w-44">
          <Select
            value={filterType}
            onValueChange={(val) => onTypeChange(val || "Semua")}
          >
            <SelectTrigger className="w-full h-10">
              <SelectValue placeholder="Pilih Jenis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua">Semua Jenis</SelectItem>
              <SelectItem value="Skripsi">Skripsi</SelectItem>
              <SelectItem value="Ringkasan Skripsi">
                Ringkasan Skripsi
              </SelectItem>
              <SelectItem value="Naskah Publikasi">
                Naskah Publikasi
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filter Kategori (Standard Asli: Machine Learning, Sistem Informasi, Sistem Pakar, SPK, Kriptografi, Umum) */}
        <div className="flex-1 sm:w-44">
          <Select
            value={filterCategory}
            onValueChange={(val) => onCategoryChange(val || "Semua")}
          >
            <SelectTrigger className="w-full h-10">
              <SelectValue placeholder="Pilih Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua">Semua Kategori</SelectItem>
              <SelectItem value="Machine Learning">Machine Learning</SelectItem>
              <SelectItem value="Sistem Informasi">Sistem Informasi</SelectItem>
              <SelectItem value="Sistem Pakar">Sistem Pakar</SelectItem>
              <SelectItem value="SPK">SPK</SelectItem>
              <SelectItem value="Kriptografi">Kriptografi</SelectItem>
              <SelectItem value="Umum">Umum</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filter Ketersediaan */}
        <div className="flex-1 sm:w-40">
          <Select
            value={filterAvailability}
            onValueChange={(val) => onAvailabilityChange(val || "Semua")}
          >
            <SelectTrigger className="w-full h-10">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua">Semua Status</SelectItem>
              <SelectItem value="Tersedia">Tersedia</SelectItem>
              <SelectItem value="Dipinjam">Sedang Dipinjam</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

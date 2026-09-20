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
    <div className="flex flex-col lg:flex-row gap-3 items-end w-full">
      {/* Input Pencarian Judul / Penulis */}
      <div className="relative flex-1 w-full flex flex-col gap-1">
        <label className="text-[11px] font-black uppercase text-blue-950 tracking-wider">
          Pencarian Arsip
        </label>
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-950/60" />
          <Input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari judul arsip, penulis, atau kata kunci..."
            className="pl-10 h-10 w-full"
          />
        </div>
      </div>

      {/* Row Filter Dropdowns (Mobile: 2 kolom atas + 1 baris penuh bawah, Desktop: sejajar) */}
      <div className="grid grid-cols-2 sm:flex sm:flex-nowrap gap-3 items-end w-full lg:w-auto">
        {/* Filter Jenis Arsip */}
        <div className="w-full sm:w-44 flex flex-col gap-1">
          <label className="text-[11px] font-black uppercase text-blue-950 tracking-wider">
            Jenis Arsip
          </label>
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

        {/* Filter Kategori */}
        <div className="w-full sm:w-44 flex flex-col gap-1">
          <label className="text-[11px] font-black uppercase text-blue-950 tracking-wider">
            Kategori
          </label>
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

        {/* Filter Ketersediaan (Lebar Penuh di Mobile) */}
        <div className="col-span-2 sm:col-span-1 w-full sm:w-40 flex flex-col gap-1">
          <label className="text-[11px] font-black uppercase text-blue-950 tracking-wider">
            Ketersediaan
          </label>
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
              <SelectItem value="Diajukan">Diajukan</SelectItem>
              <SelectItem value="Dipinjam">Dipinjam</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

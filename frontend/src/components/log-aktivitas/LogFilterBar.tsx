import { Search, RotateCcw, Filter, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ActivityRole } from "@/services/activity-log.service";

interface LogFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedRole: ActivityRole | "ALL";
  onRoleChange: (val: ActivityRole | "ALL") => void;
  selectedEntity: string;
  onEntityChange: (val: string) => void;
  onResetFilters: () => void;
  isFiltered: boolean;
  totalResults: number;
}

export function LogFilterBar({
  search,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedEntity,
  onEntityChange,
  onResetFilters,
  isFiltered,
  totalResults,
}: LogFilterBarProps) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] space-y-4">
      {/* GRID CONTROLS WITH TOP LABELS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
        {/* Kolom 1: Input Pencarian (6 Kolom = 50%) */}
        <div className="md:col-span-6 space-y-1.5">
          <label className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-blue-900" />
            Pencarian Aktivitas
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Cari aktor, deskripsi aktivitas, email, atau ID..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-9 h-11 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] font-semibold text-xs sm:text-sm rounded-lg focus-visible:ring-0 focus-visible:border-blue-900 bg-white"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                title="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Kolom 2: Dropdown Role Aktor (3 Kolom = 25%) */}
        <div className="md:col-span-3 space-y-1.5">
          <label className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
            <UserCog className="w-3.5 h-3.5 text-blue-900" />
            Peran / Role
          </label>
          <Select
            value={selectedRole}
            onValueChange={(v) =>
              onRoleChange(
                ((v as ActivityRole) || "ALL") as ActivityRole | "ALL",
              )
            }
          >
            <SelectTrigger className="w-full h-11 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] font-bold text-xs rounded-lg bg-white justify-between">
              <SelectValue placeholder="Semua Role" />
            </SelectTrigger>
            <SelectContent className="border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] bg-white">
              <SelectItem value="ALL" className="font-bold text-xs">
                Semua Role
              </SelectItem>
              <SelectItem
                value="ADMIN"
                className="font-bold text-xs text-purple-700"
              >
                Administrator
              </SelectItem>
              <SelectItem
                value="PETUGAS"
                className="font-bold text-xs text-orange-600"
              >
                Petugas Perpustakaan
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Kolom 3: Dropdown Kategori Entitas / Modul (3 Kolom = 25%) */}
        <div className="md:col-span-3 space-y-1.5">
          <label className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-900" />
            Jenis Aktivitas
          </label>
          <Select
            value={selectedEntity}
            onValueChange={(v) => onEntityChange(v || "ALL")}
          >
            <SelectTrigger className="w-full h-11 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] font-bold text-xs rounded-lg bg-white justify-between">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent className="border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] bg-white">
              <SelectItem value="ALL" className="font-bold text-xs">
                Semua Kategori
              </SelectItem>
              <SelectItem value="BORROWING" className="font-bold text-xs">
                Sirkulasi & Peminjaman
              </SelectItem>
              <SelectItem value="FINE" className="font-bold text-xs">
                Pelunasan Denda
              </SelectItem>
              <SelectItem value="ARCHIVE" className="font-bold text-xs">
                Katalog Arsip
              </SelectItem>
              <SelectItem value="USER" className="font-bold text-xs">
                Manajemen Petugas
              </SelectItem>
              <SelectItem value="SYSTEM_SETTING" className="font-bold text-xs">
                Pengaturan Sistem
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* FOOTER BARIS INFORMASI & RESET FILTER */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1.5">
          Menampilkan{" "}
          <span className="text-blue-950 font-black">{totalResults}</span>{" "}
          catatan aktivitas
        </span>

        {isFiltered && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="h-8 px-3 text-xs font-bold text-rose-600 border-2 border-rose-600 shadow-[2px_2px_0px_#E11D48] hover:bg-rose-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset Filter
          </Button>
        )}
      </div>
    </div>
  );
}

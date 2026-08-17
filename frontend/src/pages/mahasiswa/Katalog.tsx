import { useState } from "react";
import { ArchiveCard } from "@/components/ArchiveCard";
import { ArchiveDetailDialog } from "@/components/ArchiveDetailDialog";
import { usePublicArchiveQuery } from "@/hooks/queries/useArchiveQuery";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Library, Loader2, Search } from "lucide-react";

interface ArchiveData {
  id: string;
  title: string;
  author: string;
  year: number;
  archiveType: string;
  category: string;
  status: string;
  quantity: number;
  reservedQuantity: number;
  isRequestedByCurrentUser?: boolean;
}

export default function Katalog() {
  const [selectedArchive, setSelectedArchive] = useState<any>(null);
  const [filterType, setFilterType] = useState<string>("Semua");
  const [filterCategory, setFilterCategory] = useState<string>("Semua");
  const [filterAvailability, setFilterAvailability] = useState<string>("Semua");

  const { data: rawArchives = [], isPending: loading } = usePublicArchiveQuery();
  const archives: ArchiveData[] = Array.isArray(rawArchives)
    ? rawArchives
    : (rawArchives as any)?.data ?? [];

  const filteredArchives = archives.filter((archive) => {
    const matchType =
      filterType === "Semua" || archive.archiveType === filterType;
    const matchCategory =
      filterCategory === "Semua" || archive.category === filterCategory;

    let matchAvailability = true;
    const isAvailable =
      archive.quantity - archive.reservedQuantity > 0 &&
      archive.status !== "DIPINJAM";

    if (filterAvailability === "Tersedia") {
      matchAvailability = isAvailable === true;
    } else if (filterAvailability === "Dipinjam") {
      matchAvailability = isAvailable === false;
    }

    return matchType && matchCategory && matchAvailability;
  });

  return (
    <div className="flex flex-col gap-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER & FILTER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b-2 border-blue-900 p-4 sm:p-0">
        {/* Bagian Judul */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 text-white border-2 border-blue-900 rounded-lg flex items-center justify-center shadow-[2px_2px_0px_#1E3A8A] shrink-0">
            <Library className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-950">
              Katalog Arsip
            </h1>
            <p className="text-slate-500 text-xs font-semibold mt-0.5">
              Cari dan ajukan peminjaman arsip tugas akhir yang Anda butuhkan.
            </p>
          </div>
        </div>

        {/* Bagian Filter */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto">
          {/* Filter Jenis Arsip */}
          <div className="flex flex-col gap-1 flex-1 sm:w-44">
            <label className="text-[10px] font-black text-blue-950 uppercase tracking-wider">
              Jenis Arsip
            </label>
            <Select
              value={filterType}
              onValueChange={(val) => setFilterType(val || "Semua")}
            >
              <SelectTrigger className="w-full">
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
          <div className="flex flex-col gap-1 flex-1 sm:w-44">
            <label className="text-[10px] font-black text-blue-950 uppercase tracking-wider">
              Kategori
            </label>
            <Select
              value={filterCategory}
              onValueChange={(val) => setFilterCategory(val || "Semua")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua Kategori</SelectItem>
                <SelectItem value="Kecerdasan Buatan">Kecerdasan Buatan</SelectItem>
                <SelectItem value="Keamanan Jaringan">Keamanan Jaringan</SelectItem>
                <SelectItem value="Sistem Informasi">Sistem Informasi</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="Multimedia">Multimedia</SelectItem>
                <SelectItem value="Rekayasa Perangkat Lunak">RPL</SelectItem>
                <SelectItem value="Web Development">Web Development</SelectItem>
                <SelectItem value="HCI">HCI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter Ketersediaan */}
          <div className="flex flex-col gap-1 flex-1 sm:w-40">
            <label className="text-[10px] font-black text-blue-950 uppercase tracking-wider">
              Ketersediaan
            </label>
            <Select
              value={filterAvailability}
              onValueChange={(val) => setFilterAvailability(val || "Semua")}
            >
              <SelectTrigger className="w-full">
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

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
          <p className="text-xs font-bold text-slate-500">Memuat katalog arsip...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-4 sm:px-0">
          {filteredArchives.length > 0 ? (
            filteredArchives.map((archive) => (
              <ArchiveCard
                key={archive.id}
                id={archive.id}
                title={archive.title}
                author={archive.author}
                year={archive.year}
                archiveType={archive.archiveType}
                category={archive.category}
                quantity={archive.quantity}
                reservedQuantity={archive.reservedQuantity}
                status={archive.status}
                isRequestedByCurrentUser={archive.isRequestedByCurrentUser}
                onClick={() => setSelectedArchive(archive)}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 bg-white border-2 border-blue-900 border-dashed rounded-lg shadow-[4px_4px_0px_#1E3A8A] text-center">
              <div className="bg-orange-100 border-2 border-blue-900 w-14 h-14 rounded-lg flex items-center justify-center mb-3 shadow-[2px_2px_0px_#1E3A8A]">
                <Search className="w-7 h-7 text-blue-950" />
              </div>
              <p className="text-base font-black text-blue-950">
                Tidak Ada Arsip yang Sesuai
              </p>
              <p className="text-xs font-semibold text-slate-500 mt-1 max-w-sm">
                Coba ubah kombinasi filter jenis arsip, kategori, atau ketersediaan untuk menemukan dokumen yang dicari.
              </p>
            </div>
          )}
        </div>
      )}

      {/* DIALOG DETAIL */}
      <ArchiveDetailDialog
        isOpen={selectedArchive !== null}
        onClose={() => setSelectedArchive(null)}
        archive={selectedArchive}
      />
    </div>
  );
}

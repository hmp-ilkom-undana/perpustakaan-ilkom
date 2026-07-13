import { useEffect, useState } from "react";
import { ArchiveCard } from "@/components/ArchiveCard";
import { ArchiveDetailDialog } from "@/components/ArchiveDetailDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ArchiveData {
  id: string;
  title: string;
  author: string;
  year: number;
  archiveType: string;
  category: string;
  status: string;
}

export default function Katalog() {
  const [archives, setArchives] = useState<ArchiveData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedArchive, setSelectedArchive] = useState<any>(null);
  const [filterType, setFilterType] = useState<string>("Semua");
  const [filterCategory, setFilterCategory] = useState<string>("Semua");

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/archives", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data dari server");
        }

        const data = await response.json();

        setArchives(data);
      } catch (error) {
        console.error("Error fetching archives:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArchives();
  }, []);

  const filteredArchives = archives.filter((archive) => {
    const matchType =
      filterType === "Semua" || archive.archiveType === filterType;
    const matchCategory =
      filterCategory === "Semua" || archive.category === filterCategory;
    return matchType && matchCategory;
  });

  return (
    <div className="space-y-6">
      {/* HEADER & FILTER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/70">
        {/* Bagian Judul */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-blue-900">
            Katalog Arsip
          </h2>
          <p className="text-slate-500 text-sm">
            Cari dan ajukan peminjaman arsip tugas akhir yang Anda butuhkan.
          </p>
        </div>

        {/* Bagian Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-1 w-full md:w-auto">
          {/* Filter Jenis Arsip */}
          <div className="flex flex-col gap-1.5 w-full sm:w-40">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Jenis Arsip
            </label>
            <Select
              value={filterType}
              onValueChange={(val) => setFilterType(val || "Semua")}
            >
              <SelectTrigger className="bg-white border-slate-200 focus:ring-blue-600 shadow-sm h-9">
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
          <div className="flex flex-col gap-1.5 w-full sm:w-40">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Kategori
            </label>
            <Select
              value={filterCategory}
              onValueChange={(val) => setFilterCategory(val || "Semua")}
            >
              <SelectTrigger className="bg-white border-slate-200 focus:ring-blue-600 shadow-sm h-9">
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua Kategori</SelectItem>
                <SelectItem value="Machine Learning">
                  Machine Learning
                </SelectItem>
                <SelectItem value="Sistem Informasi">
                  Sistem Informasi
                </SelectItem>
                <SelectItem value="Sistem Pakar">Sistem Pakar</SelectItem>
                <SelectItem value="SPK">SPK</SelectItem>
                <SelectItem value="Kriptografi">Kriptografi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-slate-500">
          <p>Memuat data dari server...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                status={archive.status}
                onClick={() => setSelectedArchive(archive)}
              />
            ))
          ) : (
            /* Tampilan jika database Backend masih kosong */
            <div className="col-span-full flex flex-col items-center justify-center py-16 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-lg font-medium text-slate-600">
                Belum ada arsip yang tersedia.
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Koleksi arsip tugas akhir, ringkasan skripsi, dan naskah
                publikasi sedang diperbarui. Silakan kembali lagi nanti.
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

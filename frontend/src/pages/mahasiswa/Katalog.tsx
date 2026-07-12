import { useEffect, useState } from "react";
import { ArchiveCard } from "@/components/ArchiveCard";

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

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/archives");

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-blue-900">
          Katalog Arsip
        </h2>
        <p className="text-slate-500">
          Cari dan ajukan peminjaman arsip tugas akhir yang Anda butuhkan.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-slate-500">
          <p>Memuat data dari server...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {archives.length > 0 ? (
            /* Lakukan Looping Data dari Backend */
            archives.map((archive) => (
              <ArchiveCard
                key={archive.id}
                id={archive.id}
                title={archive.title}
                author={archive.author}
                year={archive.year}
                archiveType={archive.archiveType}
                category={archive.category}
                status={archive.status}
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
    </div>
  );
}

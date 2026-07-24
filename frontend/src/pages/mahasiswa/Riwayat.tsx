import { HistoryRow, HistoryItemProps } from "@/components/HistoryRow";
import { HistoryDetailDialog } from "@/components/HistoryDetailDialog";
import { History } from "lucide-react";
import { useState } from "react";

const mockHistoryData: HistoryItemProps[] = [
  {
    id: "H-1001",
    title: "Analisis Algoritma Dijkstra pada Jaringan Distribusi",
    type: "Skripsi",
    borrowDate: "12 Jan 2024",
    returnDate: "26 Jan 2024",
    status: "RETURNED",
    fine: 0,
    note: "-"
  },
  {
    id: "H-1002",
    title: "Sistem Informasi Manajemen Perpustakaan Terintegrasi",
    type: "Buku",
    borrowDate: "05 Mar 2024",
    returnDate: "12 Mar 2024",
    status: "CANCELLED",
    note: "Dibatalkan otomatis karena melewati batas waktu pengambilan."
  },
  {
    id: "H-1003",
    title: "Dasar-Dasar Keamanan Jaringan Komputer",
    type: "Buku",
    borrowDate: "10 Apr 2024",
    returnDate: "11 Apr 2024",
    status: "REJECTED",
    note: "Arsip sedang dalam perbaikan fisik dan tidak dapat dipinjam."
  },
  {
    id: "H-1004",
    title: "Penerapan Machine Learning dalam Prediksi Cuaca",
    type: "Naskah Publikasi",
    borrowDate: "01 Mei 2024",
    returnDate: "20 Mei 2024",
    status: "LOST",
    fine: 150000,
    paymentDate: "22 Mei 2024",
    note: "Mahasiswa melapor buku tertinggal di stasiun, mengganti dengan denda kehilangan."
  },
  {
    id: "H-1005",
    title: "Jaringan Syaraf Tiruan untuk Pengenalan Wajah",
    type: "Skripsi",
    borrowDate: "01 Jun 2024",
    returnDate: "10 Jun 2024",
    status: "DAMAGED",
    fine: 50000,
    note: "Sampul belakang robek saat dikembalikan, dikenakan denda kerusakan fisik."
  }
];

export default function Riwayat() {
  const [selectedItem, setSelectedItem] = useState<HistoryItemProps | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDetail = (item: HistoryItemProps) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-0 sm:gap-6 pb-6 sm:p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2 p-4 sm:p-0">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Riwayat Peminjaman
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Lihat rekam jejak transaksi arsip yang sudah selesai atau berakhir.
        </p>
      </div>

      {/* CONTENT SECTION */}
      <div className="sm:rounded-xl sm:border border-slate-200 bg-white sm:shadow-sm sm:p-6 overflow-hidden">
        {mockHistoryData.length > 0 ? (
          <div className="flex flex-col">
            {mockHistoryData.map((item) => (
              <HistoryRow 
                key={item.id} 
                item={item} 
                onClick={() => handleOpenDetail(item)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <History className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">Belum Ada Riwayat</h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm">
              Anda belum memiliki rekam jejak transaksi peminjaman yang sudah selesai.
            </p>
          </div>
        )}
      </div>

      {/* DIALOG DETAIL */}
      <HistoryDetailDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={selectedItem}
      />
    </div>
  );
}

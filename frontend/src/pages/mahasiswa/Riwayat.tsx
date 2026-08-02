import { HistoryRow, HistoryItemProps, HistoryStatus } from "@/components/HistoryRow";
import { HistoryDetailDialog } from "@/components/HistoryDetailDialog";
import { History, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function Riwayat() {
  const [selectedItem, setSelectedItem] = useState<HistoryItemProps | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [historyData, setHistoryData] = useState<HistoryItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/api/borrowings/my-history");

        const completedStatuses = ["RETURNED", "CANCELLED", "REJECTED", "DAMAGED", "LOST"];
        
        // Filter dan petakan (map) data dari backend
        const mappedData: HistoryItemProps[] = response.data
          .filter((item: any) => completedStatuses.includes(item.status))
          .map((item: any) => ({
            id: item.id,
            pickupCode: item.pickupCode || `REQ-${item.id.substring(0, 6).toUpperCase()}`,
            title: item.archive.title,
            type: item.archive.archiveType,
            borrowDate: new Date(item.borrowDate).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' }),
            returnDate: item.returnDate ? new Date(item.returnDate).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' }) : "-",
            status: item.status as HistoryStatus,
            fine: item.fineAmount,
            note: item.catatanKondisiKembali || "-", 
          }));

        setHistoryData(mappedData);
      } catch (error) {
        console.error("Gagal mengambil riwayat:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

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
      <div className="flex flex-col min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Memuat riwayat...</p>
          </div>
        ) : historyData.length > 0 ? (
          <div className="flex flex-col gap-4">
            {historyData.map((item) => (
              <HistoryRow 
                key={item.id} 
                item={item} 
                onClick={() => handleOpenDetail(item)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-blue-900/30 bg-white shadow-[2px_2px_0px_#1E3A8A]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200">
              <History className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">Belum Ada Riwayat Selesai</h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm">
              Anda belum memiliki rekam jejak transaksi peminjaman yang sudah selesai atau dikembalikan.
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

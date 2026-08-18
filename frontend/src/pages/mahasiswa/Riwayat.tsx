import { HistoryRow, HistoryItemProps, HistoryStatus } from "@/components/HistoryRow";
import { HistoryDetailDialog } from "@/components/HistoryDetailDialog";
import { History, Loader2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useMyBorrowingHistoryQuery } from "@/hooks/queries/useBorrowingQuery";

export default function Riwayat() {
  const [selectedItem, setSelectedItem] = useState<HistoryItemProps | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: rawHistory = [], isPending: isLoading } = useMyBorrowingHistoryQuery();

  const completedStatuses = ["RETURNED", "CANCELLED", "REJECTED", "DAMAGED", "LOST"];

  const historyData: HistoryItemProps[] = rawHistory
    .filter((item: any) => completedStatuses.includes(item.status))
    .map((item: any) => ({
      id: item.id,
      pickupCode: item.pickupCode || `REQ-${item.id.substring(0, 6).toUpperCase()}`,
      title: item.archive.title,
      type: item.archive.archiveType,
      borrowDate: new Date(item.borrowDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
      returnDate: item.returnDate
        ? new Date(item.returnDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
        : "-",
      status: item.status as HistoryStatus,
      fine: item.fineAmount,
      paymentDate: item.finePaidAt
        ? new Date(item.finePaidAt).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : undefined,
      note: item.catatanKondisiKembali || "-",
    }));

  const handleOpenDetail = (item: HistoryItemProps) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-blue-900 p-4 sm:p-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 text-white border-2 border-blue-900 rounded-lg flex items-center justify-center shadow-[2px_2px_0px_#1E3A8A] shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-950">
              Riwayat Peminjaman
            </h1>
            <p className="text-slate-500 text-xs font-semibold mt-0.5">
              Lihat rekam jejak transaksi arsip yang sudah selesai, dikembalikan, atau dibatalkan.
            </p>
          </div>
        </div>

        <Badge variant="outline" className="w-fit self-start sm:self-auto">
          {historyData.length} Selesai
        </Badge>
      </div>

      {/* CONTENT SECTION */}
      <div className="flex flex-col min-h-[400px] px-4 sm:px-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
            <p className="text-xs font-bold text-slate-500">Memuat riwayat peminjaman...</p>
          </div>
        ) : historyData.length > 0 ? (
          <div className="flex flex-col gap-3">
            {historyData.map((item) => (
              <HistoryRow 
                key={item.id} 
                item={item} 
                onClick={() => handleOpenDetail(item)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white border-2 border-blue-900 border-dashed rounded-lg shadow-[4px_4px_0px_#1E3A8A] text-center">
            <div className="bg-orange-100 border-2 border-blue-900 w-14 h-14 rounded-lg flex items-center justify-center mb-3 shadow-[2px_2px_0px_#1E3A8A]">
              <History className="w-7 h-7 text-blue-950" />
            </div>
            <p className="text-base font-black text-blue-950">
              Belum Ada Riwayat Selesai
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1 max-w-sm">
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

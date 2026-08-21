import { History, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useStudentHistory } from "@/hooks/useStudentHistory";
import { HistoryCardRow } from "@/components/riwayat/HistoryCardRow";
import { HistoryDetailModal } from "@/components/riwayat/HistoryDetailModal";
import { HistoryEmptyState } from "@/components/riwayat/HistoryEmptyState";

export default function Riwayat() {
  const {
    historyData,
    isLoading,
    selectedItem,
    isDialogOpen,
    openDetail,
    closeDetail,
    handleContactAdminWa,
  } = useStudentHistory();

  return (
    <div className="flex flex-col gap-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Header Section */}
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

        <Badge
          variant="outline"
          className="w-fit self-start sm:self-auto font-black"
        >
          {historyData.length === 0
            ? "Belum Ada Riwayat"
            : `${historyData.length} Riwayat Selesai`}
        </Badge>
      </div>

      {/* 2. Content List Section */}
      <div className="flex flex-col min-h-[400px] px-4 sm:px-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
            <p className="text-xs font-bold text-slate-500">
              Memuat riwayat peminjaman...
            </p>
          </div>
        ) : historyData.length > 0 ? (
          <div className="flex flex-col gap-3">
            {historyData.map((item) => (
              <HistoryCardRow
                key={item.id}
                item={item}
                onClick={() => openDetail(item)}
              />
            ))}
          </div>
        ) : (
          <HistoryEmptyState />
        )}
      </div>

      {/* 3. Modal Dialog Detail Riwayat */}
      <HistoryDetailModal
        isOpen={isDialogOpen}
        onClose={closeDetail}
        item={selectedItem}
        onContactAdmin={handleContactAdminWa}
      />
    </div>
  );
}

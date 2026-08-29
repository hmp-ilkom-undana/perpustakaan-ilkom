import {
  BookOpenCheck,
  History,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  FolderOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePeminjamanPage, PeminjamanFilter } from "@/hooks/usePeminjamanPage";
import {
  LoanCardRow,
  ActiveBorrowingDetailModal,
  CancelBorrowingDialog,
} from "@/components/peminjaman";
import { HistoryDetailModal } from "@/components/riwayat";

export default function Peminjaman() {
  const {
    activeFilter,
    setActiveFilter,
    filteredItems,
    isLoading,
    allCount,
    activeCount,
    unpaidCount,
    completedCount,
    handleItemClick,
    borrowing,
    history,
  } = usePeminjamanPage();

  const {
    selectedTicket,
    isDetailOpen: isBorrowingDetailOpen,
    closeDetail: closeBorrowingDetail,
    cancelTicketTarget,
    setCancelTicketTarget,
    confirmCancel,
    isCancelling,
    handleContactAdminWa: handleBorrowingContactWa,
  } = borrowing;

  const {
    selectedItem: selectedHistoryItem,
    isDialogOpen: isHistoryDialogOpen,
    closeDetail: closeHistoryDetail,
    handleContactAdminWa: handleHistoryContactWa,
  } = history;

  const getEmptyMessage = (filter: PeminjamanFilter) => {
    switch (filter) {
      case "ACTIVE":
        return {
          title: "Tidak Ada Peminjaman Aktif",
          description: "Anda tidak memiliki antrean pengajuan atau buku yang sedang dipinjam saat ini.",
        };
      case "UNPAID_FINE":
        return {
          title: "Bebas Tunggakan Denda",
          description: "Hebat! Semua kewajiban peminjaman Anda telah tertib dan bebas denda.",
        };
      case "COMPLETED":
        return {
          title: "Belum Ada Riwayat Selesai",
          description: "Riwayat transaksi yang telah dikembalikan atau selesai akan muncul di sini.",
        };
      case "ALL":
      default:
        return {
          title: "Belum Ada Transaksi",
          description: "Jelajahi katalog perpustakaan untuk mulai meminjam skripsi, ringkasan, atau naskah.",
        };
    }
  };

  const emptyInfo = getEmptyMessage(activeFilter);

  return (
    <div className="flex flex-col gap-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-blue-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 text-white border-2 border-blue-900 rounded-lg flex items-center justify-center shadow-[2px_2px_0px_#1E3A8A] shrink-0">
            <BookOpenCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-950">
              Peminjaman Arsip
            </h1>
            <p className="text-slate-500 text-xs font-semibold mt-0.5">
              Pantau status verifikasi, batas penjemputan, tenggat pengembalian, dan riwayat arsip Anda.
            </p>
          </div>
        </div>

        <Badge variant="outline" className="w-fit self-start sm:self-auto font-black">
          {activeCount > 0
            ? `${activeCount} Sedang Aktif • ${allCount} Total Transaksi`
            : `${allCount} Total Transaksi`}
        </Badge>
      </div>

      {/* 2. Flat Filter Tabs (Mobile: 2x2 Grid Seimbang, Desktop: Flex) */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
        {/* Tab 1: Semua */}
        <button
          type="button"
          onClick={() => setActiveFilter("ALL")}
          className={cn(
            "w-full sm:w-auto px-3.5 py-2 rounded-lg border-2 text-xs font-bold transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-1.5",
            activeFilter === "ALL"
              ? "bg-blue-950 text-white border-blue-950 shadow-[2px_2px_0px_#1E3A8A]"
              : "bg-white text-slate-700 border-slate-300 hover:border-blue-900 shadow-[1px_1px_0px_#CBD5E1]"
          )}
        >
          <FolderOpen className="w-3.5 h-3.5 shrink-0" />
          <span>Semua</span>
          <span
            className={cn(
              "px-1.5 py-0.2 rounded-full text-[10px] font-black",
              activeFilter === "ALL" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
            )}
          >
            {allCount}
          </span>
        </button>

        {/* Tab 2: Sedang Aktif */}
        <button
          type="button"
          onClick={() => setActiveFilter("ACTIVE")}
          className={cn(
            "w-full sm:w-auto px-3.5 py-2 rounded-lg border-2 text-xs font-bold transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-1.5",
            activeFilter === "ACTIVE"
              ? "bg-amber-400 text-blue-950 border-blue-900 shadow-[2px_2px_0px_#1E3A8A]"
              : activeCount > 0
              ? "bg-amber-50 text-amber-900 border-amber-400 hover:bg-amber-100 shadow-[1px_1px_0px_#F59E0B]"
              : "bg-white text-slate-700 border-slate-300 hover:border-blue-900 shadow-[1px_1px_0px_#CBD5E1]"
          )}
        >
          <Clock className="w-3.5 h-3.5 text-blue-950 shrink-0" />
          <span>Sedang Aktif</span>
          <span
            className={cn(
              "px-1.5 py-0.2 rounded-full text-[10px] font-black",
              activeFilter === "ACTIVE"
                ? "bg-blue-950 text-white"
                : activeCount > 0
                ? "bg-amber-500 text-blue-950"
                : "bg-slate-100 text-slate-700"
            )}
          >
            {activeCount}
          </span>
        </button>

        {/* Tab 3: Menunggak Denda */}
        <button
          type="button"
          onClick={() => setActiveFilter("UNPAID_FINE")}
          className={cn(
            "w-full sm:w-auto px-3.5 py-2 rounded-lg border-2 text-xs font-bold transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-1.5",
            activeFilter === "UNPAID_FINE"
              ? "bg-rose-600 text-white border-rose-700 shadow-[2px_2px_0px_#991B1B]"
              : unpaidCount > 0
              ? "bg-rose-50 text-rose-900 border-rose-400 hover:bg-rose-100 shadow-[1px_1px_0px_#F43F5E]"
              : "bg-white text-slate-700 border-slate-300 hover:border-blue-900 shadow-[1px_1px_0px_#CBD5E1]"
          )}
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Menunggak Denda</span>
          <span
            className={cn(
              "px-1.5 py-0.2 rounded-full text-[10px] font-black",
              activeFilter === "UNPAID_FINE"
                ? "bg-white text-rose-700"
                : unpaidCount > 0
                ? "bg-rose-600 text-white"
                : "bg-slate-100 text-slate-700"
            )}
          >
            {unpaidCount}
          </span>
        </button>

        {/* Tab 4: Selesai / Bebas Denda */}
        <button
          type="button"
          onClick={() => setActiveFilter("COMPLETED")}
          className={cn(
            "w-full sm:w-auto px-3.5 py-2 rounded-lg border-2 text-xs font-bold transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-1.5",
            activeFilter === "COMPLETED"
              ? "bg-emerald-700 text-white border-emerald-800 shadow-[2px_2px_0px_#065F46]"
              : "bg-white text-slate-700 border-slate-300 hover:border-blue-900 shadow-[1px_1px_0px_#CBD5E1]"
          )}
        >
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>Selesai</span>
          <span
            className={cn(
              "px-1.5 py-0.2 rounded-full text-[10px] font-black",
              activeFilter === "COMPLETED"
                ? "bg-white/20 text-white"
                : "bg-slate-100 text-slate-700"
            )}
          >
            {completedCount}
          </span>
        </button>
      </div>

      {/* 3. Content List Section */}
      <div className="flex flex-col min-h-[350px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
            <p className="text-xs font-bold text-slate-500">
              Memuat data transaksi peminjaman...
            </p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filteredItems.map((item) => (
              <LoanCardRow
                key={`${item.sourceType}-${item.id}`}
                item={item}
                onClick={() => handleItemClick(item)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white border-2 border-blue-900 rounded-xl shadow-[4px_4px_0px_#1E3A8A] text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-blue-900 flex items-center justify-center text-slate-400">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-blue-950">
                {emptyInfo.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium max-w-sm mt-0.5">
                {emptyInfo.description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. Modal Pop-Up Rincian Peminjaman Aktif */}
      <ActiveBorrowingDetailModal
        isOpen={isBorrowingDetailOpen}
        onClose={closeBorrowingDetail}
        ticket={selectedTicket}
        onCancelClick={setCancelTicketTarget}
        onContactAdmin={handleBorrowingContactWa}
      />

      {/* 5. Modal Konfirmasi Pembatalan Antrean */}
      <CancelBorrowingDialog
        ticket={cancelTicketTarget}
        isOpen={cancelTicketTarget !== null}
        onClose={() => setCancelTicketTarget(null)}
        onConfirm={confirmCancel}
        isPending={isCancelling}
      />

      {/* 6. Modal Dialog Detail Riwayat Selesai */}
      <HistoryDetailModal
        isOpen={isHistoryDialogOpen}
        onClose={closeHistoryDetail}
        item={selectedHistoryItem}
        onContactAdmin={handleHistoryContactWa}
      />
    </div>
  );
}

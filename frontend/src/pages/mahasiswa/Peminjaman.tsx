import { BookOpenCheck, History, Loader2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePeminjamanPage } from "@/hooks/usePeminjamanPage";
import {
  ActiveBorrowingCard,
  ActiveBorrowingDetailModal,
  CancelBorrowingDialog,
  EmptyBorrowingState,
} from "@/components/peminjaman";
import {
  HistoryCardRow,
  HistoryDetailModal,
  HistoryEmptyState,
} from "@/components/riwayat";

export default function Peminjaman() {
  const { activeTab, switchTab, borrowing, history } = usePeminjamanPage();

  const {
    tickets,
    isLoading: isLoadingBorrowing,
    isCancelling,
    selectedTicket,
    isDetailOpen,
    openDetail,
    closeDetail: closeBorrowingDetail,
    cancelTicketTarget,
    setCancelTicketTarget,
    confirmCancel,
    handleContactAdminWa: handleBorrowingContactWa,
  } = borrowing;

  const {
    filteredHistory,
    isLoading: isLoadingHistory,
    selectedItem,
    isDialogOpen,
    activeFilter,
    setActiveFilter,
    unpaidFinesCount,
    paidOrCleanCount,
    openDetail: openHistoryDetail,
    closeDetail: closeHistoryDetail,
    handleContactAdminWa: handleHistoryContactWa,
  } = history;

  return (
    <div className="flex flex-col gap-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-blue-900 p-4 sm:p-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 text-white border-2 border-blue-900 rounded-lg flex items-center justify-center shadow-[2px_2px_0px_#1E3A8A] shrink-0">
            <BookOpenCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-950">
              Peminjaman
            </h1>
            <p className="text-slate-500 text-xs font-semibold mt-0.5">
              {activeTab === "AKTIF"
                ? "Pantau status verifikasi, batas penjemputan, dan tenggat pengembalian arsip Anda."
                : "Lihat rekam jejak transaksi arsip yang sudah selesai, dikembalikan, atau dibatalkan."}
            </p>
          </div>
        </div>

        <Badge variant="outline" className="w-fit self-start sm:self-auto font-black">
          {activeTab === "AKTIF"
            ? tickets.length === 0
              ? "Tidak Ada Antrean"
              : `${tickets.length} Peminjaman Aktif`
            : history.historyData.length === 0
            ? "Belum Ada Riwayat"
            : `${history.historyData.length} Riwayat Selesai`}
        </Badge>
      </div>

      {/* 2. Tab Navigation */}
      <div className="flex items-center gap-2 px-4 sm:px-0 border-b-2 border-blue-900 pb-0">
        <button
          type="button"
          onClick={() => switchTab("AKTIF")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-black border-2 border-b-0 rounded-t-lg transition-all cursor-pointer -mb-0.5 relative",
            activeTab === "AKTIF"
              ? "bg-amber-400 text-blue-950 border-blue-900 shadow-[2px_-2px_0px_#1E3A8A]"
              : "bg-white text-slate-500 border-transparent hover:border-blue-900 hover:text-blue-900"
          )}
        >
          <BookOpenCheck className="w-4 h-4" />
          Aktif
          {tickets.length > 0 && (
            <span className="bg-blue-950 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
              {tickets.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => switchTab("RIWAYAT")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-black border-2 border-b-0 rounded-t-lg transition-all cursor-pointer -mb-0.5 relative",
            activeTab === "RIWAYAT"
              ? "bg-amber-400 text-blue-952 border-blue-900 shadow-[2px_-2px_0px_#1E3A8A]"
              : "bg-white text-slate-500 border-transparent hover:border-blue-900 hover:text-blue-900"
          )}
        >
          <History className="w-4 h-4" />
          Riwayat
          {unpaidFinesCount > 0 && (
            <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
              {unpaidFinesCount}
            </span>
          )}
        </button>
      </div>

      {/* 3A. Tab Aktif: Daftar Peminjaman */}
      {activeTab === "AKTIF" && (
        <div className="flex flex-col min-h-[300px] px-4 sm:px-0">
          {isLoadingBorrowing ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
              <p className="text-xs font-bold text-slate-500">
                Memuat data transaksi aktif...
              </p>
            </div>
          ) : tickets.length > 0 ? (
            <div className="flex flex-col gap-3">
              {tickets.map((ticket) => (
                <ActiveBorrowingCard
                  key={ticket.id}
                  ticket={ticket}
                  onClick={() => openDetail(ticket)}
                />
              ))}
            </div>
          ) : (
            <EmptyBorrowingState />
          )}
        </div>
      )}

      {/* 3B. Tab Riwayat: Filter + Daftar Riwayat */}
      {activeTab === "RIWAYAT" && (
        <>
          {/* Filter Tabs Riwayat */}
          <div className="flex flex-wrap items-center gap-2 px-4 sm:px-0">
            <button
              type="button"
              onClick={() => setActiveFilter("ALL")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg border-2 text-xs font-bold transition-all cursor-pointer",
                activeFilter === "ALL"
                  ? "bg-blue-950 text-white border-blue-950 shadow-[2px_2px_0px_#1E3A8A]"
                  : "bg-white text-slate-700 border-slate-300 hover:border-blue-900"
              )}
            >
              Semua ({history.historyData.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("UNPAID_FINE")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg border-2 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                activeFilter === "UNPAID_FINE"
                  ? "bg-rose-600 text-white border-rose-700 shadow-[2px_2px_0px_#991B1B]"
                  : unpaidFinesCount > 0
                  ? "bg-rose-50 text-rose-800 border-rose-400 hover:bg-rose-100"
                  : "bg-white text-slate-700 border-slate-300 hover:border-blue-900"
              )}
            >
              <span>Menunggak Denda</span>
              <span
                className={cn(
                  "px-1.5 rounded-full text-[10px] font-black",
                  activeFilter === "UNPAID_FINE"
                    ? "bg-white text-rose-700"
                    : "bg-rose-600 text-white"
                )}
              >
                {unpaidFinesCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("PAID_OR_CLEAN")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg border-2 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                activeFilter === "PAID_OR_CLEAN"
                  ? "bg-emerald-700 text-white border-emerald-800 shadow-[2px_2px_0px_#065F46]"
                  : "bg-white text-slate-700 border-slate-300 hover:border-blue-900"
              )}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Bebas Denda ({paidOrCleanCount})</span>
            </button>
          </div>

          {/* Daftar Riwayat */}
          <div className="flex flex-col min-h-[350px] px-4 sm:px-0">
            {isLoadingHistory ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
                <p className="text-xs font-bold text-slate-500">
                  Memuat riwayat peminjaman...
                </p>
              </div>
            ) : filteredHistory.length > 0 ? (
              <div className="flex flex-col gap-3">
                {filteredHistory.map((item) => (
                  <HistoryCardRow
                    key={item.id}
                    item={item}
                    onClick={() => openHistoryDetail(item)}
                  />
                ))}
              </div>
            ) : (
              <HistoryEmptyState />
            )}
          </div>
        </>
      )}

      {/* 4. Modals Peminjaman Aktif */}
      <ActiveBorrowingDetailModal
        isOpen={isDetailOpen}
        onClose={closeBorrowingDetail}
        ticket={selectedTicket}
        onCancelClick={setCancelTicketTarget}
        onContactAdmin={handleBorrowingContactWa}
      />
      <CancelBorrowingDialog
        ticket={cancelTicketTarget}
        isOpen={cancelTicketTarget !== null}
        onClose={() => setCancelTicketTarget(null)}
        onConfirm={confirmCancel}
        isPending={isCancelling}
      />

      {/* 5. Modal Detail Riwayat */}
      <HistoryDetailModal
        isOpen={isDialogOpen}
        onClose={closeHistoryDetail}
        item={selectedItem}
        onContactAdmin={handleHistoryContactWa}
      />
    </div>
  );
}

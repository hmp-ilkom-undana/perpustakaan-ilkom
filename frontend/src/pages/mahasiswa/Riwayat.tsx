import { History, Loader2, AlertTriangle, Phone, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStudentHistory } from "@/hooks/useStudentHistory";
import {
  HistoryCardRow,
  HistoryDetailModal,
  HistoryEmptyState,
} from "@/components/riwayat";
import { cn } from "@/lib/utils";

export default function Riwayat() {
  const {
    historyData,
    filteredHistory,
    isLoading,
    selectedItem,
    isDialogOpen,
    activeFilter,
    setActiveFilter,
    unpaidFinesCount,
    totalUnpaidFineAmount,
    paidOrCleanCount,
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

      {/* 2. Top Alert Banner Jika Ada Denda Menunggak */}
      {unpaidFinesCount > 0 && (
        <div className="mx-4 sm:mx-0 p-4 bg-rose-50 border-2 border-rose-600 rounded-xl shadow-[4px_4px_0px_#E11D48] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0 border border-rose-700 shadow-[1px_1px_0px_#991B1B]">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-rose-950">
                Perhatian: Terdapat {unpaidFinesCount} Tagihan Denda Belum Lunas
              </h4>
              <p className="text-xs font-semibold mt-0.5 text-rose-900">
                Total tunggakan denda Anda sebesar{" "}
                <strong className="font-mono font-black text-rose-700">
                  Rp {totalUnpaidFineAmount.toLocaleString("id-ID")}
                </strong>
                . Harap segera melunasi di kasir atau konfirmasi ke petugas.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="success"
            size="sm"
            onClick={() => handleContactAdminWa(null)}
            className="font-bold text-xs shrink-0 self-start sm:self-auto"
          >
            <Phone className="w-3.5 h-3.5 mr-1.5" />
            Konfirmasi Pembayaran
          </Button>
        </div>
      )}

      {/* 3. Quick Filter Tabs */}
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
          Semua ({historyData.length})
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
              "px-1.5 py-0.2 rounded-full text-[10px] font-black",
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
          <span>Selesai / Bebas Denda ({paidOrCleanCount})</span>
        </button>
      </div>

      {/* 4. Content List Section */}
      <div className="flex flex-col min-h-[350px] px-4 sm:px-0">
        {isLoading ? (
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
                onClick={() => openDetail(item)}
              />
            ))}
          </div>
        ) : (
          <HistoryEmptyState />
        )}
      </div>

      {/* 5. Modal Dialog Detail Riwayat */}
      <HistoryDetailModal
        isOpen={isDialogOpen}
        onClose={closeDetail}
        item={selectedItem}
        onContactAdmin={handleContactAdminWa}
      />
    </div>
  );
}

import { Receipt, Loader2 } from "lucide-react";
import type { FineItem } from "@/services/fine.service";
import { FineCard } from "./FineCard";

interface FineListProps {
  fines: FineItem[];
  isLoading: boolean;
  searchQuery: string;
  activeTab: "UNPAID" | "PAID";
  onPay: (item: FineItem) => void;
}

export function FineList({
  fines,
  isLoading,
  searchQuery,
  activeTab,
  onPay,
}: FineListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] flex flex-col md:flex-row md:items-center justify-between gap-5 animate-pulse"
          >
            <div className="space-y-3 flex-1">
              <div className="flex gap-2">
                <div className="h-5 w-40 bg-slate-200 rounded" />
                <div className="h-5 w-24 bg-slate-200 rounded" />
              </div>
              <div className="h-4 w-28 bg-slate-200 rounded" />
              <div className="h-4 w-3/4 bg-slate-200 rounded" />
            </div>
            <div className="flex md:flex-col items-center md:items-end gap-2">
              <div className="h-8 w-28 bg-slate-200 rounded" />
              <div className="h-10 w-32 bg-slate-300 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (fines.length === 0) {
    return (
      <div className="bg-white rounded-xl border-2 border-dashed border-blue-900/60 p-12 text-center flex flex-col items-center justify-center gap-3 shadow-[2px_2px_0px_#1E3A8A]">
        <div className="w-14 h-14 bg-slate-100 border-2 border-blue-900 rounded-full flex items-center justify-center shadow-[2px_2px_0px_#1E3A8A]">
          <Receipt className="w-7 h-7 text-slate-400" />
        </div>
        <div className="space-y-1">
          <p className="text-blue-950 font-black text-base">
            {searchQuery
              ? "Tidak Ada Tagihan Ditemukan"
              : activeTab === "UNPAID"
              ? "Tidak Ada Tagihan Belum Lunas"
              : "Belum Ada Riwayat Pelunasan"}
          </p>
          <p className="text-slate-500 font-semibold text-xs max-w-sm">
            {searchQuery
              ? `Tidak ada transaksi yang cocok dengan kata kunci "${searchQuery}". Coba gunakan kata kunci lain.`
              : activeTab === "UNPAID"
              ? "Seluruh tagihan denda sirkulasi telah diselesaikan secara tertib. Bersih! 🎉"
              : "Daftar riwayat pembayaran denda yang telah diselesaikan kasir akan muncul di sini."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {fines.map((item) => (
        <FineCard key={item.id} item={item} onPay={onPay} />
      ))}
    </div>
  );
}

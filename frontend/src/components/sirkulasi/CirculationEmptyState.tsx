import { Inbox, SearchX } from "lucide-react";

interface CirculationEmptyStateProps {
  isSearchEmpty?: boolean;
  message?: string;
}

export function CirculationEmptyState({
  isSearchEmpty = false,
  message,
}: CirculationEmptyStateProps) {
  if (isSearchEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-blue-900/30 rounded-xl bg-white/60">
        <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-blue-900/40 flex items-center justify-center text-slate-400 mb-3">
          <SearchX className="w-6 h-6" />
        </div>
        <p className="font-heading font-bold text-sm text-blue-950">
          Tidak Ada Hasil
        </p>
        <p className="text-xs font-semibold text-slate-500 max-w-xs mt-1">
          {message || "Coba periksa kembali kata kunci kode, nama, atau NIM yang dimasukkan."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
      <Inbox className="w-8 h-8 text-slate-300 mb-2" />
      <p className="text-xs font-bold text-slate-400">
        {message || "Tidak ada transaksi pada tahap ini."}
      </p>
    </div>
  );
}

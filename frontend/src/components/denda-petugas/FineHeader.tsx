import { Coins } from "lucide-react";

export function FineHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-blue-900 pb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-500 text-white border-2 border-blue-900 rounded-lg flex items-center justify-center shadow-[2px_2px_0px_#1E3A8A] shrink-0">
          <Coins className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-950 uppercase">
            Kasir & Kelola Denda
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Pencatatan sanksi denda, status blokir peminjam, dan verifikasi pelunasan arsip.
          </p>
        </div>
      </div>
    </div>
  );
}

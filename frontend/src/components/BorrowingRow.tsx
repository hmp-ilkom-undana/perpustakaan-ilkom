import { ChevronRight } from "lucide-react";
// Sesuaikan import tipe status Anda jika perlu
import { BorrowingStatus } from "./TicketProgress"; 

export interface BorrowingRowProps {
  id: string;
  pickupCode: string;
  archiveTitle: string;
  archiveType: string;
  status: BorrowingStatus;
  requestDate: string;
  onClick?: () => void;
}

export function BorrowingRow({
  pickupCode,
  archiveTitle,
  archiveType,
  status,
  requestDate,
  onClick,
}: BorrowingRowProps) {
  
  // Helper untuk menentukan warna Badge
  const getBadgeStyle = (currentStatus: string) => {
    switch (currentStatus) {
      case "REQUESTED":
        return "bg-slate-100 text-slate-600 border border-slate-300 shadow-[1px_1px_0px_#94a3b8]";
      case "WAITING_PICKUP":
        return "bg-amber-100 text-amber-700 border border-amber-500/30 shadow-[1px_1px_0px_#d97706]";
      case "BORROWED":
        return "bg-emerald-50 text-emerald-700 border border-emerald-600/30 shadow-[1px_1px_0px_#059669]";
      case "OVERDUE":
        return "bg-rose-50 text-rose-700 border border-rose-600/30 shadow-[1px_1px_0px_#e11d48]";
      default:
        return "bg-slate-100 text-slate-600 border border-slate-300";
    }
  };

  const getStatusLabel = (currentStatus: string) => {
    switch (currentStatus) {
      case "REQUESTED":
        return "Menunggu ACC";
      case "WAITING_PICKUP":
        return "Siap Diambil";
      case "BORROWED":
        return "Dipinjam";
      case "OVERDUE":
        return "Terlambat";
      default:
        return currentStatus;
    }
  };

  return (
    <div
      onClick={onClick}
      // "group" class adalah kunci untuk micro-interactions pada elemen anak
      className="group flex cursor-pointer items-center justify-between bg-white p-4 transition-all hover:bg-slate-50 sm:px-6"
    >
      {/* BAGIAN KIRI: Informasi Teks */}
      <div className="flex flex-col overflow-hidden pr-4">
        <h4 className="truncate text-sm font-semibold text-slate-900 mb-1">
          {archiveTitle}
        </h4>
        <div className="flex items-center gap-2">
          <span className="truncate text-xs text-slate-500">
            {archiveType}
          </span>
          <span className="text-[10px] text-slate-300">&bull;</span>
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getBadgeStyle(status)}`}
          >
            {getStatusLabel(status)}
          </span>
        </div>
      </div>

      {/* BAGIAN KANAN: Tanggal, Pickup Code, & Chevron */}
      <div className="flex shrink-0 items-center gap-4 pl-4">
        
        {/* Meta Info: Selalu tampil di semua layar */}
        <div className="flex flex-col items-end">
          <span className="font-mono text-[10px] sm:text-xs font-bold tracking-widest text-blue-900">
            {pickupCode}
          </span>
          <span className="text-[9px] sm:text-[10px] text-slate-400">
            {requestDate}
          </span>
        </div>

        {/* Ikon Panah (Chevron): Animasi geser ke kanan saat baris di-hover */}
        <div className="text-slate-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-orange-500">
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

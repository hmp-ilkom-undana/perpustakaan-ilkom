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
  
  // Helper untuk menentukan warna indikator titik (Color Dot)
  const getDotColor = (currentStatus: string) => {
    switch (currentStatus) {
      case "REQUESTED":
        return "bg-amber-500";
      case "WAITING_PICKUP":
        return "bg-blue-500";
      case "BORROWED":
        return "bg-emerald-500";
      case "OVERDUE":
        return "bg-rose-500";
      default:
        return "bg-slate-300";
    }
  };

  return (
    <div
      onClick={onClick}
      // "group" class adalah kunci untuk micro-interactions pada elemen anak
      className="group flex cursor-pointer items-center justify-between border-b border-slate-100 bg-white p-4 transition-colors hover:bg-slate-50 sm:px-6"
    >
      {/* BAGIAN KIRI: Indikator Titik & Informasi Teks */}
      <div className="flex items-center gap-4 overflow-hidden">
        
        {/* Status Dot */}
        <div className="flex h-5 w-5 shrink-0 items-center justify-center">
          <div className={`h-2.5 w-2.5 rounded-full ${getDotColor(status)}`} />
        </div>

        {/* Teks Info */}
        <div className="flex flex-col overflow-hidden">
          <h4 className="truncate text-sm font-semibold text-slate-900">
            {archiveTitle}
          </h4>
          <span className="truncate text-xs text-slate-500">
            {archiveType}
          </span>
        </div>
      </div>

      {/* BAGIAN KANAN: Tanggal, Pickup Code, & Chevron */}
      <div className="flex shrink-0 items-center gap-4 pl-4">
        
        {/* Meta Info: Disembunyikan di layar sangat kecil agar tidak sempit */}
        <div className="hidden flex-col items-end sm:flex">
          <span className="font-mono text-xs font-medium tracking-widest text-slate-700">
            {pickupCode}
          </span>
          <span className="text-[10px] text-slate-400">
            {requestDate}
          </span>
        </div>

        {/* Ikon Panah (Chevron): Animasi geser ke kanan saat baris di-hover */}
        <div className="text-slate-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-slate-600">
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

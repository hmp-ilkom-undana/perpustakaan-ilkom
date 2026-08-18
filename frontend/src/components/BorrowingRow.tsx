import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  let badgeVariant: "amber" | "emerald" | "rose" | "secondary" = "secondary";
  let statusLabel = "Menunggu ACC";

  switch (status) {
    case "REQUESTED":
      badgeVariant = "secondary";
      statusLabel = "Menunggu ACC";
      break;
    case "WAITING_PICKUP":
      badgeVariant = "amber";
      statusLabel = "Siap Diambil";
      break;
    case "BORROWED":
      badgeVariant = "emerald";
      statusLabel = "Dipinjam";
      break;
    case "OVERDUE":
      badgeVariant = "rose";
      statusLabel = "Terlambat";
      break;
  }

  return (
    <div
      onClick={onClick}
      className="group flex cursor-pointer items-center justify-between bg-white p-4 transition-all hover:bg-orange-50/50 sm:px-6"
    >
      {/* BAGIAN KIRI: Informasi Teks */}
      <div className="flex flex-col overflow-hidden pr-4">
        <h4 className="truncate text-sm font-black text-blue-950 group-hover:text-orange-600 transition-colors mb-1">
          {archiveTitle}
        </h4>
        <div className="flex items-center gap-2">
          <span className="truncate text-xs font-semibold text-slate-500">
            {archiveType}
          </span>
          <span className="text-[10px] text-slate-300">&bull;</span>
          <Badge variant={badgeVariant}>
            {statusLabel}
          </Badge>
        </div>
      </div>

      {/* BAGIAN KANAN: Tanggal, Pickup Code, & Chevron */}
      <div className="flex shrink-0 items-center gap-4 pl-4">
        <div className="flex flex-col items-end">
          <span className="font-mono text-xs sm:text-sm font-black tracking-widest text-blue-950">
            {pickupCode}
          </span>
          <span className="text-[10px] font-semibold text-slate-500">
            {requestDate}
          </span>
        </div>

        <div className="text-slate-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-orange-500">
          <ChevronRight className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// 1. Definisikan tipe status
export type BorrowingStatus =
  | "REQUESTED"
  | "WAITING_PICKUP"
  | "BORROWED"
  | "OVERDUE";

// 2. Interface untuk props tiket digital kita
export interface ActiveTicketProps {
  id: string;
  pickupCode: string; // contoh: REQ-8192
  archiveTitle: string;
  archiveType: string;
  status: BorrowingStatus;
  requestDate: string;
  dueDate?: string;
  onCancelClick?: (id: string) => void; // Fungsi yang dipanggil saat tombol Batal ditekan
}

// Helper untuk menentukan warna dan teks badge berdasarkan status
const getStatusConfig = (status: BorrowingStatus) => {
  switch (status) {
    case "REQUESTED":
      return {
        label: "Menunggu Konfirmasi",
        className: "bg-yellow-50 text-yellow-700 border-yellow-200",
      };
    case "WAITING_PICKUP":
      return {
        label: "Siap Diambil",
        className: "bg-blue-50 text-blue-700 border-blue-200",
      };
    case "BORROWED":
      return {
        label: "Sedang Dipinjam",
        className: "bg-green-50 text-green-700 border-green-200",
      };
    case "OVERDUE":
      return {
        label: "Terlambat (Denda)",
        className: "bg-red-50 text-red-700 border-red-200",
      };
    default:
      return {
        label: status,
        className: "bg-slate-50 text-slate-700 border-slate-200",
      };
  }
};

export function ActiveTicketCard({
  id,
  pickupCode,
  archiveTitle,
  archiveType,
  status,
  requestDate,
  dueDate,
  onCancelClick,
}: ActiveTicketProps) {
  const canCancel = status === "REQUESTED" || status === "WAITING_PICKUP";

  return (
    <Card className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/*  BAGIAN ATAS: Informasi Utama (Pickup Code & Title) */}
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Pickup Code
            </span>
            <span className="font-mono text-2xl font-bold tracking-tight text-slate-900">
              {pickupCode}
            </span>
          </div>
          {/* TODO: Tempat untuk Badge Status */}
          <Badge
            variant="outline"
            className={getStatusConfig(status).className}
          >
            {getStatusConfig(status).label}
          </Badge>
        </div>

        <div className="flex flex-col">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-slate-800">
            {archiveTitle}
          </h3>
          <span className="mt-1 text-sm text-slate-500">{archiveType}</span>
        </div>
      </div>

      {/*  BAGIAN BAWAH: Aksi & Info Tambahan */}
      <div className="mt-auto flex items-center justify-between border-t border-dashed border-slate-200 bg-slate-50/50 p-5">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500">Tanggal Pengajuan</span>
          <span className="text-sm font-medium text-slate-700">
            {requestDate}
          </span>
        </div>

        {/* TODO: Tombol Batal hanya muncul untuk status REQUESTED / WAITING_PICKUP */}
        {canCancel ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onCancelClick?.(id)}
          >
            Batal Antre
          </Button>
        ) : (
          <div className="flex flex-col text-right">
            <span className="text-xs text-slate-500">Batas Pengembalian</span>
            <span
              className={`text-sm font-medium ${status === "OVERDUE" ? "text-red-600 font-bold" : "text-slate-700"}`}
            >
              {dueDate || "-"}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}

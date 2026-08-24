import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { BorrowingStatus } from "./TicketProgress";

interface BorrowingTimelineProps {
  status: BorrowingStatus;
  requestDate: string;
  accDate?: string;
  pickupDeadline?: string;
  dueDate?: string;
}

export function BorrowingTimeline({
  status,
  requestDate,
  accDate,
  pickupDeadline,
  dueDate,
}: BorrowingTimelineProps) {
  return (
    <div className="hidden sm:block rounded-lg border-2 border-blue-900 bg-white p-5 shadow-[3px_3px_0px_#1E3A8A]">
      <h4 className="mb-4 text-xs font-black uppercase tracking-wider text-blue-950">
        Rincian Garis Waktu
      </h4>
      <div className="flex flex-col gap-3 text-xs">
        {/* 1. Waktu Pengajuan */}
        <div className="flex items-center justify-between border-b-2 border-blue-900/20 pb-2.5">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-semibold text-slate-700">Waktu Pengajuan</span>
          </div>
          <span className="font-black text-blue-950">{requestDate}</span>
        </div>

        {/* 2. Disetujui Petugas */}
        {(status === "WAITING_PICKUP" ||
          status === "BORROWED" ||
          status === "OVERDUE") && (
          <div className="flex items-center justify-between border-b-2 border-blue-900/20 pb-2.5">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-slate-700">Disetujui Petugas</span>
            </div>
            <span className="font-black text-blue-950">{accDate || "-"}</span>
          </div>
        )}

        {/* 3. Batas Pengambilan di HMP */}
        {status === "WAITING_PICKUP" && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
              <span className="font-semibold text-amber-900">Batas Pengambilan di HMP</span>
            </div>
            <span className="font-black text-amber-700">
              {pickupDeadline || "Segera"}
            </span>
          </div>
        )}

        {/* 4. Tenggat Pengembalian */}
        {(status === "BORROWED" || status === "OVERDUE") && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-orange-500 shrink-0" />
              <span className="font-semibold text-slate-700">Tenggat Pengembalian</span>
            </div>
            <span
              className={`font-black ${
                status === "OVERDUE" ? "text-rose-600" : "text-orange-600"
              }`}
            >
              {dueDate || "Belum ditentukan"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

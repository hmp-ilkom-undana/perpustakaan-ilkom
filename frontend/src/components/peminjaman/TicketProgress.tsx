import { FileText, Package, Clock } from "lucide-react";

export type BorrowingStatus =
  | "REQUESTED"
  | "WAITING_PICKUP"
  | "BORROWED"
  | "OVERDUE";

export interface ActiveTicketProps {
  id: string;
  pickupCode: string;
  archiveTitle: string;
  archiveType: string;
  status: BorrowingStatus;
  requestDate: string;
  dueDate?: string;
  accDate?: string;
  pickupDeadline?: string;
  onCancelClick?: (id: string) => void;
}

export function TicketProgress({
  currentStatus,
  requestDate,
  dueDate,
  accDate,
  pickupDeadline,
}: {
  currentStatus: BorrowingStatus;
  requestDate: string;
  dueDate?: string;
  accDate?: string;
  pickupDeadline?: string;
}) {
  const steps = [
    { id: "REQUESTED", label: "Diajukan Pada", desktopLabel: "Diajukan", desc: "Menunggu ACC", Icon: FileText },
    { id: "WAITING_PICKUP", label: "Di-ACC Petugas", desktopLabel: "Siap Diambil", desc: "Di ruangan HMP", Icon: Package },
    { id: "BORROWED", label: "Tenggat Pengembalian", desktopLabel: "Dipinjam", desc: "Sedang dibawa", Icon: Clock }, 
  ];

  const currentIndex = steps.findIndex(
    (s) => s.id === (currentStatus === "OVERDUE" ? "BORROWED" : currentStatus),
  );

  return (
    <div className="flex flex-col sm:flex-row w-full items-start sm:justify-between py-2 sm:pt-2 sm:pb-1">
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isPast = index < currentIndex;
        const isOverdue = isActive && currentStatus === "OVERDUE";
        const isLast = index === steps.length - 1;
        const Icon = step.Icon;

        let dateText = null;
        if (step.id === "REQUESTED") {
          dateText = requestDate;
        } else if (step.id === "WAITING_PICKUP" && (isActive || isPast)) {
          dateText = accDate || "Telah Disetujui";
        } else if (step.id === "BORROWED" && (isActive || isPast)) {
          dateText = dueDate || "Belum ditentukan";
        }

        let warningText = null;
        if (step.id === "WAITING_PICKUP" && isActive) {
           warningText = `Batas Ambil: ${pickupDeadline || "Segera"}`;
        }

        return (
          <div
            key={step.id}
            className="relative flex flex-row sm:flex-col sm:flex-1 min-h-[4.5rem] sm:min-h-0 items-start sm:items-center text-left sm:text-center"
          >
            {/* Garis Penghubung (Vertikal di Mobile, Horizontal di Desktop) */}
            {!isLast && (
              <div
                className={`absolute left-3.5 top-7 bottom-0 w-0.5 sm:left-[50%] sm:right-[-50%] sm:top-3.5 sm:bottom-auto sm:h-0.5 sm:w-auto sm:-translate-y-1/2 ${
                  isPast ? "bg-blue-900" : "bg-slate-300"
                }`}
              />
            )}

            {/* Titik Indikator */}
            <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center bg-white">
              {isPast ? (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-900 border-2 border-blue-950 text-white shadow-[1px_1px_0px_#1E3A8A]">
                  <Icon className="h-3.5 w-3.5" />
                </div>
              ) : isActive ? (
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 shadow-[2px_2px_0px_#1E3A8A] ${
                    isOverdue
                      ? "border-rose-600 bg-rose-500 text-white"
                      : "border-blue-900 bg-orange-500 text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-400 bg-slate-100 text-slate-400">
                  <Icon className="h-3.5 w-3.5" />
                </div>
              )}
            </div>

            {/* Konten Label & Tanggal */}
            <div className="ml-4 sm:ml-0 sm:mt-2.5 flex flex-col pb-6 sm:pb-0 px-1 w-full sm:items-center">
              <span
                className={`text-xs font-black leading-tight ${
                  isPast
                    ? "text-blue-950"
                    : isActive
                      ? isOverdue
                        ? "text-rose-600"
                        : "text-orange-600"
                      : "text-slate-500"
                }`}
              >
                <span className="sm:hidden">{step.label}</span>
                <span className="hidden sm:inline">{step.desktopLabel}</span>
              </span>
              
              {/* Deskripsi (Hanya Desktop) */}
              <span className="mt-0.5 hidden text-[10px] font-semibold text-slate-500 sm:block">
                {step.desc}
              </span>

              {/* Render date jika ada (Hanya Mobile) */}
              {dateText && (
                <span className={`mt-1 text-xs font-bold sm:hidden ${isOverdue && step.id === "BORROWED" ? "text-rose-600" : "text-slate-900"}`}>
                  {dateText}
                </span>
              )}

              {/* Render warning text jika ada (Hanya Mobile) */}
              {warningText && (
                <span className="mt-1.5 inline-flex sm:hidden w-fit items-center gap-1.5 rounded-md bg-amber-400 px-2 py-0.5 text-[10px] font-black text-blue-950 border-2 border-blue-900 shadow-[1px_1px_0px_#1E3A8A]">
                  <Package className="h-3 w-3" />
                  {warningText}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

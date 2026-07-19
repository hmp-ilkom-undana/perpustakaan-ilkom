export type BorrowingStatus =
  | "REQUESTED"
  | "WAITING_PICKUP"
  | "BORROWED"
  | "OVERDUE";

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

export function TicketProgress({
  currentStatus,
}: {
  currentStatus: BorrowingStatus;
}) {
  // Deskripsi kita buat sangat singkat agar tidak tabrakan di layar Horizontal
  const steps = [
    { id: "REQUESTED", label: "Diajukan", desc: "Menunggu ACC" },
    { id: "WAITING_PICKUP", label: "Siap Diambil", desc: "Di loket" },
    { id: "BORROWED", label: "Dipinjam", desc: "Sedang dibawa" },
    { id: "COMPLETED", label: "Selesai", desc: "Telah kembali" },
  ];

  const currentIndex = steps.findIndex(
    (s) => s.id === (currentStatus === "OVERDUE" ? "BORROWED" : currentStatus),
  );

  return (
    <div className="flex w-full items-start justify-between pt-2 pb-1">
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isPast = index < currentIndex;
        const isOverdue = isActive && currentStatus === "OVERDUE";
        const isLast = index === steps.length - 1;

        return (
          <div
            key={step.id}
            className="relative flex flex-1 flex-col items-center text-center"
          >
            {/* Garis Penghubung ke Kanan  */}
            {!isLast && (
              <div
                className={`absolute left-[50%] right-[-50%] top-2.5 h-0.5 -translate-y-1/2 ${
                  isPast ? "bg-slate-800" : "bg-slate-100"
                }`}
              />
            )}

            {/* Titik Indikator (Berada di atas garis karena z-10 dan bg-white) */}
            <div className="relative z-10 flex h-5 w-5 items-center justify-center bg-white">
              {isPast ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-white shadow-sm">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              ) : isActive ? (
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 shadow-sm ${isOverdue ? "border-rose-500 bg-rose-50" : "border-blue-600 bg-blue-50"}`}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${isOverdue ? "bg-rose-500" : "bg-blue-600"}`}
                  />
                </div>
              ) : (
                <div className="h-3 w-3 rounded-full border-2 border-slate-200 bg-white" />
              )}
            </div>

            {/* Teks Label & Deskripsi Singkat */}
            <div className="mt-3 flex flex-col items-center px-1">
              <span
                className={`text-[10px] sm:text-xs font-semibold leading-tight ${
                  isPast
                    ? "text-slate-800"
                    : isActive
                      ? isOverdue
                        ? "text-rose-600"
                        : "text-blue-700"
                      : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
              {/* Deskripsi: Sembunyikan di HP sangat kecil (hidden sm:block) agar tidak rusak */}
              <span className="mt-1 hidden text-[10px] text-slate-500 sm:block">
                {step.desc}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

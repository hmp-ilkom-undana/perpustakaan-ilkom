import { useState } from "react";
import { TicketProgress, ActiveTicketProps } from "@/components/TicketProgress";
import api from "@/lib/api";

import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  Info,
  Loader2,
} from "lucide-react";
import { BorrowingRow } from "@/components/BorrowingRow";
import { useMyBorrowingHistoryQuery } from "@/hooks/queries/useBorrowingQuery";
import { useQueryClient } from "@tanstack/react-query";
import { BORROWING_QUERY_KEY } from "@/hooks/queries/useBorrowingQuery";

export default function Peminjaman() {
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const queryClient = useQueryClient();

  const { data: rawHistory = [], isPending: isLoading } = useMyBorrowingHistoryQuery();

  const activeStatuses = ["REQUESTED", "WAITING_PICKUP", "BORROWED", "OVERDUE"];

  const tickets: ActiveTicketProps[] = rawHistory
    .filter((item: any) => activeStatuses.includes(item.status))
    .map((item: any) => ({
      id: item.id,
      pickupCode: item.pickupCode || `REQ-${item.id.substring(0, 6).toUpperCase()}`,
      archiveTitle: item.archive.title,
      archiveType: item.archive.archiveType,
      status: item.status as "REQUESTED" | "WAITING_PICKUP" | "BORROWED" | "OVERDUE",
      requestDate: new Date(item.borrowDate).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      dueDate: item.returnDate
        ? new Date(item.returnDate).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : undefined,
      accDate: item.accDate
        ? new Date(item.accDate).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : undefined,
      pickupDeadline: item.accDate
        ? (() => {
            const d = new Date(item.accDate);
            d.setDate(d.getDate() + 3);
            return (
              d.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }) + ", 16:00"
            );
          })()
        : undefined,
    }));

  const handleCancel = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin membatalkan antrean ini?")) {
      return;
    }
    
    try {
      await api.post(`/api/borrowings/${id}/cancel`);
      alert("Antrean berhasil dibatalkan!");
      queryClient.invalidateQueries({ queryKey: [BORROWING_QUERY_KEY] });
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Terjadi kesalahan sistem saat membatalkan antrean.";
      alert(`Gagal membatalkan: ${errorMsg}`);
    }
  };


  return (
    <div className="flex flex-col gap-0 sm:gap-6 pb-6 sm:p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* --- HEADER HALAMAN --- */}
      <div className="flex flex-col gap-2 p-4 sm:p-0">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-slate-900">
          <BookOpen className="h-8 w-8 text-blue-600" />
          Peminjaman Aktif
        </h1>
        <p className="text-slate-500">
          Kelola antrean pengambilan dan pantau batas waktu peminjaman Anda di
          sini.
        </p>
      </div>

      {/* --- GRID KARTU TIKET --- */}
      <div className="flex flex-col gap-4 min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Memuat data antrean...</p>
          </div>
        ) : tickets.length > 0 ? (
          tickets.map((ticket) => (
            <div key={ticket.id} className="group/card flex flex-col rounded-xl border border-blue-900/30 bg-white shadow-[2px_2px_0px_#1E3A8A] overflow-hidden transition-all hover:-translate-y-[1px] hover:-translate-x-[1px] hover:shadow-[4px_4px_0px_#1E3A8A]">
              {/* Baris List Utama */}
              <BorrowingRow
                {...ticket}
                onClick={() =>
                  setSelectedTicket(
                    selectedTicket?.id === ticket.id ? null : ticket,
                  )
                }
              />

              {/* Area Detail */}
              {selectedTicket?.id === ticket.id && (
                <div className="border-t border-blue-900/10 bg-slate-50/50 p-4 sm:p-6 animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="flex flex-col sm:gap-6">
                    {/* Info Arsip Singkat */}
                    <div className="flex flex-col gap-2 text-sm text-slate-600 bg-white/60 p-4 sm:p-3 sm:rounded-lg border-y sm:border border-slate-200/60">
                      <div className="flex items-start gap-2">
                        <BookOpen className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                        <span className="font-bold text-slate-900 leading-snug">
                          {ticket.archiveTitle}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 pl-6">
                        <Info className="h-4 w-4 text-blue-500 shrink-0" />
                        <span>
                          Tipe Arsip: <strong>{ticket.archiveType}</strong>
                        </span>
                      </div>
                    </div>

                    {/* 1. STATUS TRACKER & TIMELINE */}
                    <div className="sm:rounded-lg border-b sm:border border-blue-900/30 bg-white p-4 sm:p-5 sm:shadow-[2px_2px_0px_#1E3A8A]">
                      <TicketProgress
                        currentStatus={ticket.status}
                        requestDate={ticket.requestDate}
                        dueDate={ticket.dueDate}
                        accDate={ticket.accDate}
                        pickupDeadline={ticket.pickupDeadline}
                      />
                    </div>

                    {/* 2. DYNAMIC TIMELINE (HANYA DESKTOP) */}
                    <div className="hidden sm:block rounded-lg border border-blue-900/30 bg-white p-5 shadow-[2px_2px_0px_#1E3A8A]">
                      <h4 className="mb-5 text-xs font-bold uppercase tracking-widest text-slate-400">
                        Garis Waktu
                      </h4>
                      <div className="flex flex-col gap-4">
                        {/* Selalu Tampil: Waktu Pengajuan */}
                        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                              <CheckCircle2 className="h-4.5 w-4.5" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                              Diajukan Pada
                            </span>
                          </div>
                          <span className="text-sm font-bold text-slate-900">
                            {ticket.requestDate}
                          </span>
                        </div>

                        {/* Tampil jika sudah di-ACC */}
                        {(ticket.status === "WAITING_PICKUP" ||
                          ticket.status === "BORROWED" ||
                          ticket.status === "OVERDUE") && (
                          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                <CheckCircle2 className="h-4.5 w-4.5" />
                              </div>
                              <span className="text-sm font-medium text-slate-700">
                                Di-ACC Petugas
                              </span>
                            </div>
                            <span className="text-sm font-bold text-slate-900">
                              {ticket.accDate || "Lihat Notifikasi"}
                            </span>
                          </div>
                        )}

                        {/* Batas Pengambilan: Hanya relevan jika WAITING_PICKUP */}
                        {ticket.status === "WAITING_PICKUP" && (
                          <div className="flex items-center justify-between pb-1">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                                <AlertCircle className="h-4.5 w-4.5" />
                              </div>
                              <span className="text-sm font-medium text-slate-700">
                                Batas Pengambilan (RUANGAN HMP)
                              </span>
                            </div>
                            <span className="text-sm font-bold text-rose-600">
                              {ticket.pickupDeadline || "Segera Ambil"}
                            </span>
                          </div>
                        )}

                        {/* Tenggat Pengembalian: Relevan jika BORROWED atau OVERDUE */}
                        {(ticket.status === "BORROWED" ||
                          ticket.status === "OVERDUE") && (
                          <div className="flex items-center justify-between pb-1">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                                <Clock className="h-4.5 w-4.5" />
                              </div>
                              <span className="text-sm font-medium text-slate-700">
                                Tenggat Pengembalian
                              </span>
                            </div>
                            <span className="text-sm font-bold text-amber-600">
                              {ticket.dueDate || "Belum ditentukan"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 3. DYNAMIC BOTTOM ACTION / OVERDUE COUNTER CARD */}
                    {ticket.status === "OVERDUE" ? (
                      /* Komponen Peringatan Denda */
                      <div className="mt-0 sm:mt-2 flex flex-col justify-between sm:rounded-xl border-b sm:border border-rose-300 shadow-none sm:shadow-[2px_2px_0px_#f43f5e] bg-rose-50 p-4 sm:flex-row sm:items-center sm:p-5">
                        <div className="flex items-center gap-4">
                          {/* Ikon Alert/Jam */}
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                            <svg
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-rose-900">
                              Keterlambatan Pengembalian
                            </span>
                            <span className="text-xs font-medium text-rose-600">
                              Harap Segera Kembalikan!
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-col items-start sm:mt-0 sm:items-end">
                          <span className="text-2xl font-black tracking-tight text-rose-700">
                            Terlambat
                          </span>
                          <span className="text-[10px] font-medium uppercase tracking-wider text-rose-500/80">
                            Denda Dihitung Petugas
                          </span>
                        </div>
                      </div>
                    ) : ticket.status === "REQUESTED" ||
                      ticket.status === "WAITING_PICKUP" ? (
                      /* Tombol Pembatalan Biasa */
                      <div className="mt-0 sm:mt-2 flex justify-end border-b sm:border-t border-slate-100 bg-white sm:bg-transparent p-4 sm:p-0">
                        <button
                          onClick={() => handleCancel(ticket.id)}
                          className="rounded-md border border-rose-300 bg-rose-50 px-5 py-2 text-sm font-bold text-rose-600 transition-all hover:bg-rose-100 hover:text-rose-700 shadow-[2px_2px_0px_#f43f5e] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                        >
                          Batalkan Antrean
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 mb-4">
              <BookOpen className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">
              Tidak ada peminjaman aktif
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mt-2">
              Anda tidak memiliki arsip yang sedang dipinjam atau dalam proses
              antrean.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

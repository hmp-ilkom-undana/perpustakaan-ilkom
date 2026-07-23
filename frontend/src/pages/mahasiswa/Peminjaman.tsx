import { useState } from "react";
import { TicketProgress, ActiveTicketProps } from "@/components/TicketProgress";

import { BookOpen, CheckCircle2, AlertCircle, Clock, Info } from "lucide-react";
import { BorrowingRow } from "@/components/BorrowingRow";

// 1. Data Dummy
const DUMMY_TICKETS: ActiveTicketProps[] = [
  {
    id: "b-1",
    pickupCode: "REQ-8192",
    archiveTitle:
      "Analisis Sentimen Menggunakan Naive Bayes pada Ulasan E-Commerce",
    archiveType: "Skripsi",
    status: "REQUESTED",
    requestDate: "19 Juli 2026",
  },
  {
    id: "b-2",
    pickupCode: "REQ-9011",
    archiveTitle: "Rancang Bangun Sistem Informasi Perpustakaan Berbasis Web",
    archiveType: "Buku",
    status: "WAITING_PICKUP",
    requestDate: "18 Juli 2026",
  },
  {
    id: "b-3",
    pickupCode: "REQ-7721",
    archiveTitle: "Buku Ajar Pemrograman Web Lanjut",
    archiveType: "Buku",
    status: "BORROWED",
    requestDate: "15 Juli 2026",
    dueDate: "22 Juli 2026",
  },
  {
    id: "b-4",
    pickupCode: "REQ-5510",
    archiveTitle: "Penerapan Algoritma Dijkstra pada Pencarian Rute Terpendek",
    archiveType: "Skripsi",
    status: "OVERDUE",
    requestDate: "01 Juli 2026",
    dueDate: "08 Juli 2026",
  },
];

export default function Peminjaman() {
  const handleCancel = (id: string) => {
    alert(
      `Mensimulasikan pembatalan untuk ID: ${id}. Nanti akan diganti dengan API call.`,
    );
  };

  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

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
      <div className="overflow-hidden sm:rounded-xl sm:border border-slate-200 bg-white sm:shadow-sm">
        {DUMMY_TICKETS.map((ticket) => (
          <div key={ticket.id} className="flex flex-col">
            {/* Baris List Utama */}
            <BorrowingRow
              {...ticket}
              onClick={() =>
                setSelectedTicket(
                  selectedTicket?.id === ticket.id ? null : ticket,
                )
              }
            />

            {/* Area Detail (Expandable) - Clean & High Density */}
            {selectedTicket?.id === ticket.id && (
              <div className="border-b sm:border-b-0 border-slate-100 bg-slate-50/80 p-0 sm:p-6 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="flex flex-col sm:gap-6">
                  
                  {/* Info Arsip Singkat (Dipindah ke atas agar rapi) */}
                  <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/60 p-4 sm:p-3 sm:rounded-lg border-y sm:border border-slate-200/60">
                    <Info className="h-4 w-4 text-blue-500 shrink-0" />
                    <span className="truncate">Penulis: <strong>Budi Santoso</strong> &bull; Tahun: <strong>2023</strong></span>
                  </div>

                  {/* 1. STATUS TRACKER & TIMELINE */}
                  <div className="sm:rounded-lg border-b sm:border border-slate-200 bg-white p-4 sm:p-5 sm:shadow-sm">
                    <TicketProgress 
                      currentStatus={ticket.status} 
                      requestDate={ticket.requestDate}
                      dueDate={ticket.dueDate}
                    />
                  </div>

                  {/* 2. DYNAMIC TIMELINE (Pengganti Grid) - HANYA DESKTOP */}
                  <div className="hidden sm:block rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
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
                          <span className="text-sm font-medium text-slate-700">Diajukan Pada</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">{ticket.requestDate}</span>
                      </div>

                      {/* Tampil jika sudah di-ACC */}
                      {(ticket.status === "WAITING_PICKUP" || ticket.status === "BORROWED" || ticket.status === "OVERDUE") && (
                        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                              <CheckCircle2 className="h-4.5 w-4.5" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">Di-ACC Petugas</span>
                          </div>
                          <span className="text-sm font-bold text-slate-900">20 Jul 2026</span>
                        </div>
                      )}

                      {/* Batas Pengambilan: Hanya relevan jika WAITING_PICKUP */}
                      {ticket.status === "WAITING_PICKUP" && (
                        <div className="flex items-center justify-between pb-1">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                              <AlertCircle className="h-4.5 w-4.5" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">Batas Pengambilan (RUANGAN HMP)</span>
                          </div>
                          <span className="text-sm font-bold text-rose-600">22 Jul 2026, 16:00</span>
                        </div>
                      )}

                      {/* Tenggat Pengembalian: Relevan jika BORROWED atau OVERDUE */}
                      {(ticket.status === "BORROWED" || ticket.status === "OVERDUE") && (
                        <div className="flex items-center justify-between pb-1">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                              <Clock className="h-4.5 w-4.5" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">Tenggat Pengembalian</span>
                          </div>
                          <span className="text-sm font-bold text-amber-600">{ticket.dueDate}</span>
                        </div>
                      )}
                      
                    </div>
                  </div>

                  {/* 3. DYNAMIC BOTTOM ACTION / OVERDUE COUNTER CARD */}
                  {ticket.status === "OVERDUE" ? (
                    /* Komponen Peringatan Denda */
                    <div className="mt-0 sm:mt-2 flex flex-col justify-between sm:rounded-xl border-b sm:border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center sm:p-5">
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
                            Terlambat 11 Hari
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col items-start sm:mt-0 sm:items-end">
                        <span className="text-2xl font-black tracking-tight text-rose-700">
                          Rp 55.000
                        </span>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-rose-500/80">
                          Tarif Denda: Rp 5.000 / Hari
                        </span>
                      </div>
                    </div>
                  ) : ticket.status === "REQUESTED" ||
                    ticket.status === "WAITING_PICKUP" ? (
                    /* Tombol Pembatalan Biasa */
                    <div className="mt-0 sm:mt-2 flex justify-end border-b sm:border-t border-slate-100 bg-white sm:bg-transparent p-4 sm:p-0">
                      <button
                        onClick={() => alert(`Membatalkan ID: ${ticket.id}`)}
                        className="rounded-md border border-rose-200 bg-rose-50 px-5 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100 hover:text-rose-700"
                      >
                        Batalkan Antrean
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

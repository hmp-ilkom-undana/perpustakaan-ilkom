import { useState } from "react";
import {
  TicketProgress,
  ActiveTicketProps,
} from "@/components/TicketProgress";

import { BookOpen } from "lucide-react";
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
    <div className="flex flex-col gap-6 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* --- HEADER HALAMAN --- */}
      <div className="flex flex-col gap-2">
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
      {/* 
          Grid CSS: 1 kolom di HP, 2 kolom di tablet (md), 3 kolom di layar besar (lg).
      */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {DUMMY_TICKETS.map((ticket) => (
          <div key={ticket.id} className="flex flex-col">
            {/* Baris List Utama */}
            <BorrowingRow
              {...ticket}
              // Logika toggle: Jika baris yang sama diklik lagi, tutup detailnya (null)
              onClick={() =>
                setSelectedTicket(
                  selectedTicket?.id === ticket.id ? null : ticket,
                )
              }
            />

            {/* Area Detail (Expandable) - Mode Compact & Informatif */}
            {selectedTicket?.id === ticket.id && (
              <div className="border-b border-slate-100 bg-slate-50 p-4 sm:p-6 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="flex flex-col gap-5">
                  {/* 1. STATUS TRACKER (Horizontal Ringkas) */}
                  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <TicketProgress currentStatus={ticket.status} />
                  </div>

                  {/* 2. INFO UTAMA & PICKUP CODE */}
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    {/* Judul & Kategori */}
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {ticket.archiveType}
                      </span>
                      <h3 className="text-sm font-bold leading-snug text-slate-900 sm:text-base">
                        {ticket.archiveTitle}
                      </h3>
                    </div>

                    {/* Kode Pickup (Compact Badge) */}
                    <div className="flex shrink-0 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-sm">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Code:
                      </span>
                      <span className="font-mono text-lg font-black tracking-wider text-slate-900">
                        {ticket.pickupCode}
                      </span>
                    </div>
                  </div>

                  {/* 3. TOMBOL AKSI */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => alert(`Membatalkan ID: ${ticket.id}`)}
                      className="rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100 hover:text-rose-700"
                    >
                      Batalkan Antrean
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import { TicketProgress, ActiveTicketProps } from "@/components/TicketProgress";
import api from "@/lib/api";
import { toast } from "sonner";

import {
  BookOpenCheck,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  Info,
  Loader2,
  AlertTriangle,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BorrowingRow } from "@/components/BorrowingRow";
import { useMyBorrowingHistoryQuery } from "@/hooks/queries/useBorrowingQuery";
import { useSystemSettingQuery } from "@/hooks/queries/useSettingQuery";
import { authClient } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { BORROWING_QUERY_KEY } from "@/hooks/queries/useBorrowingQuery";

export interface ExtendedTicketProps extends ActiveTicketProps {
  fineAmount?: number;
}

export default function Peminjaman() {
  const { data: session } = authClient.useSession();
  const { data: setting } = useSystemSettingQuery();
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const queryClient = useQueryClient();

  const { data: rawHistory = [], isPending: isLoading } = useMyBorrowingHistoryQuery();

  const activeStatuses = ["REQUESTED", "WAITING_PICKUP", "BORROWED", "OVERDUE"];

  const tickets: ExtendedTicketProps[] = rawHistory
    .filter((item: any) => activeStatuses.includes(item.status))
    .map((item: any) => ({
      id: item.id,
      pickupCode: item.pickupCode || `REQ-${item.id.substring(0, 6).toUpperCase()}`,
      archiveTitle: item.archive.title,
      archiveType: item.archive.archiveType,
      status: item.status as "REQUESTED" | "WAITING_PICKUP" | "BORROWED" | "OVERDUE",
      fineAmount: item.fineAmount || 0,
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

  const handleContactAdminWa = (ticket: ExtendedTicketProps) => {
    const rawNumber = setting?.adminWaNumber || "082339113591";
    const cleanNumber = rawNumber.replace(/\D/g, "");
    const formattedNumber = cleanNumber.startsWith("0") ? "62" + cleanNumber.slice(1) : cleanNumber;
    const studentName = session?.user?.name || "Mahasiswa";
    const studentNim = (session?.user as any)?.nim || "-";
    const archiveType = ticket.archiveType || "Arsip";

    const text = encodeURIComponent(
      `Halo ${setting?.adminContactName || "Admin Perpustakaan ILKOM"},\n\nSaya ingin konfirmasi pembayaran denda peminjaman:\n- Nama: ${studentName}\n- NIM: ${studentNim}\n- Judul ${archiveType}: ${ticket.archiveTitle}\n- Total Denda: Rp ${(ticket.fineAmount || 0).toLocaleString("id-ID")}\n\nMohon informasi petunjuk pembayarannya. Terima kasih.`
    );

    window.open(`https://wa.me/${formattedNumber}?text=${text}`, "_blank");
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin membatalkan antrean ini?")) {
      return;
    }
    
    try {
      await api.post(`/api/borrowings/${id}/cancel`);
      toast.success("Antrean Berhasil Dibatalkan", {
        description: "Status pengajuan Anda telah diubah menjadi CANCELLED.",
      });
      queryClient.invalidateQueries({ queryKey: [BORROWING_QUERY_KEY] });
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Terjadi kesalahan sistem saat membatalkan antrean.";
      toast.error("Gagal Membatalkan", {
        description: errorMsg,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-blue-900 p-4 sm:p-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 text-white border-2 border-blue-900 rounded-lg flex items-center justify-center shadow-[2px_2px_0px_#1E3A8A] shrink-0">
            <BookOpenCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-950">
              Peminjaman Aktif
            </h1>
            <p className="text-slate-500 text-xs font-semibold mt-0.5">
              Pantau status verifikasi, batas penjemputan, dan tenggat pengembalian arsip Anda.
            </p>
          </div>
        </div>

        <Badge variant="outline" className="w-fit self-start sm:self-auto">
          {tickets.length} Berkas Aktif
        </Badge>
      </div>

      {/* TICKET LIST / DETAIL AREA */}
      <div className="flex flex-col gap-4 min-h-[300px] px-4 sm:px-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
            <p className="text-xs font-bold text-slate-500">Memuat data transaksi aktif...</p>
          </div>
        ) : tickets.length > 0 ? (
          tickets.map((ticket) => (
            <Card key={ticket.id} className="overflow-hidden">
              {/* Header Baris Utama */}
              <BorrowingRow
                {...ticket}
                onClick={() =>
                  setSelectedTicket(
                    selectedTicket?.id === ticket.id ? null : ticket,
                  )
                }
              />

              {/* Area Detail yang Terbuka */}
              {selectedTicket?.id === ticket.id && (
                <div className="border-t-2 border-blue-900 bg-slate-50 p-4 sm:p-6 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
                  {/* Info Dokumen */}
                  <div className="bg-white border-2 border-blue-900/30 rounded-lg p-3.5 flex flex-col gap-1.5 shadow-[2px_2px_0px_#1E3A8A]">
                    <div className="flex items-start gap-2">
                      <BookOpen className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                      <span className="font-black text-sm text-blue-950 leading-snug">
                        {ticket.archiveTitle}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 pl-6 text-xs text-slate-600 font-semibold">
                      <Info className="h-3.5 w-3.5 text-blue-900 shrink-0" />
                      <span>Kategori: <b>{ticket.archiveType}</b></span>
                    </div>
                  </div>

                  {/* 1. STATUS TRACKER & STEPPER */}
                  <div className="rounded-lg border-2 border-blue-900 bg-white p-4 sm:p-5 shadow-[3px_3px_0px_#1E3A8A]">
                    <TicketProgress
                      currentStatus={ticket.status}
                      requestDate={ticket.requestDate}
                      dueDate={ticket.dueDate}
                      accDate={ticket.accDate}
                      pickupDeadline={ticket.pickupDeadline}
                    />
                  </div>

                  {/* 2. DYNAMIC TIMELINE (DESKTOP) */}
                  <div className="hidden sm:block rounded-lg border-2 border-blue-900 bg-white p-5 shadow-[3px_3px_0px_#1E3A8A]">
                    <h4 className="mb-4 text-xs font-black uppercase tracking-wider text-blue-950">
                      Rincian Garis Waktu
                    </h4>
                    <div className="flex flex-col gap-3 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span className="font-semibold text-slate-700">Waktu Pengajuan</span>
                        </div>
                        <span className="font-black text-blue-950">{ticket.requestDate}</span>
                      </div>

                      {(ticket.status === "WAITING_PICKUP" ||
                        ticket.status === "BORROWED" ||
                        ticket.status === "OVERDUE") && (
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                          <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span className="font-semibold text-slate-700">Disetujui Petugas</span>
                          </div>
                          <span className="font-black text-blue-950">{ticket.accDate || "-"}</span>
                        </div>
                      )}

                      {ticket.status === "WAITING_PICKUP" && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                            <span className="font-semibold text-amber-900">Batas Pengambilan di HMP</span>
                          </div>
                          <span className="font-black text-amber-700">{ticket.pickupDeadline || "Segera"}</span>
                        </div>
                      )}

                      {(ticket.status === "BORROWED" || ticket.status === "OVERDUE") && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span className="font-semibold text-slate-700">Tenggat Pengembalian</span>
                          </div>
                          <span className="font-black text-orange-600">{ticket.dueDate || "Belum ditentukan"}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3. BOTTOM ACTION (OVERDUE WITH FINE PAYMENT / CANCEL BUTTON) */}
                  {ticket.status === "OVERDUE" || (ticket.fineAmount && ticket.fineAmount > 0) ? (
                    <div className="bg-rose-50 border-2 border-red-600 rounded-lg p-4 sm:p-5 shadow-[4px_4px_0px_#DC2626] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-black text-rose-950">
                              Tunggakan Denda: Rp {(ticket.fineAmount || 0).toLocaleString("id-ID")}
                            </h4>
                            <Badge variant="rose" className="text-[10px]">
                              TERLAMBAT
                            </Badge>
                          </div>
                          <p className="text-xs text-rose-800 font-medium leading-relaxed">
                            Arsip telah melewati batas waktu pengembalian. Harap segera lakukan pembayaran denda dan kembalikan fisik arsip.
                          </p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="success"
                        size="sm"
                        onClick={() => handleContactAdminWa(ticket)}
                        className="w-full sm:w-auto shrink-0 shadow-[2px_2px_0px_#1E3A8A]"
                      >
                        <Phone className="w-4 h-4 mr-1.5" />
                        Bayar Denda via WhatsApp
                      </Button>
                    </div>
                  ) : ticket.status === "REQUESTED" || ticket.status === "WAITING_PICKUP" ? (
                    <div className="flex justify-end pt-2">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancel(ticket.id)}
                      >
                        Batalkan Antrean
                      </Button>
                    </div>
                  ) : null}
                </div>
              )}
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white border-2 border-blue-900 border-dashed rounded-lg shadow-[4px_4px_0px_#1E3A8A] text-center">
            <div className="bg-orange-100 border-2 border-blue-900 w-14 h-14 rounded-lg flex items-center justify-center mb-3 shadow-[2px_2px_0px_#1E3A8A]">
              <BookOpenCheck className="w-7 h-7 text-blue-950" />
            </div>
            <p className="text-base font-black text-blue-950">
              Tidak Ada Peminjaman Aktif
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1 max-w-sm">
              Anda tidak memiliki arsip yang sedang dipinjam atau dalam proses antrean saat ini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

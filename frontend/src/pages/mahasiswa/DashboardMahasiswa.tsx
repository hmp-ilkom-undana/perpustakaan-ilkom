import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  MapPin,
  Calendar as CalendarIcon,
  Loader2,
  CheckCircle2,
  Phone,
  Search,
  Receipt,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useMyBorrowingHistoryQuery } from "@/hooks/queries/useBorrowingQuery";
import { useSystemSettingQuery } from "@/hooks/queries/useSettingQuery";

export default function DashboardMahasiswa() {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();

  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: borrowings = [], isPending: isLoading } = useMyBorrowingHistoryQuery();
  const { data: setting } = useSystemSettingQuery();

  if (isSessionLoading || isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const activeStatuses = ["REQUESTED", "WAITING_PICKUP", "BORROWED", "OVERDUE"];
  const activeBorrowings = borrowings.filter((b: any) =>
    activeStatuses.includes(b.status),
  );

  const maxSkripsi = setting?.maxActiveSkripsi ?? 2;
  const maxRingkasan = setting?.maxActiveRingkasan ?? 1;
  const maxNaskah = setting?.maxActiveNaskah ?? 1;
  const maksimal = maxSkripsi + maxRingkasan + maxNaskah;
  const terpakai = activeBorrowings.length;

  let countSkripsi = 0;
  let countRingkasan = 0;
  let countNaskah = 0;

  activeBorrowings.forEach((b: any) => {
    const type = b.archive.archiveType.toUpperCase().replace(" ", "_");
    if (type === "SKRIPSI") countSkripsi++;
    else if (type === "RINGKASAN_SKRIPSI") countRingkasan++;
    else if (type === "NASKAH_PUBLIKASI") countNaskah++;
  });

  const totalDenda = borrowings.reduce(
    (sum: number, b: any) => sum + (b.fineAmount || 0),
    0,
  );

  // Daftar arsip yang terkena denda aktif / belum lunas
  const fineBorrowings = borrowings.filter(
    (b: any) => (b.fineAmount && b.fineAmount > 0 && !b.finePaidAt) || b.status === "OVERDUE"
  );

  const firstName = session?.user?.name?.split(" ")[0] || "Mahasiswa";

  const handleContactAdminWa = () => {
    const rawNumber = setting?.adminWaNumber || "082339113591";
    const cleanNumber = rawNumber.replace(/\D/g, "");
    const formattedNumber = cleanNumber.startsWith("0") ? "62" + cleanNumber.slice(1) : cleanNumber;
    const studentName = session?.user?.name || "Mahasiswa";
    const studentNim = (session?.user as any)?.nim || "-";

    const text = encodeURIComponent(
      `Halo ${setting?.adminContactName || "Admin Perpustakaan ILKOM"},\n\nSaya ingin konfirmasi pelunasan tunggakan denda perpustakaan:\n- Nama: ${studentName}\n- NIM: ${studentNim}\n- Total Denda: Rp ${totalDenda.toLocaleString("id-ID")}\n\nMohon informasi petunjuk pembayarannya. Terima kasih.`
    );

    window.open(`https://wa.me/${formattedNumber}?text=${text}`, "_blank");
  };

  // Data Kalender
  const getTaskDate = (b: any) => {
    return b.status === "BORROWED" || b.status === "OVERDUE"
      ? b.returnDate
      : b.accDate || b.borrowDate;
  };

  const taskDates = activeBorrowings
    .map((b: any) => {
      const ds = getTaskDate(b);
      return ds ? new Date(ds) : null;
    })
    .filter(Boolean) as Date[];

  const modifiers = {
    hasTask: taskDates,
  };

  const modifiersStyles = {
    hasTask: {
      fontWeight: "900",
      backgroundColor: "#f59e0b",
      color: "#1e3a8a",
      border: "2px solid #1e3a8a",
      boxShadow: "2px 2px 0px #1e3a8a",
      borderRadius: "6px"
    },
  };

  const tasksForSelectedDate = activeBorrowings.filter((b: any) => {
    if (!date) return false;
    const ds = getTaskDate(b);
    if (!ds) return false;
    const d = new Date(ds);
    return (
      d.getDate() === date.getDate() &&
      d.getMonth() === date.getMonth() &&
      d.getFullYear() === date.getFullYear()
    );
  });

  return (
    <div className="flex flex-col space-y-6 max-w-4xl mx-auto w-full pb-12 min-h-screen sm:min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Zona Sambutan */}
      <div className="flex flex-col gap-1 px-5 pt-4 sm:p-0">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-950 leading-tight">
          Selamat datang kembali,{" "}
          <span className="text-orange-500">{firstName}</span>!
        </h1>
        <p className="text-slate-500 font-semibold text-xs mt-0.5">{currentDate}</p>
      </div>

      {/* 2. Alert Peringatan Denda & Kartu Rincian Denda */}
      {totalDenda > 0 && (
        <div className="w-full px-5 sm:px-0 space-y-4">
          {/* Banner Peringatan Denda */}
          <div className="bg-red-50 border-2 border-red-600 rounded-lg p-4 sm:p-5 shadow-[4px_4px_0px_#DC2626] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-950 font-black text-base">
                  Tunggakan Denda: Rp {totalDenda.toLocaleString("id-ID")}
                </h3>
                <p className="text-red-800 text-xs font-medium mt-0.5 leading-relaxed">
                  Harap segera lunasi untuk membuka kembali akses peminjaman Anda.
                  Hubungi pengurus HMP untuk konfirmasi pembayaran denda.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="success"
              onClick={handleContactAdminWa}
              className="w-full sm:w-auto shrink-0 shadow-[2px_2px_0px_#1E3A8A]"
            >
              <Phone className="w-4 h-4 mr-1.5" />
              Bayar Denda via WhatsApp
            </Button>
          </div>

          {/* CARD RINCIAN DENDA: Informasi Arsip yang Terkena Denda */}
          {fineBorrowings.length > 0 && (
            <Card className="border-2 border-red-600 shadow-[4px_4px_0px_#DC2626] bg-white overflow-hidden">
              <CardHeader className="p-4 sm:p-5 pb-3 border-b-2 border-red-600 bg-red-50/70 flex flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-red-600" />
                  <CardTitle className="text-xs sm:text-sm font-black text-red-950 uppercase tracking-wider">
                    Rincian Tagihan Arsip ({fineBorrowings.length} Dokumen)
                  </CardTitle>
                </div>
                <Badge variant="rose">
                  Total: Rp {totalDenda.toLocaleString("id-ID")}
                </Badge>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 space-y-3">
                {fineBorrowings.map((fb: any) => {
                  const typeLower = (fb.archive?.archiveType || "").toLowerCase();
                  let typeVariant: "orange" | "sky" | "navy" | "secondary" = "orange";
                  if (typeLower.includes("ringkasan")) typeVariant = "sky";
                  else if (typeLower.includes("naskah") || typeLower.includes("publikasi")) typeVariant = "navy";

                  const isOverdue = fb.status === "OVERDUE";
                  const isDamaged = fb.status === "DAMAGED";
                  const isLost = fb.status === "LOST";

                  let reasonLabel = "Keterlambatan Pengembalian";
                  if (isDamaged) reasonLabel = "Denda Kerusakan Fisik";
                  else if (isLost) reasonLabel = "Denda Penggantian Arsip Hilang";

                  return (
                    <div
                      key={fb.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50 border-2 border-blue-900/30 rounded-lg gap-3 hover:border-red-500 transition-colors"
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={typeVariant} className="text-[10px]">
                            {fb.archive?.archiveType || "Arsip"}
                          </Badge>
                          <Badge variant={isOverdue || isLost ? "rose" : "amber"} className="text-[10px]">
                            {isOverdue ? "TERLAMBAT" : isDamaged ? "RUSAK" : isLost ? "HILANG" : "DENDA"}
                          </Badge>
                          <span className="text-[10px] font-mono font-bold text-slate-500">
                            {fb.pickupCode || `REQ-${fb.id.substring(0, 6).toUpperCase()}`}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-black text-blue-950 truncate leading-snug">
                          {fb.archive?.title}
                        </h4>

                        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
                          <span>{reasonLabel}</span>
                          {fb.returnDate && (
                            <>
                              <span>&bull;</span>
                              <span>
                                Tenggat: {new Date(fb.returnDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-500">Subtotal Denda</span>
                        <span className="text-sm sm:text-base font-black text-red-600">
                          Rp {(fb.fineAmount || 0).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  );
                })}

                <div className="flex justify-end pt-1">
                  <Link to="/mahasiswa/peminjaman" className="text-xs font-black text-blue-900 hover:text-orange-500 flex items-center gap-1">
                    Buka Halaman Peminjaman
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* 3. Zona Kuota & Kalender (Mobile First Layout) */}
      <div className="w-full px-5 sm:px-0">
        <div className="flex flex-col md:grid md:grid-cols-5 gap-6">
          
          {/* Kolom Kiri: Kalender & Kuota (Desktop) / Atas (Mobile) */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* Metrik: Kuota Peminjaman */}
            <Card className="flex flex-col justify-between">
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-orange-500" />
                    <p className="text-xs font-black text-blue-950 uppercase tracking-wider">
                      Kuota Peminjaman
                    </p>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-orange-500 leading-none mb-1">
                    {terpakai}{" "}
                    <span className="text-xl sm:text-2xl text-slate-400 font-bold">
                      / {maksimal}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Progress Bar Segments */}
                  <div className="flex h-3 w-full gap-1 bg-slate-100 rounded-md p-0.5 border border-blue-900/30 overflow-hidden">
                    {countSkripsi > 0 && (
                      <div
                        className="bg-orange-500 h-full rounded-sm transition-all duration-500"
                        style={{ width: `${(countSkripsi / maksimal) * 100}%` }}
                      />
                    )}
                    {countRingkasan > 0 && (
                      <div
                        className="bg-sky-400 h-full rounded-sm transition-all duration-500"
                        style={{ width: `${(countRingkasan / maksimal) * 100}%` }}
                      />
                    )}
                    {countNaskah > 0 && (
                      <div
                        className="bg-blue-900 h-full rounded-sm transition-all duration-500"
                        style={{ width: `${(countNaskah / maksimal) * 100}%` }}
                      />
                    )}
                  </div>

                  {/* Quota Indicators */}
                  <div className="flex flex-row justify-between items-center text-[10px] lg:text-[11px] font-semibold w-full gap-1 pt-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 bg-orange-500 border border-blue-900 shadow-[1px_1px_0px_#1E3A8A] rounded-xs shrink-0" />
                      <span className="text-slate-700">Skripsi <b className="text-blue-950 font-black">{countSkripsi}/{maxSkripsi}</b></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 bg-sky-400 border border-blue-900 shadow-[1px_1px_0px_#1E3A8A] rounded-xs shrink-0" />
                      <span className="text-slate-700">Ringkasan <b className="text-blue-950 font-black">{countRingkasan}/{maxRingkasan}</b></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 bg-blue-900 border border-blue-900 shadow-[1px_1px_0px_#1E3A8A] rounded-xs shrink-0" />
                      <span className="text-slate-700">Publikasi <b className="text-blue-950 font-black">{countNaskah}/{maxNaskah}</b></span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Kalender Card */}
            <Card>
              <CardContent className="p-3 sm:p-4 flex flex-col items-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md mx-auto"
                  modifiers={modifiers}
                  modifiersStyles={modifiersStyles}
                />
              </CardContent>
            </Card>
          </div>

          {/* Kolom Kanan: Daftar Aktivitas (Desktop) / Bawah (Mobile) */}
          <div className="md:col-span-3 flex flex-col">
            <h2 className="text-xs font-black text-blue-950 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-orange-500" />
              Aktivitas Tanggal {date?.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
            </h2>

            <div className="flex flex-col gap-3">
              {tasksForSelectedDate.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-blue-900 rounded-lg shadow-[4px_4px_0px_#1E3A8A] p-8 flex flex-col items-center justify-center text-center">
                  <div className="bg-orange-100 border-2 border-blue-900 w-14 h-14 rounded-lg flex items-center justify-center mb-3 shadow-[2px_2px_0px_#1E3A8A]">
                    <CalendarIcon className="w-7 h-7 text-blue-950" />
                  </div>
                  <h3 className="font-black text-sm text-blue-950">Tidak Ada Aktivitas</h3>
                  <p className="text-slate-500 text-xs font-medium mt-1 max-w-xs">
                    Anda tidak memiliki tenggat pengembalian atau jadwal pengambilan pada tanggal ini.
                  </p>
                </div>
              ) : (
                tasksForSelectedDate.map((task: any) => {
                  const isOverdue = task.status === "OVERDUE";
                  const isBorrowed = task.status === "BORROWED";
                  const isWaitingPickup = task.status === "WAITING_PICKUP";

                  let badgeVariant: "emerald" | "amber" | "rose" | "navy" = "navy";
                  let badgeText = "PENGAJUAN";

                  if (isOverdue) {
                    badgeVariant = "rose";
                    badgeText = "TERLAMBAT";
                  } else if (isBorrowed) {
                    badgeVariant = "emerald";
                    badgeText = "PENGEMBALIAN";
                  } else if (isWaitingPickup) {
                    badgeVariant = "amber";
                    badgeText = "PENGAMBILAN";
                  }

                  return (
                    <Card key={task.id} variant="interactive" className="overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="p-4 flex-1 border-b sm:border-b-0 sm:border-r-2 border-blue-900">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant={badgeVariant}>
                              {badgeText}
                            </Badge>
                            <span className="text-[10px] font-mono font-bold text-slate-500">
                              {task.pickupCode || `REQ-${task.id.substring(0, 6).toUpperCase()}`}
                            </span>
                          </div>
                          
                          <h3 className="text-sm font-black text-blue-950 leading-snug">
                            {task.archive.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 font-semibold flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-orange-500" /> {task.archive.archiveType}
                          </p>

                          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                            <MapPin className="w-3.5 h-3.5 text-orange-500" />
                            Ruangan HMP
                          </div>
                        </div>
                        
                        {/* Aksi / Status Cepat */}
                        {isWaitingPickup && (
                          <div className="p-4 sm:w-40 flex flex-col justify-center items-center bg-amber-50">
                            <p className="text-[10px] font-black text-blue-950 uppercase tracking-wider mb-1.5">
                              Pickup Code
                            </p>
                            <div className="bg-white border-2 border-blue-900 rounded-md px-3 py-1.5 w-full text-center shadow-[2px_2px_0px_#1E3A8A]">
                              <span className="text-base font-mono font-black tracking-widest text-orange-500">
                                {task.pickupCode || `REQ-${task.id.substring(0, 6).toUpperCase()}`}
                              </span>
                            </div>
                          </div>
                        )}
                        {isBorrowed && (
                          <div className="p-4 sm:w-40 flex flex-col justify-center items-center bg-slate-50">
                            <CheckCircle2 className="w-7 h-7 text-emerald-600 mb-1" />
                            <p className="text-xs font-black text-blue-950 text-center">
                              Sedang Dipinjam
                            </p>
                          </div>
                        )}
                        {isOverdue && (
                          <div className="p-4 sm:w-44 flex flex-col justify-center items-center bg-rose-50 border-t sm:border-t-0 sm:border-l-2 border-rose-500">
                            <AlertTriangle className="w-6 h-6 text-rose-600 mb-1" />
                            <p className="text-xs font-black text-rose-700 text-center uppercase tracking-wider">
                              Terlambat
                            </p>
                            <span className="text-[11px] font-black text-rose-600 mt-0.5">
                              Denda: Rp {(task.fineAmount || 0).toLocaleString("id-ID")}
                            </span>
                          </div>
                        )}
                        {!isWaitingPickup && !isBorrowed && !isOverdue && (
                          <div className="p-4 sm:w-40 flex flex-col justify-center items-center bg-slate-50">
                            <Clock className="w-6 h-6 text-blue-900 mb-1" />
                            <p className="text-xs font-black text-blue-950 text-center">
                              Menunggu ACC
                            </p>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Zona Eksplorasi (Quick Action CTA) */}
      <div className="pt-4 px-5 sm:px-0 flex justify-center w-full">
        <Link to="/mahasiswa/katalog" className="w-full sm:w-auto">
          <Button size="lg" className="w-full sm:w-auto text-sm font-black shadow-[4px_4px_0px_#1E3A8A]">
            <Search className="w-4 h-4 mr-2" />
            Cari Arsip di Katalog
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

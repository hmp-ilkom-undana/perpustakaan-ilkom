import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  MapPin,
  Calendar as CalendarIcon,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useMyBorrowingHistoryQuery } from "@/hooks/queries/useBorrowingQuery";

interface BorrowingData {
  id: string;
  status: string;
  borrowDate: string;
  returnDate: string | null;
  accDate: string | null;
  fineAmount: number;
  pickupCode: string | null;
  archive: {
    title: string;
    author: string;
    archiveType: string;
    category: string;
  };
}

export default function DashboardMahasiswa() {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();

  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: borrowings = [], isPending: isLoading } = useMyBorrowingHistoryQuery();

  if (isSessionLoading || isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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
  const activeBorrowings = borrowings.filter((b) =>
    activeStatuses.includes(b.status),
  );

  const terpakai = activeBorrowings.length;
  const maksimal = 4;
  const progressValue = (terpakai / maksimal) * 100;

  let countSkripsi = 0;
  let countRingkasan = 0;
  let countNaskah = 0;

  activeBorrowings.forEach((b) => {
    const type = b.archive.archiveType.toUpperCase().replace(" ", "_");
    if (type === "SKRIPSI") countSkripsi++;
    else if (type === "RINGKASAN_SKRIPSI") countRingkasan++;
    else if (type === "NASKAH_PUBLIKASI") countNaskah++;
  });

  const totalDenda = borrowings.reduce(
    (sum, b) => sum + (b.fineAmount || 0),
    0,
  );

  const firstName = session?.user?.name?.split(" ")[0] || "Mahasiswa";

  // Data Kalender
  const getTaskDate = (b: any) => {
    return b.status === "BORROWED" || b.status === "OVERDUE"
      ? b.returnDate
      : b.accDate || b.borrowDate;
  };

  const taskDates = activeBorrowings
    .map((b) => {
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
      borderRadius: "4px"
    },
  };

  const tasksForSelectedDate = activeBorrowings.filter((b) => {
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
    <div className="flex flex-col space-y-6 sm:space-y-6 max-w-4xl mx-auto w-full pb-8 sm:pb-0 min-h-screen sm:min-h-0 bg-slate-50 sm:bg-transparent animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Zona Sambutan */}
      <div className="flex flex-col gap-1.5 px-5 pt-8 sm:p-0 bg-white sm:bg-transparent pb-6 sm:pb-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
          Selamat datang kembali,
          <br className="sm:hidden" /> <span className="text-orange-600">{firstName}</span>!
        </h1>
        <p className="text-slate-500 font-medium text-sm mt-1">{currentDate}</p>
      </div>

      {/* 2. Alert Peringatan Denda */}
      {totalDenda > 0 && (
        <div className="w-full sm:px-0">
          <div className="bg-red-50 sm:border border-red-200 px-5 py-4 sm:p-4 sm:rounded-lg flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h3 className="text-red-800 font-bold text-base">
                Tunggakan Denda: Rp {totalDenda.toLocaleString("id-ID")}
              </h3>
            </div>
            <p className="text-red-700/90 text-sm font-medium leading-relaxed">
              Harap segera lunasi untuk membuka kembali akses peminjaman Anda.
              Silahkan hubungi admin atau anggota HMP.
            </p>
          </div>
        </div>
      )}

      {/* 3. Zona Kuota & Kalender (Mobile First Layout) */}
      <div className="w-full px-5 sm:px-0">
        <div className="flex flex-col md:grid md:grid-cols-5 gap-6">
          
          {/* Kolom Kiri: Kalender & Kuota (Desktop) / Atas (Mobile) */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* Metrik: Kuota Peminjaman */}
            <div className="flex flex-col justify-between p-5 border-2 border-blue-900 rounded-md shadow-[4px_4px_0px_#1E3A8A] bg-white">
              <div>
                <div className="flex items-center gap-2 mb-2 sm:mb-4">
                  <BookOpen className="w-4 h-4 text-orange-600 hidden sm:block" />
                  <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Peminjaman
                  </p>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-orange-600 leading-none mb-3">
                  {terpakai}{" "}
                  <span className="text-xl sm:text-2xl text-orange-200 font-bold">
                    / {maksimal}
                  </span>
                </div>
              </div>
              <div className="space-y-3 mt-auto">
                <div className="flex h-2 sm:h-2.5 w-full gap-1">
                  {countSkripsi > 0 && (
                    <div
                      className="bg-orange-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(countSkripsi / maksimal) * 100}%` }}
                    ></div>
                  )}
                  {countRingkasan > 0 && (
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(countRingkasan / maksimal) * 100}%` }}
                    ></div>
                  )}
                  {countNaskah > 0 && (
                    <div
                      className="bg-yellow-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(countNaskah / maksimal) * 100}%` }}
                    ></div>
                  )}
                  {terpakai < maksimal && (
                    <div
                      className="bg-slate-100 h-full rounded-full transition-all duration-500"
                      style={{ flexGrow: 1 }}
                    ></div>
                  )}
                </div>

                <div className="flex flex-row justify-between items-center pt-1 text-[10px] lg:text-[11px] text-slate-500 font-medium w-full gap-1">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-orange-400 border border-blue-900 shadow-[1px_1px_0px_#1E3A8A] shrink-0"></div>
                    <span className="font-bold text-slate-700">Skripsi <span className="text-blue-900 font-black">{countSkripsi}/2</span></span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 border border-blue-900 shadow-[1px_1px_0px_#1E3A8A] shrink-0"></div>
                    <span className="font-bold text-slate-700">Ringkasan <span className="text-blue-900 font-black">{countRingkasan}/1</span></span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-400 border border-blue-900 shadow-[1px_1px_0px_#1E3A8A] shrink-0"></div>
                    <span className="font-bold text-slate-700">Publikasi <span className="text-blue-900 font-black">{countNaskah}/1</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Kalender */}
            <div className="bg-white p-2 sm:p-5 border-2 border-blue-900 rounded-md shadow-[4px_4px_0px_#1E3A8A] flex flex-col items-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md mx-auto"
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
              />
            </div>
          </div>

          {/* Kolom Kanan: Daftar Tugas (Desktop) / Bawah (Mobile) */}
          <div className="md:col-span-3 flex flex-col">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-orange-600" />
              Aktivitas Tanggal {date?.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
            </h2>

            <div className="flex flex-col gap-4">
              {tasksForSelectedDate.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-blue-900 rounded-md shadow-[4px_4px_0px_#1E3A8A] p-10 flex flex-col items-center justify-center text-center">
                  <div className="bg-slate-50 border-2 border-blue-900 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-[2px_2px_0px_#1E3A8A]">
                    <CalendarIcon className="w-8 h-8 text-blue-900" />
                  </div>
                  <h3 className="font-bold text-slate-800">Tidak Ada Aktivitas</h3>
                  <p className="text-slate-500 text-sm mt-1">Anda tidak memiliki tenggat pengembalian atau jadwal pengambilan pada tanggal ini.</p>
                </div>
              ) : (
                tasksForSelectedDate.map((task) => (
                  <div key={task.id} className="bg-white border-2 border-blue-900 rounded-md shadow-[4px_4px_0px_#1E3A8A] flex flex-col sm:flex-row overflow-hidden group">
                    <div className="p-5 flex-1 border-b sm:border-b-0 sm:border-r-2 border-blue-900">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="outline">
                          {task.status === "BORROWED" ? "PENGEMBALIAN" : task.status === "WAITING_PICKUP" ? "PENGAMBILAN" : "PENGAJUAN"}
                        </Badge>
                        <span className="text-[10px] font-mono text-slate-500 font-bold group-hover:text-orange-500 transition-colors">
                          {task.pickupCode || `REQ-${task.id.substring(0, 6).toUpperCase()}`}
                        </span>
                      </div>
                      
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {task.archive.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-2">
                        <BookOpen className="w-3 h-3" /> {task.archive.archiveType}
                      </p>

                      <div className="mt-4 flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        Ruangan HMP
                      </div>
                    </div>
                    
                    {/* Aksi / Status Cepat */}
                    {task.status === "WAITING_PICKUP" && (
                      <div className="p-5 sm:w-40 flex flex-col justify-center items-center bg-amber-50">
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-2">
                          Pickup Code
                        </p>
                        <div className="bg-white border-2 border-blue-900 rounded-md px-4 py-2 w-full text-center shadow-[2px_2px_0px_#1E3A8A]">
                          <span className="text-lg font-mono font-bold tracking-widest text-orange-600">
                            {task.pickupCode || `REQ-${task.id.substring(0, 6).toUpperCase()}`}
                          </span>
                        </div>
                      </div>
                    )}
                    {task.status === "BORROWED" && (
                      <div className="p-5 sm:w-40 flex flex-col justify-center items-center bg-slate-50">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                        <p className="text-xs font-bold text-slate-800 text-center">
                          Sedang Dipinjam
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Zona Eksplorasi (Quick Action) */}
      <div className="pt-6 pb-12 px-5 sm:px-0 flex justify-center w-full mt-auto">
        <Link
          to="/mahasiswa/katalog"
          className="inline-flex items-center justify-center bg-orange-500 text-white font-bold border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] hover:bg-orange-400 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all h-14 sm:h-12 w-full sm:w-auto rounded-md sm:px-8"
        >
          Cari Arsip di Katalog
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </div>
    </div>
  );
}

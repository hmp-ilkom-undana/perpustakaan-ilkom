import { Link } from "react-router-dom";
import { AlertTriangle, Clock, ArrowRight, BookOpen, MapPin, CalendarClock, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

interface BorrowingData {
  id: string;
  status: string;
  borrowDate: string;
  returnDate: string | null;
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
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const [borrowings, setBorrowings] = useState<BorrowingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/borrowings/my-history", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setBorrowings(data);
        }
      } catch (error) {
        console.error("Gagal mengambil riwayat:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

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

  // Kalkulasi Metrik dari Data Asli
  const activeStatuses = ["REQUESTED", "WAITING_PICKUP", "BORROWED", "OVERDUE"];
  const activeBorrowings = borrowings.filter((b) => activeStatuses.includes(b.status));
  
  const terpakai = activeBorrowings.length;
  const maksimal = 4; // Maksimal kuota: 2 Skripsi + 1 Ringkasan + 1 Naskah
  const progressValue = (terpakai / maksimal) * 100;
  
  const totalDenda = borrowings.reduce((sum, b) => sum + (b.fineAmount || 0), 0);

  // Cari transaksi yang sedang berjalan (prioritas WAITING_PICKUP atau BORROWED)
  const transaksiBerjalan = activeBorrowings.find((b) => b.status === "WAITING_PICKUP" || b.status === "BORROWED" || b.status === "REQUESTED");

  // Format Tenggat Waktu
  let tenggatTerdekat = "Aman";
  let tenggatBuku = "Tidak ada tenggat waktu dalam waktu dekat.";
  
  if (transaksiBerjalan && transaksiBerjalan.returnDate) {
    const returnDate = new Date(transaksiBerjalan.returnDate);
    tenggatTerdekat = returnDate.toLocaleDateString("id-ID", { month: "short", day: "numeric" });
    tenggatBuku = transaksiBerjalan.archive.title;
  }

  const firstName = session?.user?.name?.split(" ")[0] || "Mahasiswa";

  return (
    <div className="flex flex-col space-y-6 sm:space-y-6 max-w-4xl mx-auto w-full pb-8 sm:pb-0 min-h-screen sm:min-h-0 bg-white sm:bg-transparent animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Zona Sambutan */}
      <div className="flex flex-col gap-1.5 px-5 pt-8 sm:p-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
          Selamat datang kembali,<br className="sm:hidden" /> {firstName}!
        </h1>
        <p className="text-slate-500 font-medium text-sm mt-1">{currentDate}</p>
      </div>

      {/* 2. Alert Peringatan Denda */}
      {totalDenda > 0 && (
        <div className="w-full sm:px-0">
          <div className="bg-red-50 sm:border border-red-200 px-5 py-4 sm:p-4 sm:rounded-lg flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h3 className="text-red-800 font-bold text-base">Tunggakan Denda: Rp {totalDenda.toLocaleString("id-ID")}</h3>
            </div>
            <p className="text-red-700/90 text-sm font-medium leading-relaxed">
              Harap segera lunasi untuk membuka kembali akses peminjaman Anda. Silahkan hubungi admin atau anggota HMP.
            </p>
          </div>
        </div>
      )}

      {/* 3. Zona Metrik Cepat */}
      <div className="w-full px-5 sm:px-0">
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          
          {/* Metrik 1: Kuota Peminjaman */}
          <div className="flex flex-col justify-between sm:p-5 sm:border border-slate-200 sm:rounded-xl sm:shadow-sm sm:bg-white">
            <div>
              <div className="flex items-center gap-2 mb-2 sm:mb-4">
                <BookOpen className="w-4 h-4 text-blue-600 hidden sm:block" />
                <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Peminjaman</p>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-none mb-3">
                {terpakai} <span className="text-xl sm:text-2xl text-slate-300 font-bold">/ {maksimal}</span>
              </div>
            </div>
            <div className="space-y-2 mt-auto">
              <Progress value={progressValue} className="h-1.5 sm:h-2 bg-slate-100" />
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-tight">
                {terpakai === maksimal 
                  ? "Kuota penuh, Anda tidak dapat meminjam lagi." 
                  : `Sisa kuota pinjam Anda sangat mencukupi.`}
              </p>
            </div>
          </div>

          {/* Metrik 2: Batas Waktu Terdekat */}
          <div className="flex flex-col justify-between pl-4 border-l border-slate-100 sm:border-l-0 sm:p-5 sm:border border-slate-200 sm:rounded-xl sm:shadow-sm sm:bg-white">
            <div>
              <div className="flex items-center gap-2 mb-2 sm:mb-4">
                <Clock className="w-4 h-4 text-orange-600 hidden sm:block" />
                <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Tenggat</p>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight mb-2">
                {tenggatTerdekat}
              </div>
            </div>
            <div className="mt-auto">
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-2 leading-tight">
                {tenggatBuku}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Zona Konteks Aktivitas */}
      {transaksiBerjalan && (
        <div className="mt-2 w-full">
          <div className="px-5 sm:px-0">
            <h2 className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Aktivitas Berjalan
            </h2>
            
            <div className="bg-slate-50 sm:bg-white sm:border border-slate-200 sm:shadow-sm rounded-xl sm:rounded-xl flex flex-col sm:flex-row overflow-hidden">
              
              {/* Bagian Kiri: Info Buku */}
              <div className="p-5 sm:p-6 flex-1 border-b sm:border-b-0 sm:border-r border-slate-200/60 sm:border-dashed">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="outline" className={`font-bold px-2.5 py-0.5 text-[10px] sm:text-xs bg-white border-blue-200 text-blue-700`}>
                    {transaksiBerjalan.status.replace("_", " ")}
                  </Badge>
                  <span className="text-[10px] sm:text-xs font-mono text-slate-400 font-bold">#{transaksiBerjalan.id.substring(0,8).toUpperCase()}</span>
                </div>
                
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 leading-snug">
                  {transaksiBerjalan.archive.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">{transaksiBerjalan.archive.author}</p>
                
                <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Ambil / Kembalikan di Ruangan HMP
                </div>
              </div>
              
              {/* Bagian Kanan/Bawah: Pickup Code */}
              {transaksiBerjalan.status === "WAITING_PICKUP" && (
                <div className="p-5 sm:p-6 sm:w-64 flex flex-col justify-center items-center bg-white sm:bg-slate-50">
                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Pickup Code</p>
                  <div className="bg-slate-100 sm:bg-white sm:border-2 border-slate-100 rounded-lg px-4 py-2.5 sm:px-4 sm:py-3 w-full text-center">
                    <span className="text-xl sm:text-2xl font-mono font-bold tracking-widest text-slate-900">
                      {transaksiBerjalan.pickupCode || "MENUNGGU"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. Zona Eksplorasi (Quick Action) */}
      <div className="pt-6 pb-12 px-5 sm:px-0 flex justify-center w-full mt-auto">
        <Link 
          to="/mahasiswa/katalog"
          className="inline-flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 shadow-md sm:shadow-sm font-semibold h-14 sm:h-12 w-full sm:w-auto rounded-xl sm:px-8 transition-colors"
        >
          Cari Arsip di Katalog
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </div>

    </div>
  );
}

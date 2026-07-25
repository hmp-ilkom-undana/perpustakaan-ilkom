import { Link } from "react-router-dom";
import { AlertTriangle, Clock, ArrowRight, BookOpen, MapPin, CalendarClock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// --- DUMMY DATA ---
const user = {
  name: "Budi Santoso",
  totalDenda: 50000,
  kuotaPeminjaman: { terpakai: 1, maksimal: 4 },
  tenggatTerdekat: "Besok, 14:00", // Atau "Aman" jika tidak ada
  tenggatBuku: "Analisis Sentimen Menggunakan Naive Bayes",
  transaksiBerjalan: {
    id: "TRX-10293",
    status: "WAITING_PICKUP", // WAITING_PICKUP, BORROWED
    bukuTitle: "Analisis Sentimen Menggunakan Naive Bayes",
    bukuAuthor: "Dr. John Doe",
    pickupCode: "AX-8912",
    batasAmbil: "12 Agustus 2026, 14:00",
  }
};

export default function DashboardMahasiswa() {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const progressValue = (user.kuotaPeminjaman.terpakai / user.kuotaPeminjaman.maksimal) * 100;

  return (
    <div className="flex flex-col space-y-6 sm:space-y-6 max-w-4xl mx-auto w-full pb-8 sm:pb-0 min-h-screen sm:min-h-0 bg-white sm:bg-transparent">
      
      {/* 1. Zona Sambutan (Lebih lega) */}
      <div className="flex flex-col gap-1.5 px-5 pt-8 sm:p-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
          Selamat datang kembali,<br className="sm:hidden" /> {user.name.split(" ")[0]}!
        </h1>
        <p className="text-slate-500 font-medium text-sm mt-1">{currentDate}</p>
      </div>

      {/* 2. Alert Peringatan (Edge-to-edge on mobile, no border, just solid bg) */}
      {user.totalDenda > 0 && (
        <div className="w-full sm:px-0">
          <div className="bg-red-50 sm:border border-red-200 px-5 py-4 sm:p-4 sm:rounded-lg flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h3 className="text-red-800 font-bold text-base">Tunggakan Denda: Rp {user.totalDenda.toLocaleString('id-ID')}</h3>
            </div>
            <p className="text-red-700/90 text-sm font-medium leading-relaxed">
              Harap segera lunasi untuk membuka kembali akses peminjaman Anda. Silahkan hubungi admin atau anggota HMP.
            </p>
          </div>
        </div>
      )}

      {/* 3. Zona Metrik Cepat (Grid 2 Kolom di Mobile, Tidak Tumpuk Vertikal!) */}
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
                {user.kuotaPeminjaman.terpakai} <span className="text-xl sm:text-2xl text-slate-300 font-bold">/ {user.kuotaPeminjaman.maksimal}</span>
              </div>
            </div>
            <div className="space-y-2 mt-auto">
              <Progress value={progressValue} className="h-1.5 sm:h-2 bg-slate-100" />
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-tight">
                {user.kuotaPeminjaman.terpakai === user.kuotaPeminjaman.maksimal 
                  ? "Kuota penuh, Anda tidak dapat meminjam lagi." 
                  : `Sisa ${user.kuotaPeminjaman.maksimal - user.kuotaPeminjaman.terpakai} arsip yang dapat dipinjam.`}
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
                {user.tenggatTerdekat}
              </div>
            </div>
            <div className="mt-auto">
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-2 leading-tight">
                {user.tenggatBuku}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Zona Konteks (Lebih bersih, terstruktur vertikal di Mobile) */}
      {user.transaksiBerjalan && (
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
                  <Badge variant="outline" className="bg-white sm:bg-blue-50 text-blue-700 border-blue-200 font-bold px-2.5 py-0.5 text-[10px] sm:text-xs">
                    SIAP DIAMBIL
                  </Badge>
                  <span className="text-[10px] sm:text-xs font-mono text-slate-400 font-bold">#{user.transaksiBerjalan.id}</span>
                </div>
                
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 leading-snug">
                  {user.transaksiBerjalan.bukuTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">{user.transaksiBerjalan.bukuAuthor}</p>
                
                <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Ambil di Ruangan HMP
                </div>
              </div>
              
              {/* Bagian Kanan/Bawah: Pickup Code */}
              <div className="p-5 sm:p-6 sm:w-64 flex flex-col justify-center items-center bg-white sm:bg-slate-50">
                <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Pickup Code</p>
                <div className="bg-slate-100 sm:bg-white sm:border-2 border-slate-100 rounded-lg px-4 py-2.5 sm:px-4 sm:py-3 w-full text-center">
                  <span className="text-xl sm:text-2xl font-mono font-bold tracking-widest text-slate-900">
                    {user.transaksiBerjalan.pickupCode}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-red-600 font-bold">
                  <CalendarClock className="w-3.5 h-3.5" />
                  Batas: {user.transaksiBerjalan.batasAmbil.split(",")[0]}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Zona Eksplorasi (Quick Action) */}
      <div className="pt-6 pb-12 px-5 sm:px-0 flex justify-center w-full mt-auto">
        <Link 
          to="/mahasiswa/katalog"
          className="inline-flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 shadow-md sm:shadow-sm font-semibold h-14 sm:h-12 w-full sm:w-auto rounded-xl sm:px-8"
        >
          Cari Arsip di Katalog
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </div>

    </div>
  );
}

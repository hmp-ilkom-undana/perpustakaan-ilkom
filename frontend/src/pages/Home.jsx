import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Search,
  BookOpen,
  Zap,
  ShieldCheck,
  Smartphone,
  Laptop,
  Database,
  Lock,
  Cpu,
} from "lucide-react";
import bgHero from "../assets/hero-bg.png";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="pt-24 pb-0 bg-slate-950 rounded-b-[3rem] overflow-hidden flex flex-col items-center text-center relative shadow-2xl">
        {/* Cahaya di belakang teks */}
        <div className="absolute top-0 lext-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-orange-500/15 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Konten Teks & Pencarian */}
        <div className="container mx-auto px-4 relative z-10 mb-12">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white font-serif font-medium tracking-normal mb-6 max-w-5xl mx-auto leading-tight">
            Perpustakaan{" "}
            <span className="text-orange-500 font-serif font-medium tracking-normal">
              ILKOM
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Cari dan cek ketersediaan skripsi di rak secara real time. Lakukan
            peminjaman mandiri langsung dari ponsel Anda.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-3xl mx-auto bg-slate-900/60 backdrop-blur-xl p-2 rounded-full border border-slate-700 flex items-center justify-between shadow-2xl transition-all hover:border-orange-500/50">
            <div className="flex items-center gap-4 pl-6 w-full">
              <Search className="text-slate-400 h-6 w-6" />
              <input
                type="text"
                placeholder="Cari judul skripsi, penulis, atau topik spesifik..."
                className="bg-transparent border-none outline-none text-white w-full placeholder:text-slate-400 text-lg"
                disabled
              />
            </div>
            <Button
              asChild
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-10 h-14 text-lg font-bold transition-transform hover:scale-105 "
            >
              <Link to="/katalog">Telusuri</Link>
            </Button>
          </div>
        </div>

        {/* Gambar */}
        <div className="w-full max-w-6xl mx-auto px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none"></div>
          <img
            src={bgHero}
            alt="Hero ILKOM"
            className="w-full h-auto rounded-t-[2.5rem] object-cover shadow-2xl relative z-0"
            style={{ maxHeight: "450px", objectPosition: "top" }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 container mx-auto max-w-6xl">
        {/* Fitur 1: Kotak Ilustrasi Kiri, Teks Kanan */}
        <div className="flex flex-col md:flex-row items-center gap-16 mb-28">
          <div className="w-full md:w-1/2 aspect-video bg-slate-950 rounded-[2rem] overflow-hidden relative group shadow-xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="h-32 w-32 text-slate-800 transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 text-orange-500">
              <Search className="h-7 w-7" />
            </div>
            <h3 className="text-4xl font-extrabold text-slate-900 mb-6">
              Pencarian Kilat & Presisi
            </h3>
            <p className="text-xl text-slate-600 leading-relaxed font-light">
              Tinggalkan cara lama mencari dari lemari ke lemari. Telusuri
              judul, penulis, dan topik secara menyeluruh menggunakan filter
              tahun dan kategori untuk hasil spesifik dalam hitungan detik.
            </p>
          </div>
        </div>

        {/* Fitur 2: Teks Kiri, Kotak Ilustrasi Kanan */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-16 mb-28">
          <div className="w-full md:w-1/2 aspect-video bg-slate-950 rounded-[2rem] overflow-hidden relative group shadow-xl border-2 border-orange-500/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <Smartphone className="h-32 w-32 text-slate-800 transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-tl from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg">
              <Zap className="h-7 w-7" />
            </div>
            <h3 className="text-4xl font-extrabold text-slate-900 mb-6">
              Peminjaman Mandiri
            </h3>
            <p className="text-xl text-slate-600 leading-relaxed font-light">
              Temukan arsip fisik di rak, lalu{" "}
              <span className="font-semibold text-slate-900">scan QR Code</span>{" "}
              dan konfirmasi peminjaman langsung melalui ponsel Anda. Bebas
              antre, tanpa birokrasi yang rumit, dan ramah lingkungan.
            </p>
          </div>
        </div>

        {/* Fitur 3: Kotak Ilustrasi Kiri, Teks Kanan */}
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 aspect-video bg-slate-950 rounded-[2rem] overflow-hidden relative group shadow-xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldCheck className="h-32 w-32 text-slate-800 transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 text-white">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h3 className="text-4xl font-extrabold text-slate-900 mb-6">
              Otomasi Pelacakan & Denda
            </h3>
            <p className="text-xl text-slate-600 leading-relaxed font-light">
              Sistem kami melacak tanggal pengembalian dan menghitung sanksi
              secara otomatis. Riwayat transparan, denda adil, memastikan
              sirkulasi arsip menjadi lebih tertib.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          3. 4-COLUMN GRID (Kategori Populer)
          ========================================= */}
      <section className="py-24 px-4 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-16 font-serif italic">
            Telusuri Topik Populer
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                title: "Kecerdasan Buatan",
                icon: (
                  <Cpu className="h-10 w-10 mb-6 text-slate-700 group-hover:text-orange-500 transition-colors" />
                ),
              },
              {
                title: "Keamanan Siber",
                icon: (
                  <Lock className="h-10 w-10 mb-6 text-slate-700 group-hover:text-orange-500 transition-colors" />
                ),
              },
              {
                title: "Rekayasa Perangkat Lunak",
                icon: (
                  <Laptop className="h-10 w-10 mb-6 text-slate-700 group-hover:text-orange-500 transition-colors" />
                ),
              },
              {
                title: "Sistem Informasi",
                icon: (
                  <Database className="h-10 w-10 mb-6 text-slate-700 group-hover:text-orange-500 transition-colors" />
                ),
              },
            ].map((cat, i) => (
              <div
                key={i}
                className="bg-white p-10 rounded-[2rem] border border-slate-200 flex flex-col items-center justify-center hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer group"
              >
                {cat.icon}
                <h4 className="text-lg font-bold text-slate-900">
                  {cat.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          4. CLOSING CALL TO ACTION
          ========================================= */}
      <section className="py-32 px-4 bg-white text-center">
        <div className="container mx-auto max-w-4xl flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 text-orange-500 mb-8 shadow-inner">
            <BookOpen className="h-10 w-10" />
          </div>
          <h2 className="text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
            Satu Pintu untuk Seluruh Arsip Akademik Anda.
          </h2>
          <p className="text-xl text-slate-600 mb-12 font-light">
            Dibangun oleh mahasiswa, untuk mahasiswa. Telusuri katalog sekarang
            atau baca panduan lengkap peminjaman.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-10 h-16 text-lg font-bold shadow-xl transition-transform hover:scale-105"
            >
              <Link to="/katalog">Mulai Pencarian</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-slate-300 text-slate-700 hover:bg-slate-50 px-10 h-16 text-lg font-bold transition-transform hover:scale-105"
            >
              <Link to="/panduan">Baca Panduan</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

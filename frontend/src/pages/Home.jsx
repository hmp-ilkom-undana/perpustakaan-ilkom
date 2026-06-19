import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Zap, ShieldCheck, Smartphone } from "lucide-react";

// 1. Import gambar latar belakang isometrik
import bgHero from "../assets/hero-bg.png";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-28 pb-36 px-4 rounded-b-[3rem] shadow-2xl">
        {/* Container Gambar Latar */}
        <div className="absolute inset-0 z-0 bg-slate-950">
          <img
            src={bgHero}
            alt="Perpustakaan Digital Ilmu Komputer"
            className="w-full h-full object-cover object-center opacity-80"
          />
          {/* Overlay gradasi transparan ke gelap */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950"></div>
        </div>

        {/* Konten Utama di atas gambar */}
        <div className="container mx-auto relative z-10 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 max-w-4xl drop-shadow-2xl">
            Perpustakaan ILKOM,{" "}
            <span className="text-orange-500">diindeks ulang</span> untuk era
            digital.
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl font-light drop-shadow-md">
            Cari skripsi dan arsip dalam hitungan milidetik. Cek ketersediaan di
            rak secara real-time. Lakukan peminjaman mandiri langsung dari
            ponsel Anda — tanpa antrean, tanpa birokrasi kertas.
          </p>

          {/* Kotak Pencarian */}
          <div className="w-full max-w-2xl bg-white p-2.5 rounded-3xl border border-slate-200 flex items-center justify-between shadow-2xl transition-all hover:border-orange-200">
            <div className="flex items-center gap-3 pl-4 w-full">
              <Search className="text-slate-400 h-6 w-6" />
              <input
                type="text"
                placeholder="Cari judul skripsi, penulis, atau topik spesifik..."
                className="bg-transparent border-none outline-none text-slate-900 w-full placeholder:text-slate-400 text-lg"
                disabled
              />
            </div>
            <Button
              asChild
              size="lg"
              className="bg-slate-950 hover:bg-slate-800 text-white rounded-2xl px-10 h-16 text-lg font-bold shadow-lg"
            >
              <Link to="/katalog">Telusuri</Link>
            </Button>
          </div>

          {/* Render List Tag Topik Populer */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {[
              "Kecerdasan Buatan",
              "Keamanan Siber",
              "Rekayasa Perangkat Lunak",
              "Sistem Informasi",
            ].map((tag) => (
              <span
                key={tag}
                className="px-5 py-2 rounded-full border border-slate-700 bg-slate-900 text-slate-300 text-sm hover:border-orange-500 hover:text-white cursor-pointer backdrop-blur-sm transition-all shadow"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          FEATURES SECTION (Latar Terang & Bersih)
          ========================================= */}
      <section className="py-24 px-4 bg-slate-50 flex-1">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16">
            <h2 className="text-orange-500 font-bold tracking-wider text-sm uppercase mb-2">
              Fitur Unggulan
            </h2>
            <h3 className="text-4xl font-extrabold text-slate-900 max-w-2xl">
              Sistem perpustakaan yang bekerja secepat tenggat waktu skripsi
              Anda.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                <Search className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">
                Pencarian Kilat
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Telusuri judul, penulis, dan topik secara menyeluruh. Gunakan
                filter tahun dan kategori untuk mendapatkan hasil yang spesifik
                dalam hitungan detik.
              </p>
            </div>

            {/* Card 2 (Aksen Orange) */}
            <div className="bg-white p-8 rounded-3xl border-2 border-orange-500/20 shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Smartphone className="h-32 w-32" />
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">
                Peminjaman Mandiri
              </h4>
              <p className="text-slate-600 leading-relaxed relative z-10">
                Temukan arsip fisik di rak, lalu konfirmasi peminjaman langsung
                melalui ponsel Anda. Bebas antre dan tanpa perlu mengisi
                formulir kertas.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">
                Otomasi Pelacakan & Denda
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Jangan sampai terlewat batas waktu. Sistem kami menghitung denda
                secara otomatis dan transparan jika terjadi keterlambatan,
                kerusakan, atau kehilangan.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              <Link to="/panduan">
                <BookOpen className="mr-2 h-5 w-5" />
                Baca Panduan Peminjaman
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

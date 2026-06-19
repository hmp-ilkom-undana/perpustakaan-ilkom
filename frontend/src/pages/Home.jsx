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
            Cari Skripsi dalam hitungan milidetik. Cek ketersediaan di rak
            secara real time. Lakukan peminjaman mandiri langsung dari ponsel
            Anda.
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
    </div>
  );
}

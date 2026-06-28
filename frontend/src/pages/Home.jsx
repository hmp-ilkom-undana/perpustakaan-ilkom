import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Search,
  BookOpen,
  BookMarked,
  History,
  ArrowRight,
  Cpu,
  Lock,
  Laptop,
  Database,
} from "lucide-react";
import {
  MagnifyingGlass,
  DeviceMobile,
  ShieldCheck,
  Books,
} from "@phosphor-icons/react";
import bgHero from "../assets/hero-bg.png";

// ── Data ──────────────────────────────────────────────────────────────────────

const TRUST_ITEMS = [
  { Icon: BookMarked, label: "Arsip Akademik" },
  { Icon: Search, label: "Pencarian Cepat" },
  { Icon: BookOpen, label: "Peminjaman Mandiri" },
  { Icon: History, label: "Riwayat Terlacak" },
];

const FEATURES = [
  {
    Icon: MagnifyingGlass,
    title: "Pencarian Kilat & Presisi",
    description:
      "Telusuri judul, penulis, dan topik secara menyeluruh. Filter tahun dan kategori tersedia untuk hasil yang lebih spesifik.",
    featured: true,
  },
  {
    Icon: DeviceMobile,
    title: "Peminjaman Mandiri",
    description:
      "Temukan arsip di rak, ajukan peminjaman langsung dari ponsel. Bebas antre, tanpa birokrasi yang rumit.",
    featured: true,
  },
  {
    Icon: ShieldCheck,
    title: "Otomasi Pelacakan & Denda",
    description:
      "Sistem melacak tanggal pengembalian dan menghitung sanksi otomatis. Riwayat transparan, sirkulasi tertib.",
    featured: true,
  },
];

const CATEGORIES = [
  {
    Icon: Cpu,
    title: "Kecerdasan Buatan",
    description: "Machine learning, deep learning, computer vision, NLP.",
    theme: {
      border: "border-orange-200/60",
      glow: "bg-orange-400/15",
      iconBg: "bg-orange-50",
      iconText: "text-orange-600",
      line: "from-orange-400 to-orange-500",
    },
  },
  {
    Icon: Lock,
    title: "Keamanan Siber",
    description: "Kriptografi, keamanan jaringan, forensik digital.",
    theme: {
      border: "border-blue-200/60",
      glow: "bg-blue-400/15",
      iconBg: "bg-blue-50",
      iconText: "text-blue-600",
      line: "from-blue-400 to-blue-500",
    },
  },
  {
    Icon: Laptop,
    title: "Rekayasa Perangkat Lunak",
    description:
      "Software engineering, arsitektur sistem, metodologi pengembangan.",
    theme: {
      border: "border-orange-200/60",
      glow: "bg-orange-400/15",
      iconBg: "bg-orange-50",
      iconText: "text-orange-600",
      line: "from-orange-400 to-orange-500",
    },
  },
  {
    Icon: Database,
    title: "Sistem Informasi",
    description: "Basis data, sistem ERP, analisis informasi bisnis.",
    theme: {
      border: "border-blue-200/60",
      glow: "bg-blue-400/15",
      iconBg: "bg-blue-50",
      iconText: "text-blue-600",
      line: "from-blue-400 to-blue-500",
    },
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q", keyword.trim());
    navigate(`/katalog${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative w-full bg-slate-950 text-white overflow-hidden pb-12 sm:pb-16 md:pb-24">
        {/* Scoped Animations */}
        <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .animate-fade-in {
            animation: fadeSlideIn 0.8s ease-out forwards;
            opacity: 0;
          }
          .animate-marquee {
            animation: marquee 25s linear infinite; 
          }
          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-300 { animation-delay: 0.3s; }
          .delay-400 { animation-delay: 0.4s; }
          .delay-500 { animation-delay: 0.5s; }
        `}</style>

        {/* Background Masking */}
        <div
          className="absolute inset-0 z-0 bg-no-repeat opacity-40 bg-cover md:bg-cover bg-[center_top_1rem] md:bg-center"
          style={{
            backgroundImage: `url(${bgHero})`,
            // Masking diubah agar bagian bawah gambar memudar lebih cepat (mulai 50%) khusus untuk HP
            maskImage:
              "linear-gradient(180deg, black 0%, black 50%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, black 0%, black 50%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* Pendaran Cahaya (Glow) di Tengah */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-orange-500/15 blur-[120px] rounded-full pointer-events-none z-0" />

        {/* 2. Ruang Konten */}
        {/* Ruang Konten Utama (Mobile-First Grid) */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-20 sm:px-6 md:pt-32 lg:px-8 min-h-[50vh]">
          {/* text-center di HP, text-left di Laptop (lg) */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8 items-center text-center lg:text-left">
            {/* KOLOM KIRI (TEKS & FORM PENCARIAN) */}
            {/* items-center di HP agar di tengah, items-start di Laptop (lg) agar rata kiri */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start justify-center space-y-6 lg:space-y-8 pt-4 lg:pt-8">
              {/* Heading: Teks lebih kecil di HP (text-4xl), membesar di Laptop (lg:text-7xl) */}
              <h1 className="animate-fade-in delay-200 text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.15] text-white">
                Satu Pintu untuk Seluruh <br className="hidden sm:block" />
                <span className="bg-gradient-to-br from-white via-slate-200 to-orange-500 bg-clip-text text-transparent">
                  Arsip Akademik
                </span>
              </h1>

              {/* Deskripsi: Diberi padding kiri-kanan (px-2) di HP agar tidak menabrak tepi layar */}
              <p className="animate-fade-in delay-300 max-w-xl text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-light px-2 lg:px-0">
                Telusuri skripsi dan arsip akademik Program Studi Ilmu Komputer.
                Ajukan peminjaman digital, ambil fisik di perpustakaan tanpa
                birokrasi rumit.
              </p>

              {/* Form Pencarian Glassmorphism */}
              <div className="animate-fade-in delay-400 w-full max-w-2xl mt-6 lg:mt-8">
                {/* Bar Input: Ditumpuk atas-bawah di HP (flex-col), Sejajar di Tablet/Laptop (sm:flex-row) */}
                <form
                  onSubmit={handleSearch}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-0 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-full p-2 hover:border-orange-500/50 hover:bg-slate-900/60 transition-all shadow-2xl"
                >
                  <div className="flex items-center gap-3 pl-3 sm:pl-4 flex-1 min-w-0">
                    <Search className="h-5 w-5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      // Placeholder diubah statis agar lebih jelas
                      placeholder="Cari judul skripsi, penulis, atau topik..."
                      className="bg-transparent border-none outline-none text-white w-full placeholder:text-slate-500 text-sm sm:text-base min-w-0 py-2"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white rounded-xl sm:rounded-full px-8 h-12 text-sm sm:text-base font-bold transition-transform hover:scale-105 shadow-orange-500/25 shadow-lg shrink-0"
                  >
                    Telusuri
                  </Button>
                </form>
              </div>
            </div>

            {/* --- FASE 2B: KOLOM KANAN (Akan diisi di Fase 3) --- */}
            {/* hidden di HP agar tidak memenuhi layar, muncul saat layar seukuran Laptop (lg:block) */}
            <div className="lg:col-span-5 space-y-6 lg:mt-12 hidden lg:block text-slate-500 text-center animate-fade-in delay-500">
              Menunggu konten Kartu Statistik Fase 3...
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTIONS AFTER HERO WRAPPER ─────────────────────────────────────── */}
      <div className="relative w-full bg-slate-50/40 pb-12">
        {/* Background Visuals */}
        <div className="absolute top-0 -left-[20%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] bg-blue-200/20 blur-[120px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-1/4 -right-[20%] w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] bg-orange-200/20 blur-[150px] rounded-full pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

        {/* ── 2. TRUST BAR ────────────────────────────────────────────────────── */}
        <section
          className="relative z-20 -mt-6 px-4"
          aria-label="Keunggulan Sistem"
        >
          <div className="container mx-auto max-w-5xl">
            <div className="bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-sm rounded-2xl py-4 px-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-12">
              {TRUST_ITEMS.map(({ Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-slate-700"
                >
                  <Icon
                    className="h-4 w-4 text-orange-500 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-semibold whitespace-nowrap">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. INTRO ────────────────────────────────────────────────────────── */}
        <section className="relative z-10 pt-12 pb-8 md:pt-20 md:pb-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white/60 backdrop-blur-lg border border-slate-200/50 rounded-[2rem] p-8 md:p-12 text-center shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/30 blur-[60px] rounded-full pointer-events-none -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/30 blur-[60px] rounded-full pointer-events-none -ml-20 -mb-20" />

              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-5 leading-snug">
                  Infrastruktur Pengetahuan untuk{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500">
                    Sivitas Akademika
                  </span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-light max-w-2xl mx-auto">
                  Perpustakaan ILKOM adalah sistem pengelolaan dan akses arsip
                  akademik terpadu untuk Program Studi Ilmu Komputer,
                  Universitas Nusa Cendana. Dari skripsi hingga laporan
                  penelitian — semuanya dapat ditelusuri, dipinjam, dan
                  dikembalikan melalui satu platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. FEATURE BENTO GRID ───────────────────────────────────────────── */}
        <section className="relative z-10 py-10 md:py-16 bg-white/40 border-y border-slate-200/30">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-10">
              <p className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-2">
                Fitur Utama
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
                Dirancang untuk Kemudahan Akses
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {FEATURES.map(({ Icon, title, description, featured }) => (
                <Card
                  key={title}
                  className={`group relative overflow-hidden rounded-[2rem] border p-8 md:p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col
                    ${
                      featured
                        ? "bg-blue-50 border-blue-100 hover:border-blue-300/50 shadow-md shadow-blue-900/5 md:-translate-y-2 md:hover:-translate-y-3"
                        : "bg-white/90 backdrop-blur-sm border-slate-200/80 hover:border-orange-300/60 shadow-sm"
                    }`}
                >
                  <div
                    className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-[60px] -mr-10 -mt-10 pointer-events-none transition-opacity duration-500 ${featured ? "bg-blue-400/20 opacity-0 group-hover:opacity-100" : "bg-blue-500/10 opacity-0 group-hover:opacity-100"}`}
                  />

                  <CardHeader className="p-0 mb-6 shrink-0">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center relative z-10
                        ${
                          featured
                            ? "bg-orange-100 text-orange-600 shadow-sm border border-orange-200"
                            : "bg-orange-50 text-orange-500 border border-orange-100"
                        }`}
                    >
                      <Icon size={32} weight="duotone" aria-hidden="true" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 flex-1 relative z-10 flex flex-col">
                    <CardTitle
                      className={`text-lg md:text-xl font-bold mb-3 ${featured ? "text-blue-950" : "text-slate-900"}`}
                    >
                      {title}
                    </CardTitle>
                    <CardDescription
                      className={`text-sm leading-relaxed flex-1 ${featured ? "text-blue-900/70" : "text-slate-600"}`}
                    >
                      {description}
                    </CardDescription>
                  </CardContent>
                  {!featured && (
                    <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. TOPIC CATEGORIES ─────────────────────────────────────────────── */}
        <section className="relative z-10 py-12 md:py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-2">
                  Telusuri Topik
                </p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
                  Katalog Penelitian
                </h2>
              </div>
              <Button
                asChild
                variant="link"
                className="text-orange-600 hover:text-orange-700 p-0 h-auto font-semibold"
              >
                <Link to="/katalog" className="flex items-center gap-1">
                  Lihat Semua Topik <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {CATEGORIES.map(({ Icon, title, description, theme }) => (
                <Link
                  key={title}
                  to="/katalog"
                  className={`group relative overflow-hidden rounded-[1.5rem] border bg-white/90 backdrop-blur-sm p-6 flex flex-col gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-white ${theme.border}`}
                >
                  <div
                    className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${theme.line} opacity-60 group-hover:opacity-100 transition-opacity`}
                  />
                  <div
                    className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl transition-opacity pointer-events-none opacity-60 group-hover:opacity-100 ${theme.glow}`}
                  />

                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all relative z-10 ${theme.iconBg}`}
                  >
                    <Icon
                      className={`h-5 w-5 transition-colors ${theme.iconText}`}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1 relative z-10">
                    <h3 className="text-base font-bold text-slate-900 mb-1.5 transition-colors group-hover:text-slate-800">
                      {title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {description}
                    </p>
                  </div>
                  <div className="flex justify-between items-center relative z-10 pt-4 border-t border-slate-100/60 mt-4">
                    <span className="text-xs font-bold tracking-wide text-slate-700 group-hover:text-slate-900 transition-colors">
                      Jelajahi Topik
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${theme.iconBg} border border-transparent group-hover:border-slate-200/50 group-hover:shadow-sm`}
                    >
                      <ArrowRight
                        className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${theme.iconText}`}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. CLOSING CTA ──────────────────────────────────────────────────── */}
        <section className="relative z-10 pt-8 pb-16 md:pt-10 md:pb-24 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-white/70 backdrop-blur-xl px-6 py-14 sm:py-20 text-center border border-white/60 shadow-xl shadow-slate-200/50 ring-1 ring-inset ring-slate-100/50">
              {/* CTA Background Effects */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-200/40 blur-[120px] rounded-full pointer-events-none translate-x-1/4 -translate-y-1/4 z-0" />
              <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-200/40 blur-[120px] rounded-full pointer-events-none -translate-x-1/4 translate-y-1/4 z-0" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white border border-slate-100 shadow-sm text-orange-500 mb-8 relative">
                  <div className="absolute inset-0 bg-orange-500/10 rounded-2xl blur-lg pointer-events-none" />
                  <Books
                    size={40}
                    weight="duotone"
                    className="relative z-10"
                    aria-hidden="true"
                  />
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-5 leading-tight max-w-2xl">
                  Mulai Telusuri Arsip Akademik Anda
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-slate-500 mb-10 font-light leading-relaxed max-w-xl">
                  Dibangun oleh mahasiswa, untuk mahasiswa. Akses katalog
                  lengkap atau pelajari cara meminjam arsip secara mandiri.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white rounded-full px-10 h-12 md:h-14 text-sm md:text-base font-bold shadow-lg shadow-orange-500/20 transition-transform hover:scale-105"
                  >
                    <Link to="/katalog">Mulai Pencarian</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 px-10 h-12 md:h-14 text-sm md:text-base font-bold transition-transform hover:scale-105 shadow-sm"
                  >
                    <Link to="/panduan">Baca Panduan</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

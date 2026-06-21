import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Search,
  BookOpen,
  BookMarked,
  History,
  Zap,
  ShieldCheck,
  Cpu,
  Lock,
  Laptop,
  Database,
  ArrowRight,
} from "lucide-react";
import bgHero from "../assets/hero-bg.png";

// ── Data ──────────────────────────────────────────────────────────────────────

const SEARCH_TABS = [
  { id: "semua", label: "Semua" },
  { id: "judul", label: "Judul" },
  { id: "penulis", label: "Penulis" },
  { id: "topik", label: "Topik" },
  { id: "tahun", label: "Tahun" },
];

const TRUST_ITEMS = [
  { Icon: BookMarked, label: "Arsip Akademik" },
  { Icon: Search,     label: "Pencarian Cepat" },
  { Icon: BookOpen,   label: "Peminjaman Mandiri" },
  { Icon: History,    label: "Riwayat Terlacak" },
];

const FEATURES = [
  {
    Icon: Search,
    title: "Pencarian Kilat & Presisi",
    description:
      "Telusuri judul, penulis, dan topik secara menyeluruh. Filter tahun dan kategori tersedia untuk hasil yang lebih spesifik.",
    featured: false,
  },
  {
    Icon: Zap,
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
    featured: false,
  },
];

const CATEGORIES = [
  {
    Icon: Cpu,
    title: "Kecerdasan Buatan",
    description: "Machine learning, deep learning, computer vision, NLP.",
  },
  {
    Icon: Lock,
    title: "Keamanan Siber",
    description: "Kriptografi, keamanan jaringan, forensik digital.",
  },
  {
    Icon: Laptop,
    title: "Rekayasa Perangkat Lunak",
    description: "Software engineering, arsitektur sistem, metodologi pengembangan.",
  },
  {
    Icon: Database,
    title: "Sistem Informasi",
    description: "Basis data, sistem ERP, analisis informasi bisnis.",
  },
];



// ── Component ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [activeTab, setActiveTab] = useState("semua");
  const [keyword, setKeyword]     = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q", keyword.trim());
    if (activeTab !== "semua") params.set("type", activeTab);
    navigate(`/katalog${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative w-full min-h-[92vh] flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: `url(${bgHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-label="Hero — Perpustakaan ILKOM"
      >
        {/* Overlays */}
        <div className="absolute inset-0 bg-slate-950/82 z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-transparent to-slate-950/70 z-0 pointer-events-none" />
        <div
          className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[280px] bg-orange-500/12 blur-[130px] rounded-full z-0 pointer-events-none"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 flex flex-col items-center w-full">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-semibold tracking-widest uppercase mb-7">
            <BookMarked className="h-3.5 w-3.5" aria-hidden="true" />
            Perpustakaan Digital Ilmu Komputer
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-5 max-w-4xl mx-auto">
            Satu Pintu untuk Seluruh{" "}
            <span className="text-orange-500">Arsip Akademik</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed px-2">
            Telusuri skripsi dan arsip akademik Program Studi Ilmu Komputer.
            Ajukan peminjaman digital, ambil fisik di perpustakaan.
          </p>

          {/* Search Panel */}
          <div className="w-full max-w-2xl mx-auto">
            {/* Tabs */}
            <div
              className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 justify-center"
              style={{ scrollbarWidth: "none" }}
              role="tablist"
              aria-label="Filter pencarian"
            >
              {SEARCH_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500
                    ${activeTab === tab.id
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                      : "bg-slate-800/70 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Input row */}
            <form
              onSubmit={handleSearch}
              role="search"
              className="flex flex-col sm:flex-row gap-3 sm:gap-0 bg-slate-900/65 backdrop-blur-md border border-slate-600/50 rounded-2xl sm:rounded-full p-2 hover:border-orange-500/40 transition-colors"
            >
              <label htmlFor="hero-search" className="sr-only">
                Cari arsip berdasarkan{" "}
                {SEARCH_TABS.find((t) => t.id === activeTab)?.label ?? "kata kunci"}
              </label>
              <div className="flex items-center gap-3 pl-2 sm:pl-4 flex-1 min-w-0">
                <Search className="h-5 w-5 text-slate-400 shrink-0" aria-hidden="true" />
                <input
                  id="hero-search"
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={`Cari ${
                    SEARCH_TABS.find((t) => t.id === activeTab)?.label.toLowerCase() ??
                    "kata kunci"
                  }...`}
                  className="bg-transparent border-none outline-none text-white w-full placeholder:text-slate-500 text-sm sm:text-base min-w-0 py-2"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white rounded-xl sm:rounded-full px-8 h-11 sm:h-12 text-sm sm:text-base font-bold transition-transform hover:scale-105 shadow-orange-500/20 shadow-lg shrink-0"
              >
                Telusuri
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* ── 2. TRUST BAR ────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-5 px-4" aria-label="Keunggulan Sistem">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-14">
            {TRUST_ITEMS.map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-slate-600">
                <Icon className="h-4 w-4 text-orange-500 shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium whitespace-nowrap">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. INTRO ────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-4">
            Tentang Perpustakaan ILKOM
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-snug">
            Infrastruktur Pengetahuan untuk Sivitas Akademika
          </h2>
          <p className="text-base sm:text-lg text-slate-500 leading-relaxed font-light max-w-2xl mx-auto">
            Perpustakaan ILKOM adalah sistem pengelolaan dan akses arsip akademik terpadu
            untuk Program Studi Ilmu Komputer, Universitas Nusa Cendana. Dari skripsi
            hingga laporan penelitian — semuanya dapat ditelusuri, dipinjam, dan dikembalikan
            melalui satu platform.
          </p>
        </div>
      </section>

      {/* ── 4. FEATURE BENTO GRID ───────────────────────────────────────────── */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 md:mb-14">
            <p className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-3">
              Fitur Utama
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
              Dirancang untuk Kemudahan Akses
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map(({ Icon, title, description, featured }) => (
              <div
                key={title}
                className={`rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl
                  ${featured
                    ? "bg-slate-900 border-slate-700 hover:border-orange-500/60"
                    : "bg-white border-slate-200 hover:border-orange-300/60"
                  }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5
                    ${featured
                      ? "bg-orange-500 text-white"
                      : "bg-orange-50 text-orange-500"
                    }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${featured ? "text-white" : "text-slate-900"}`}>
                  {title}
                </h3>
                <p className={`text-sm leading-relaxed ${featured ? "text-slate-400" : "text-slate-500"}`}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. TOPIC CATEGORIES ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 md:mb-14">
            <p className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-3">
              Telusuri Topik
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
              Topik Penelitian Populer
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIES.map(({ Icon, title, description }) => (
              <Link
                key={title}
                to="/katalog"
                className="group rounded-2xl border border-slate-200 bg-white p-6 flex flex-col gap-4 hover:border-orange-400/60 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-orange-50 flex items-center justify-center transition-colors">
                  <Icon
                    className="h-6 w-6 text-slate-600 group-hover:text-orange-500 transition-colors"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
                </div>
                <div className="flex justify-end">
                  <ArrowRight
                    className="h-4 w-4 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ── 7. CLOSING CTA ──────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-4 bg-white text-center">
        <div className="container mx-auto max-w-3xl flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-orange-50 border border-orange-200 text-orange-500 mb-8">
            <BookOpen className="h-8 w-8 md:h-10 md:w-10" aria-hidden="true" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-5 leading-tight">
            Mulai Telusuri Arsip Akademik Anda
          </h2>
          <p className="text-base sm:text-lg text-slate-500 mb-10 font-light leading-relaxed max-w-xl px-2">
            Dibangun oleh mahasiswa, untuk mahasiswa. Akses katalog lengkap atau
            pelajari cara meminjam arsip secara mandiri.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white rounded-full px-10 h-14 text-base font-bold shadow-xl shadow-orange-500/20 transition-transform hover:scale-105"
            >
              <Link to="/katalog">Mulai Pencarian</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full border-slate-200 text-slate-700 hover:bg-slate-50 px-10 h-14 text-base font-bold transition-transform hover:scale-105"
            >
              <Link to="/panduan">Baca Panduan</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}

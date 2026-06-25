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

const SEARCH_TABS = [
  { id: "semua", label: "Semua" },
  { id: "judul", label: "Judul" },
  { id: "penulis", label: "Penulis" },
  { id: "topik", label: "Topik" },
  { id: "tahun", label: "Tahun" },
];

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
  const [activeTab, setActiveTab] = useState("semua");
  const [keyword, setKeyword] = useState("");
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
        <div className="absolute inset-0 bg-slate-950/50 z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-transparent to-slate-950/50 z-0 pointer-events-none" />
        <div
          className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[280px] bg-orange-500/12 blur-[130px] rounded-full z-0 pointer-events-none"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 flex flex-col items-center w-full">
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
                    ${
                      activeTab === tab.id
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
                {SEARCH_TABS.find((t) => t.id === activeTab)?.label ??
                  "kata kunci"}
              </label>
              <div className="flex items-center gap-3 pl-2 sm:pl-4 flex-1 min-w-0">
                <Search
                  className="h-5 w-5 text-slate-400 shrink-0"
                  aria-hidden="true"
                />
                <input
                  id="hero-search"
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={`Cari ${
                    SEARCH_TABS.find(
                      (t) => t.id === activeTab,
                    )?.label.toLowerCase() ?? "kata kunci"
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

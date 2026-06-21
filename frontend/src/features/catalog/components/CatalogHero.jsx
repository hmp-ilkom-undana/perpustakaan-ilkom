import { Archive, Search } from "lucide-react";

export default function CatalogHero({ totalBooks }) {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 py-12 text-white md:py-16">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/80" />
      <div className="relative z-10 container mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/15 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-300">
            <Archive className="h-3.5 w-3.5" aria-hidden="true" />
            Katalog Arsip
          </div>
          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            Telusuri arsip akademik Ilmu Komputer.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Cari skripsi dan arsip berdasarkan judul, penulis, topik, tahun,
            dan status ketersediaan.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5">
              <Search className="h-4 w-4 text-orange-300" aria-hidden="true" />
              {totalBooks} arsip terindeks
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

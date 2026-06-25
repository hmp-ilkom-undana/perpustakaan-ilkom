import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Folder, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useArchiveDetail } from "../hooks/useArchiveDetail";
import StatusBadge from "../components/StatusBadge";
import CatalogState from "../components/CatalogState";

export default function ArchiveDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { book, error, isLoading } = useArchiveDetail(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-10 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button variant="ghost" onClick={() => navigate("/katalog")} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Katalog
          </Button>
          <CatalogState type="loading" />
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-slate-50 pt-10 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button variant="ghost" onClick={() => navigate("/katalog")} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Katalog
          </Button>
          <CatalogState type="error" message={error || "Arsip tidak ditemukan."} />
        </div>
      </div>
    );
  }

  const isAvailable = book.status === "tersedia" || book.status === "TERSEDIA";
  const archiveCode = `SKR-${book.year}-${book.id.substring(0, 4).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="container mx-auto max-w-5xl">
        <Button variant="ghost" onClick={() => navigate("/katalog")} className="mb-6 -ml-4 text-slate-600 hover:text-slate-900">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Katalog
        </Button>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            
            {/* Left Column: Title & Info */}
            <div className="p-8 md:p-12 bg-gradient-to-br from-slate-50/30 to-white">
              <div className="space-y-6 mb-12">
                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-[1.2] tracking-tight">
                  {book.title}
                </h1>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Folder className="h-5 w-5 text-slate-400" />
                  Informasi Arsip
                </h3>
                
                {/* Compact Metadata Card */}
                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 border-b border-slate-100">
                    <CompactMetadata label="Penulis" value={book.author} />
                    <CompactMetadata label="Tahun" value={book.year} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 border-b border-slate-100">
                    <CompactMetadata label="Kategori" value={book.category} />
                    <CompactMetadata label="Jenis Arsip" value={book.archiveType || "Skripsi"} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                    <CompactMetadata label="Program Studi" value="Ilmu Komputer" />
                    <CompactMetadata label="Fakultas" value="Sains dan Teknik" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Highlight & Action */}
            <div className="p-8 md:p-12 bg-slate-50/50 flex flex-col justify-start">
              <div className="space-y-8 sticky top-8">
                
                {/* Status & Identity */}
                <div className="flex flex-col gap-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Status & Kode Arsip</p>
                  <div className="flex flex-wrap items-center gap-3">
                     <StatusBadge status={book.status} />
                     <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-full font-mono tracking-widest border border-slate-200 shadow-sm">
                      {archiveCode}
                     </span>
                  </div>
                </div>

                {/* Highlight Lokasi Rak */}
                <div className="bg-orange-50/80 border border-orange-200 p-6 rounded-2xl shadow-sm relative overflow-hidden group hover:bg-orange-50 transition-colors">
                  <div className="absolute -top-4 -right-4 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <MapPin className="h-32 w-32 text-orange-600" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-5 w-5 text-orange-600" />
                      <h3 className="text-orange-900 font-bold uppercase tracking-wider text-xs">Lokasi Arsip</h3>
                    </div>
                    <p className="text-orange-950 font-extrabold text-xl leading-tight">
                      {book.shelfLocation || "Lokasi belum tersedia"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2">
                  <Button
                    type="button"
                    disabled={!isAvailable}
                    className={`w-full h-14 rounded-xl font-bold text-base transition-all duration-200 ${
                      isAvailable
                        ? "bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 shadow-orange-500/20"
                        : "bg-slate-200 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <BookOpen className="mr-2 h-5 w-5" aria-hidden="true" />
                    {isAvailable ? "Ajukan Peminjaman" : "Sedang Dipinjam"}
                  </Button>
                  {!isAvailable && (
                    <p className="text-center text-xs text-slate-500 mt-4 font-medium px-4">
                      Arsip ini sedang dipinjam dan belum tersedia.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompactMetadata({ label, value }) {
  return (
    <div className="p-4 bg-white hover:bg-slate-50/50 transition-colors">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
        {label}
      </p>
      <p className="font-semibold text-slate-800 text-sm">{value}</p>
    </div>
  );
}

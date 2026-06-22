import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, CalendarDays, Folder, UserRound, MapPin } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="container mx-auto max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/katalog")} className="mb-6 -ml-4 text-slate-600 hover:text-slate-900">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Katalog
        </Button>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header Section */}
          <div className="p-8 md:p-12 border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-white">
            <div className="flex flex-col md:flex-row gap-6 md:items-start">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-orange-100 bg-orange-50 text-3xl font-extrabold text-orange-600 shadow-sm">
                {String(book.title || "A").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 space-y-4">
                <StatusBadge status={book.status} />
                <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                  {book.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <DetailCard icon={UserRound} label="Penulis" value={book.author} />
              <DetailCard icon={CalendarDays} label="Tahun" value={book.year} />
              <DetailCard icon={Folder} label="Kategori" value={book.category} />
              <DetailCard icon={MapPin} label="Lokasi Rak" value={book.shelfLocation || "Lokasi belum tersedia"} />
            </div>

            {/* Action Panel */}
            <div className="flex justify-end border-t border-slate-100 pt-8 mt-8">
              <Button
                type="button"
                disabled={!isAvailable}
                className={`w-full md:w-auto h-12 px-8 rounded-xl font-bold text-base transition-all duration-200 ${
                  isAvailable
                    ? "bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 shadow-orange-500/20"
                    : "bg-slate-100 text-slate-500 cursor-not-allowed"
                }`}
              >
                <BookOpen className="mr-2 h-5 w-5" aria-hidden="true" />
                {isAvailable ? "Ajukan Peminjaman" : "Sedang Dipinjam"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex items-start gap-4 hover:shadow-sm transition-shadow duration-200">
      <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
        <Icon className="h-5 w-5 text-slate-500" aria-hidden="true" />
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
          {label}
        </p>
        <p className="font-semibold text-slate-800 leading-snug">{value}</p>
      </div>
    </div>
  );
}

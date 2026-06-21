import { BookOpen, CalendarDays, Folder, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBookYear, normalizeBookStatus } from "../utils/catalogFormatters.js";
import StatusBadge from "./StatusBadge.jsx";
import { useNavigate } from "react-router-dom";

export default function ArchiveCard({ book }) {
  const status = normalizeBookStatus(book.status);
  const isAvailable = status === "tersedia";
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/katalog/${book.id}`);
  };

  const handleActionClick = (e) => {
    e.stopPropagation(); // prevent card click from firing twice
    navigate(`/katalog/${book.id}`);
  };

  return (
    <article 
      onClick={handleCardClick}
      className="group cursor-pointer flex min-h-[260px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
    >
      <div className="flex items-start gap-4 border-b border-slate-100 bg-slate-50 p-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-xl font-extrabold text-orange-600">
          {String(book.title || "A").charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <StatusBadge status={status} />
          <h2 className="mt-3 line-clamp-2 text-base font-extrabold leading-snug text-slate-900 group-hover:text-orange-600 transition-colors">
            {book.title}
          </h2>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <MetaRow icon={UserRound} label="Penulis" value={book.author} />
        <MetaRow icon={CalendarDays} label="Tahun" value={formatBookYear(book.year)} />
        <MetaRow icon={Folder} label="Kategori" value={book.category} />

        <div className="mt-auto pt-3">
          <Button
            type="button"
            disabled={!isAvailable}
            onClick={handleActionClick}
            className={`h-10 w-full rounded-xl font-bold ${
              isAvailable
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            {isAvailable ? "Ajukan Peminjaman" : "Sedang Dipinjam"}
          </Button>
        </div>
      </div>
    </article>
  );
}

function MetaRow({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-2 text-sm">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="break-words font-semibold text-slate-700">{value}</p>
      </div>
    </div>
  );
}

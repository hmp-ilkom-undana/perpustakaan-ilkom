import { Loader2, Search } from "lucide-react";
import { ArchiveCard } from "./ArchiveCard";
import { StudentArchiveItem } from "@/hooks/useStudentCatalog";

interface CatalogGridProps {
  archives: StudentArchiveItem[];
  isLoading: boolean;
  onSelectArchive: (archive: StudentArchiveItem) => void;
}

export function CatalogGrid({
  archives,
  isLoading,
  onSelectArchive,
}: CatalogGridProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
        <p className="text-xs font-bold text-slate-500">Memuat katalog arsip...</p>
      </div>
    );
  }

  if (archives.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 bg-white border-2 border-blue-900 border-dashed rounded-lg shadow-[4px_4px_0px_#1E3A8A] text-center">
        <div className="bg-orange-100 border-2 border-blue-900 w-14 h-14 rounded-lg flex items-center justify-center mb-3 shadow-[2px_2px_0px_#1E3A8A]">
          <Search className="w-7 h-7 text-blue-950" />
        </div>
        <p className="text-base font-black text-blue-950">
          Tidak Ada Arsip yang Sesuai
        </p>
        <p className="text-xs font-semibold text-slate-500 mt-1 max-w-sm">
          Coba ubah kata kunci pencarian atau kombinasi filter jenis arsip, kategori, dan ketersediaan.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-4 sm:px-0">
      {archives.map((archive) => (
        <ArchiveCard
          key={archive.id}
          id={archive.id}
          title={archive.title}
          author={archive.author}
          year={archive.year}
          archiveType={archive.archiveType}
          category={archive.category}
          quantity={archive.quantity}
          reservedQuantity={archive.reservedQuantity}
          status={archive.status}
          userBorrowStatus={archive.userBorrowStatus}
          isRequestedByCurrentUser={archive.isRequestedByCurrentUser}
          onClick={() => onSelectArchive(archive)}
        />
      ))}
    </div>
  );
}

import { Button } from "@/components/ui/button";

interface KatalogPaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export function KatalogPagination({
  currentPage,
  totalPages,
  totalRecords,
  isLoading,
  onPageChange,
}: KatalogPaginationProps) {
  return (
    <div className="p-4 border-t-2 border-blue-900 flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-50">
      <div className="flex items-center gap-2 text-sm text-blue-950 font-bold">
        <span className="uppercase tracking-wider text-xs text-slate-600 font-bold">
          Total <span className="text-blue-900 font-black">{totalRecords}</span> Arsip
        </span>
        <span className="text-xs text-slate-300">•</span>
        <span className="text-xs text-slate-600 font-semibold">
          Halaman {currentPage} dari {totalPages}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || isLoading}
          className="font-bold"
        >
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || isLoading}
          className="font-bold"
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  );
}

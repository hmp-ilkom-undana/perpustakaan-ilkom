import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CatalogPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-2"
      aria-label="Pagination katalog"
    >
      <Button
        type="button"
        variant="outline"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="h-10 rounded-xl"
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </Button>

      {pages.map((page) => (
        <Button
          key={page}
          type="button"
          variant={page === currentPage ? "default" : "outline"}
          onClick={() => onPageChange(page)}
          className={`h-10 w-10 rounded-xl ${
            page === currentPage
              ? "bg-slate-900 text-white hover:bg-slate-800"
              : "border-slate-200 text-slate-700"
          }`}
          aria-current={page === currentPage ? "page" : undefined}
          aria-label={`Halaman ${page}`}
        >
          {page}
        </Button>
      ))}

      <Button
        type="button"
        variant="outline"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="h-10 rounded-xl"
        aria-label="Halaman berikutnya"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </nav>
  );
}

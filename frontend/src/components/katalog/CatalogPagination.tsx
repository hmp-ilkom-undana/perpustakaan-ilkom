import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CatalogPaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function CatalogPagination({
  currentPage,
  totalPages,
  total,
  onPageChange,
}: CatalogPaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers to display with smart ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "ellipsis", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t-2 border-blue-900 w-full">
      {/* Informasi Jumlah Arsip */}
      <p className="text-xs font-bold text-slate-500 order-2 sm:order-1 text-center sm:text-left">
        Menampilkan halaman <b className="text-blue-950 font-black">{currentPage}</b> dari{" "}
        <b className="text-blue-950 font-black">{totalPages}</b> ({total} Total Arsip)
      </p>

      {/* Kontrol Navigasi Paginasi */}
      <div className="order-1 sm:order-2">
        <Pagination>
          <PaginationContent>
            {/* Tombol Sebelumnya */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={currentPage === 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"}
              />
            </PaginationItem>

            {/* Nomor Halaman */}
            {pages.map((pageNum, idx) => {
              if (pageNum === "ellipsis") {
                return (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              const pageNumber = Number(pageNum);
              const isActive = pageNumber === currentPage;

              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={isActive}
                    onClick={() => onPageChange(pageNumber)}
                    className="cursor-pointer"
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {/* Tombol Selanjutnya */}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={currentPage === totalPages ? "opacity-50 pointer-events-none" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

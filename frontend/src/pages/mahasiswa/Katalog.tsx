import { Library } from "lucide-react";
import { useStudentCatalog } from "@/hooks/useStudentCatalog";
import {
  CatalogFilterBar,
  CatalogGrid,
  CatalogPagination,
  ArchiveDetailDialog,
} from "@/components/katalog";

export default function Katalog() {
  const {
    searchInput,
    setSearchInput,
    filterType,
    filterCategory,
    filterAvailability,
    handleFilterTypeChange,
    handleFilterCategoryChange,
    handleFilterAvailabilityChange,
    currentPage,
    setCurrentPage,
    selectedArchive,
    setSelectedArchive,
    archives,
    meta,
    isLoading,
  } = useStudentCatalog();

  return (
    <div className="flex flex-col gap-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Header & Filter Bar */}
      <div className="flex flex-col gap-5 pb-6 mb-2 border-b-2 border-blue-900 px-4 sm:px-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 text-white border-2 border-blue-900 rounded-lg flex items-center justify-center shadow-[2px_2px_0px_#1E3A8A] shrink-0">
            <Library className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-950">
              Katalog Arsip
            </h1>
            <p className="text-slate-500 text-xs font-semibold mt-0.5">
              Cari dan ajukan peminjaman arsip tugas akhir yang Anda butuhkan.
            </p>
          </div>
        </div>

        <CatalogFilterBar
          searchInput={searchInput}
          onSearchChange={setSearchInput}
          filterType={filterType}
          onTypeChange={handleFilterTypeChange}
          filterCategory={filterCategory}
          onCategoryChange={handleFilterCategoryChange}
          filterAvailability={filterAvailability}
          onAvailabilityChange={handleFilterAvailabilityChange}
        />
      </div>

      {/* 2. Grid Koleksi Arsip */}
      <CatalogGrid
        archives={archives}
        isLoading={isLoading}
        onSelectArchive={setSelectedArchive}
      />

      {/* 3. Paginasi Halaman */}
      {!isLoading && archives.length > 0 && (
        <CatalogPagination
          currentPage={currentPage}
          totalPages={meta.totalPages}
          total={meta.total}
          onPageChange={setCurrentPage}
        />
      )}

      {/* 4. Dialog Detail & Pengajuan Peminjaman */}
      <ArchiveDetailDialog
        isOpen={selectedArchive !== null}
        onClose={() => setSelectedArchive(null)}
        archive={selectedArchive}
      />
    </div>
  );
}

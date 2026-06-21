import { useEffect, useMemo } from "react";
import ArchiveGrid from "../components/ArchiveGrid.jsx";
import CatalogHero from "../components/CatalogHero.jsx";
import CatalogPagination from "../components/CatalogPagination.jsx";
import CatalogState from "../components/CatalogState.jsx";
import PopularTags from "../components/PopularTags.jsx";
import SearchFilterBar from "../components/SearchFilterBar.jsx";
import { CATALOG_PAGE_SIZE } from "../constants/catalogOptions.js";
import { useBooks } from "../hooks/useBooks.js";
import {
  filterBooks,
  paginateBooks,
  useCatalogFilters,
} from "../hooks/useCatalogFilters.js";

export default function CatalogPage() {
  const { books, error, isLoading } = useBooks();
  const { filters, setFilter, setPage, resetFilters } = useCatalogFilters();

  const categoryOptions = useMemo(() => {
    const categories = [...new Set(books.map((book) => book.category).filter(Boolean))];
    return [
      { value: "semua", label: "Semua Kategori" },
      ...categories.sort().map((category) => ({ value: category, label: category })),
    ];
  }, [books]);

  const yearOptions = useMemo(() => {
    const years = [...new Set(books.map((book) => book.year).filter(Boolean))];
    return [
      { value: "semua", label: "Semua Tahun" },
      ...years
        .sort((a, b) => Number(b) - Number(a))
        .map((year) => ({ value: String(year), label: String(year) })),
    ];
  }, [books]);

  const filteredBooks = useMemo(
    () => filterBooks(books, filters),
    [books, filters],
  );
  const paginated = useMemo(
    () => paginateBooks(filteredBooks, filters.page, CATALOG_PAGE_SIZE),
    [filteredBooks, filters.page],
  );
  const popularTags = categoryOptions
    .filter((option) => option.value !== "semua")
    .slice(0, 6)
    .map((option) => option.value);

  useEffect(() => {
    if (filters.page !== paginated.currentPage) {
      setPage(paginated.currentPage);
    }
  }, [filters.page, paginated.currentPage, setPage]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">
      <CatalogHero totalBooks={books.length} />

      <section className="px-4 py-8 md:py-10">
        <div className="container mx-auto max-w-6xl space-y-6">
          <SearchFilterBar
            filters={filters}
            categoryOptions={categoryOptions}
            yearOptions={yearOptions}
            onChange={setFilter}
            onReset={resetFilters}
          />

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <PopularTags
              tags={popularTags}
              activeTag={filters.category}
              onSelect={(tag) => setFilter("category", tag)}
            />
            <p className="text-sm font-semibold text-slate-500">
              {filteredBooks.length} hasil
            </p>
          </div>

          {isLoading ? (
            <CatalogState type="loading" />
          ) : error ? (
            <CatalogState type="error" message={error} />
          ) : filteredBooks.length === 0 ? (
            <CatalogState type="empty" onReset={resetFilters} />
          ) : (
            <>
              <ArchiveGrid books={paginated.items} />
              <CatalogPagination
                currentPage={paginated.currentPage}
                totalPages={paginated.totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}

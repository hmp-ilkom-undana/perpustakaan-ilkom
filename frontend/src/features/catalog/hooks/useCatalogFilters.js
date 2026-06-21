import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { DEFAULT_FILTERS } from "../constants/catalogOptions.js";
import { normalizeBookStatus } from "../utils/catalogFormatters.js";

const ALL_VALUE = "semua";
const PARAM_KEYS = ["q", "type", "category", "year", "status", "page"];

function includesValue(value, query) {
  return String(value || "").toLowerCase().includes(query);
}

function matchesQuery(book, q, type) {
  const query = q.trim().toLowerCase();
  if (!query) return true;

  const fieldsByType = {
    judul: [book.title],
    penulis: [book.author],
    topik: [book.category],
    tahun: [book.year],
    semua: [book.title, book.author, book.category, book.year, book.status],
  };

  const fields = fieldsByType[type] || fieldsByType.semua;
  return fields.some((field) => includesValue(field, query));
}

export function filterBooks(books, filters) {
  return books.filter((book) => {
    const status = normalizeBookStatus(book.status);

    const matchesCategory =
      !filters.category ||
      filters.category === ALL_VALUE ||
      book.category === filters.category;
    const matchesYear =
      !filters.year || filters.year === ALL_VALUE || String(book.year) === filters.year;
    const matchesStatus =
      !filters.status || filters.status === ALL_VALUE || status === filters.status;

    return (
      matchesQuery(book, filters.q || "", filters.type || ALL_VALUE) &&
      matchesCategory &&
      matchesYear &&
      matchesStatus
    );
  });
}

export function paginateBooks(books, page, pageSize) {
  const totalPages = Math.max(1, Math.ceil(books.length / pageSize));
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    currentPage,
    totalPages,
    items: books.slice(start, start + pageSize),
  };
}

function parseFilters(searchParams) {
  const page = Number.parseInt(searchParams.get("page") || "1", 10);
  const statusParam = searchParams.get("status") || DEFAULT_FILTERS.status;

  return {
    q: searchParams.get("q") || DEFAULT_FILTERS.q,
    type: searchParams.get("type") || DEFAULT_FILTERS.type,
    category: searchParams.get("category") || DEFAULT_FILTERS.category,
    year: searchParams.get("year") || DEFAULT_FILTERS.year,
    status:
      statusParam === ALL_VALUE ? ALL_VALUE : normalizeBookStatus(statusParam),
    page: Number.isFinite(page) && page > 0 ? page : DEFAULT_FILTERS.page,
  };
}

function writeParam(params, key, value) {
  const defaultValue = DEFAULT_FILTERS[key];

  if (!value || value === defaultValue || (key === "page" && Number(value) === 1)) {
    params.delete(key);
    return;
  }

  params.set(key, String(value));
}

export function useCatalogFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const setFilter = (key, value) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      writeParam(next, key, value);
      if (key !== "page") next.delete("page");
      return next;
    });
  };

  const setPage = (page) => setFilter("page", page);

  const resetFilters = () => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      PARAM_KEYS.forEach((key) => next.delete(key));
      return next;
    });
  };

  return { filters, setFilter, setPage, resetFilters };
}

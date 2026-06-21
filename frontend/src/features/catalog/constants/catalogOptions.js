export const CATALOG_PAGE_SIZE = 6;

export const SEARCH_TYPES = [
  { value: "semua", label: "Semua" },
  { value: "judul", label: "Judul" },
  { value: "penulis", label: "Penulis" },
  { value: "topik", label: "Topik" },
  { value: "tahun", label: "Tahun" },
];

export const STATUS_OPTIONS = [
  { value: "semua", label: "Semua Status" },
  { value: "tersedia", label: "Tersedia" },
  { value: "dipinjam", label: "Dipinjam" },
];

export const DEFAULT_FILTERS = {
  q: "",
  type: "semua",
  category: "semua",
  year: "semua",
  status: "semua",
  page: 1,
};

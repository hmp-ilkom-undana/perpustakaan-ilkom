export const CATALOG_PAGE_SIZE = 6;

export const ARCHIVE_TYPES = [
  { value: "semua", label: "Semua Arsip" },
  { value: "Skripsi", label: "Skripsi" },
  { value: "Naskah Publikasi", label: "Naskah Publikasi" },
  { value: "Ringkasan Skripsi", label: "Ringkasan Skripsi" },
];

export const STATUS_OPTIONS = [
  { value: "semua", label: "Semua Status" },
  { value: "tersedia", label: "Tersedia" },
  { value: "dipinjam", label: "Dipinjam" },
];

export const DEFAULT_FILTERS = {
  q: "",
  archiveType: "semua",
  category: "semua",
  year: "semua",
  status: "semua",
  page: 1,
};

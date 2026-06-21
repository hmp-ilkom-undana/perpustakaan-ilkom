export function normalizeBookStatus(status) {
  const normalized = String(status || "tersedia").toLowerCase();

  if (normalized === "dipinjam") return "dipinjam";
  return "tersedia";
}

export function normalizeBooksResponse(payload) {
  const books = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];

  return books.map((book) => ({
    id: book.id,
    title: book.title || "Judul tidak tersedia",
    author: book.author || "Penulis tidak tersedia",
    year: book.year,
    category: book.category || "Tanpa kategori",
    status: normalizeBookStatus(book.status),
  }));
}

export function formatBookYear(year) {
  if (year === null || year === undefined || year === "") {
    return "Tahun tidak tersedia";
  }

  return String(year);
}

export function formatStatusLabel(status) {
  return normalizeBookStatus(status) === "dipinjam" ? "Dipinjam" : "Tersedia";
}

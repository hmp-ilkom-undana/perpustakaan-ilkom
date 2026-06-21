import { apiFetch } from "@/lib/api/client";
import { normalizeBooksResponse } from "../utils/catalogFormatters";

export async function getBooks() {
  const payload = await apiFetch("/api/books");
  return normalizeBooksResponse(payload);
}

export async function getBookDetail(id) {
  const payload = await apiFetch(`/api/books/${id}`);
  // We can just use the normalizeBooksResponse but for a single item, or just format it
  const normalized = normalizeBooksResponse([payload]);
  return normalized[0] || null;
}

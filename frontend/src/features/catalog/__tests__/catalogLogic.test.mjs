import test from "node:test";
import assert from "node:assert/strict";

import {
  formatBookYear,
  normalizeBooksResponse,
  normalizeBookStatus,
} from "../utils/catalogFormatters.js";
import { filterBooks, paginateBooks } from "../hooks/useCatalogFilters.js";

const books = [
  {
    id: "1",
    title: "Sistem Pakar Penyakit Tanaman",
    author: "Ari",
    year: 2024,
    category: "Kecerdasan Buatan",
    status: "TERSEDIA",
  },
  {
    id: "2",
    title: "Audit Keamanan Jaringan",
    author: "Bela",
    year: 2023,
    category: "Keamanan Siber",
    status: "dipinjam",
  },
  {
    id: "3",
    title: "Basis Data Akademik",
    author: "Citra",
    year: 2024,
    category: "Sistem Informasi",
    status: "tersedia",
  },
];

test("normalizes books response from array or data wrapper", () => {
  assert.equal(normalizeBooksResponse(books).length, 3);
  assert.equal(normalizeBooksResponse({ data: books }).length, 3);
  assert.deepEqual(normalizeBooksResponse({ data: null }), []);
});

test("normalizes backend status casing", () => {
  assert.equal(normalizeBookStatus("TERSEDIA"), "tersedia");
  assert.equal(normalizeBookStatus("dipinjam"), "dipinjam");
  assert.equal(normalizeBookStatus(undefined), "tersedia");
});

test("filters books by q, type, category, year, and status", () => {
  assert.deepEqual(
    filterBooks(books, { q: "ari", type: "penulis" }).map((book) => book.id),
    ["1"],
  );
  assert.deepEqual(
    filterBooks(books, { category: "Sistem Informasi", year: "2024" }).map(
      (book) => book.id,
    ),
    ["3"],
  );
  assert.deepEqual(
    filterBooks(books, { status: "dipinjam" }).map((book) => book.id),
    ["2"],
  );
});

test("paginates client side and clamps page", () => {
  assert.deepEqual(
    paginateBooks(books, 1, 2).items.map((book) => book.id),
    ["1", "2"],
  );
  assert.deepEqual(
    paginateBooks(books, 9, 2).items.map((book) => book.id),
    ["3"],
  );
});

test("formats missing year safely", () => {
  assert.equal(formatBookYear(undefined), "Tahun tidak tersedia");
  assert.equal(formatBookYear(2024), "2024");
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "@prisma/client";

// Import Driver Adapter
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config();

const { PrismaClient } = pkg;
const app = express();
const PORT = process.env.PORT || 5000;

// 1. Buat koneksi native PostgreSQL ke Neon
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// 2. Bungkus koneksi tersebut ke dalam Prisma Adapter
const adapter = new PrismaPg(pool);

// 3. INJEKSI ADAPTER KE DALAM PRISMA CLIENT
const prisma = new PrismaClient({ adapter });

// Middleware
app.use(cors());
app.use(express.json());

// Root Endpoint
app.get("/", (req, res) => {
  res.json({ message: "Server Perpustakaan ILKOM berjalan lancar!" });
});

// ==========================================
// ENDPOINT KATALOG SKRIPSI (BOOKS)
// ==========================================

// 1. GET: Mengambil seluruh daftar skripsi
app.get("/api/books", async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan saat mengambil data skripsi." });
  }
});

// 2. POST: Menambahkan skripsi baru ke dalam katalog
app.post("/api/books", async (req, res) => {
  const { title, author, year, category } = req.body;

  try {
    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        year: parseInt(year),
        category,
      },
    });
    res.status(201).json(newBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan saat menambahkan skripsi." });
  }
});

// 3. GET: Mengambil detail skripsi berdasarkan ID
app.get("/api/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await prisma.book.findUnique({
      where: { id },
    });
    
    if (!book) {
      return res.status(404).json({ error: "Arsip tidak ditemukan." });
    }
    
    res.status(200).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan saat mengambil detail skripsi." });
  }
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
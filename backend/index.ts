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
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

import rateLimit from "express-rate-limit";
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per `window`
  message: { error: "Terlalu banyak permintaan, coba lagi dalam 1 menit." },
});

// Mount Better Auth Handler before express.json()
import { toNodeHandler } from "better-auth/node";
import { auth } from "./src/auth.js";
app.use("/api/auth/sign-in", authLimiter);
app.use("/api/auth/setup-password", authLimiter);
app.use("/api/auth/check-setup", authLimiter);
app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());

import { requireAuth, requireRoles } from "./src/middleware/authMiddleware.js";

// Root Endpoint
app.get("/", (req, res) => {
  res.json({ message: "Server Perpustakaan ILKOM berjalan lancar!" });
});

// ==========================================
// ENDPOINT KATALOG SKRIPSI
// ==========================================

// 1. GET: Mengambil seluruh daftar skripsi
app.get(
  "/api/archives",
  requireAuth,
  requireRoles(["MAHASISWA", "PETUGAS", "ADMIN"]),
  async (req, res) => {
    try {
      const archives = await prisma.archive.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.status(200).json(archives);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Terjadi kesalahan saat mengambil data arsip." });
    }
  },
);

// 2. POST: Menambahkan skripsi baru ke dalam katalog
app.post(
  "/api/archives",
  requireAuth,
  requireRoles(["PETUGAS", "ADMIN"]),
  async (req, res) => {
    const {
      title,
      author,
      year,
      category,
      archiveType,
      quantity,
      shelfLocation,
    } = req.body;

    try {
      const newArchive = await prisma.archive.create({
        data: {
          title,
          author,
          year: parseInt(year),
          category,
          archiveType: archiveType || "SKRIPSI",
          quantity: quantity ? parseInt(quantity) : 1,
          shelfLocation: shelfLocation || null,
        },
      });
      res.status(201).json(newArchive);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Terjadi kesalahan saat menambahkan arsip." });
    }
  },
);

// 3. GET: Mengambil detail skripsi berdasarkan ID
app.get(
  "/api/archives/:id",
  requireAuth,
  requireRoles(["MAHASISWA", "PETUGAS", "ADMIN"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const archive = await prisma.archive.findUnique({
        where: { id: id as string },
      });

      if (!archive) {
        return res.status(404).json({ error: "Arsip tidak ditemukan." });
      }

      res.status(200).json(archive);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Terjadi kesalahan saat mengambil detail arsip." });
    }
  },
);

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

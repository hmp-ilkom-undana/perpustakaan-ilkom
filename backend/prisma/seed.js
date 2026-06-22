import pkg from "@prisma/client";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const { PrismaClient } = pkg;
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const devBooks = [
  {
    title: "Implementasi Deep Learning untuk Klasifikasi Gambar Medis",
    author: "Andi Pratama",
    year: 2024,
    category: "Kecerdasan Buatan",
    status: "TERSEDIA",
    shelfLocation: "Rak A1",
  },
  {
    title: "Sistem Deteksi Intrusi Berbasis Machine Learning pada Jaringan Komputer",
    author: "Siti Rahma",
    year: 2023,
    category: "Keamanan Siber",
    status: "DIPINJAM",
    shelfLocation: "Rak B2",
  },
  {
    title: "Pengembangan Aplikasi Mobile Manajemen Akademik dengan Flutter",
    author: "Budi Santoso",
    year: 2024,
    category: "Rekayasa Perangkat Lunak",
    status: "TERSEDIA",
    shelfLocation: "Lemari Skripsi 2025",
  },
  {
    title: "Analisis Sentimen Ulasan Produk Menggunakan Natural Language Processing",
    author: "Dewi Kurniasih",
    year: 2022,
    category: "Kecerdasan Buatan",
    status: "TERSEDIA",
    shelfLocation: "Rak A2",
  },
  {
    title: "Perancangan Sistem Informasi Perpustakaan Berbasis Web",
    author: "Rizky Aditya",
    year: 2021,
    category: "Sistem Informasi",
    status: "DIPINJAM",
    shelfLocation: "Rak Sistem Informasi",
  },
  {
    title: "Audit Keamanan Sistem Informasi Menggunakan Framework ISO 27001",
    author: "Nurul Fadhilah",
    year: 2023,
    category: "Keamanan Siber",
    status: "TERSEDIA",
    shelfLocation: "Rak B2",
  },
  {
    title: "Penerapan Metode Scrum dalam Pengembangan Sistem Manajemen Inventaris",
    author: "Yusuf Hakim",
    year: 2025,
    category: "Rekayasa Perangkat Lunak",
    status: "TERSEDIA",
    shelfLocation: "Lemari Skripsi 2025",
  },
  {
    title: "Rancang Bangun Sistem Informasi Keuangan Desa Berbasis Web",
    author: "Maria Magdalena",
    year: 2022,
    category: "Sistem Informasi",
    status: "TERSEDIA",
    shelfLocation: "Rak Sistem Informasi",
  },
  {
    title: "Implementasi Algoritma Genetika untuk Optimasi Penjadwalan Kuliah",
    author: "Hendri Wijaya",
    year: 2021,
    category: "Kecerdasan Buatan",
    status: "DIPINJAM",
    shelfLocation: "Rak A1",
  },
  {
    title: "Analisis Kerentanan Keamanan Aplikasi Web Menggunakan OWASP",
    author: "Fitri Handayani",
    year: 2024,
    category: "Keamanan Siber",
    status: "TERSEDIA",
    shelfLocation: "Rak B1",
  },
  {
    title: "Pengembangan REST API untuk Aplikasi E-Commerce dengan Node.js",
    author: "Dimas Permana",
    year: 2023,
    category: "Rekayasa Perangkat Lunak",
    status: "TERSEDIA",
    shelfLocation: "Rak C1",
  },
  {
    title: "Sistem Pendukung Keputusan Pemilihan Jurusan dengan Metode AHP",
    author: "Laila Sari",
    year: 2025,
    category: "Sistem Informasi",
    status: "DIPINJAM",
    shelfLocation: "Rak Sistem Informasi",
  },
];

async function main() {
  console.log("Memulai proses seeding data development...");

  // Cek data existing
  const existing = await prisma.book.count();
  if (existing > 0) {
    console.log(`Database sudah berisi ${existing} data. Seed dibatalkan untuk mencegah duplikasi.`);
    console.log("Hapus data terlebih dahulu jika ingin re-seed.");
    return;
  }

  let inserted = 0;
  for (const book of devBooks) {
    await prisma.book.create({ data: book });
    inserted++;
    console.log(`✓ [${inserted}/${devBooks.length}] ${book.title}`);
  }

  console.log(`\nSelesai. ${inserted} arsip berhasil ditambahkan.`);
}

main()
  .catch((e) => {
    console.error("Seed gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

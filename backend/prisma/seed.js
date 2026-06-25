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
    archiveType: "Skripsi"
  },
  {
    title: "Sistem Deteksi Intrusi Berbasis Machine Learning pada Jaringan Komputer",
    author: "Siti Rahma",
    year: 2023,
    category: "Keamanan Siber",
    status: "DIPINJAM",
    shelfLocation: "Rak B2",
    archiveType: "Naskah Publikasi"
  },
  {
    title: "Pengembangan Aplikasi Mobile Manajemen Akademik dengan Flutter",
    author: "Budi Santoso",
    year: 2024,
    category: "Rekayasa Perangkat Lunak",
    status: "TERSEDIA",
    shelfLocation: "Lemari Skripsi 2025",
    archiveType: "Skripsi"
  },
  {
    title: "Analisis Sentimen Ulasan Produk Menggunakan Natural Language Processing",
    author: "Dewi Kurniasih",
    year: 2022,
    category: "Kecerdasan Buatan",
    status: "TERSEDIA",
    shelfLocation: "Rak A2",
    archiveType: "Ringkasan Skripsi"
  },
  {
    title: "Perancangan Sistem Informasi Perpustakaan Berbasis Web",
    author: "Rizky Aditya",
    year: 2021,
    category: "Sistem Informasi",
    status: "DIPINJAM",
    shelfLocation: "Rak Sistem Informasi",
    archiveType: "Skripsi"
  },
  {
    title: "Audit Keamanan Sistem Informasi Menggunakan Framework ISO 27001",
    author: "Nurul Fadhilah",
    year: 2023,
    category: "Keamanan Siber",
    status: "TERSEDIA",
    shelfLocation: "Rak B2",
    archiveType: "Naskah Publikasi"
  },
  {
    title: "Penerapan Metode Scrum dalam Pengembangan Sistem Manajemen Inventaris",
    author: "Yusuf Hakim",
    year: 2025,
    category: "Rekayasa Perangkat Lunak",
    status: "TERSEDIA",
    shelfLocation: "Lemari Skripsi 2025",
    archiveType: "Skripsi"
  },
  {
    title: "Rancang Bangun Sistem Informasi Keuangan Desa Berbasis Web",
    author: "Maria Magdalena",
    year: 2022,
    category: "Sistem Informasi",
    status: "TERSEDIA",
    shelfLocation: "Rak Sistem Informasi",
    archiveType: "Ringkasan Skripsi"
  },
  {
    title: "Implementasi Algoritma Genetika untuk Optimasi Penjadwalan Kuliah",
    author: "Hendri Wijaya",
    year: 2021,
    category: "Kecerdasan Buatan",
    status: "DIPINJAM",
    shelfLocation: "Rak A1",
    archiveType: "Skripsi"
  },
  {
    title: "Analisis Kerentanan Keamanan Aplikasi Web Menggunakan OWASP",
    author: "Fitri Handayani",
    year: 2024,
    category: "Keamanan Siber",
    status: "TERSEDIA",
    shelfLocation: "Rak B1",
    archiveType: "Naskah Publikasi"
  },
  {
    title: "Pengembangan REST API untuk Aplikasi E-Commerce dengan Node.js",
    author: "Dimas Permana",
    year: 2023,
    category: "Rekayasa Perangkat Lunak",
    status: "TERSEDIA",
    shelfLocation: "Rak C1",
    archiveType: "Skripsi"
  },
  {
    title: "Sistem Pendukung Keputusan Pemilihan Jurusan dengan Metode AHP",
    author: "Laila Sari",
    year: 2025,
    category: "Sistem Informasi",
    status: "DIPINJAM",
    shelfLocation: "Rak Sistem Informasi",
    archiveType: "Ringkasan Skripsi"
  },
];

async function main() {
  console.log("Memulai proses seeding data development...");

  // Hapus data lama untuk development seeding
  await prisma.borrowing.deleteMany({});
  await prisma.book.deleteMany({});

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

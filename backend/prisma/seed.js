import pkg from "@prisma/client";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { auth } from "../src/auth.ts";

dotenv.config();

const { PrismaClient } = pkg;
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// --- DATA BUKU DUMMY ---
const devBooks = [
  {
    title: "Implementasi Deep Learning untuk Klasifikasi Gambar Medis",
    author: "Andi Pratama",
    year: 2024,
    category: "Kecerdasan Buatan",
    status: "TERSEDIA",
    shelfLocation: "Rak A1",
    archiveType: "Skripsi",
  },
  {
    title:
      "Sistem Deteksi Intrusi Berbasis Machine Learning pada Jaringan Komputer",
    author: "Siti Rahma",
    year: 2023,
    category: "Keamanan Siber",
    status: "DIPINJAM",
    shelfLocation: "Rak B2",
    archiveType: "Naskah Publikasi",
  },
  {
    title: "Pengembangan Aplikasi Mobile Manajemen Akademik dengan Flutter",
    author: "Budi Santoso",
    year: 2024,
    category: "Rekayasa Perangkat Lunak",
    status: "TERSEDIA",
    shelfLocation: "Lemari Skripsi 2025",
    archiveType: "Skripsi",
  },
  {
    title:
      "Analisis Sentimen Ulasan Produk Menggunakan Natural Language Processing",
    author: "Dewi Kurniasih",
    year: 2022,
    category: "Kecerdasan Buatan",
    status: "TERSEDIA",
    shelfLocation: "Rak A2",
    archiveType: "Ringkasan Skripsi",
  },
  {
    title: "Perancangan Sistem Informasi Perpustakaan Berbasis Web",
    author: "Rizky Aditya",
    year: 2021,
    category: "Sistem Informasi",
    status: "DIPINJAM",
    shelfLocation: "Rak Sistem Informasi",
    archiveType: "Skripsi",
  },
  {
    title: "Audit Keamanan Sistem Informasi Menggunakan Framework ISO 27001",
    author: "Nurul Fadhilah",
    year: 2023,
    category: "Keamanan Siber",
    status: "TERSEDIA",
    shelfLocation: "Rak B2",
    archiveType: "Naskah Publikasi",
  },
  {
    title:
      "Penerapan Metode Scrum dalam Pengembangan Sistem Manajemen Inventaris",
    author: "Yusuf Hakim",
    year: 2025,
    category: "Rekayasa Perangkat Lunak",
    status: "TERSEDIA",
    shelfLocation: "Lemari Skripsi 2025",
    archiveType: "Skripsi",
  },
  {
    title: "Rancang Bangun Sistem Informasi Keuangan Desa Berbasis Web",
    author: "Maria Magdalena",
    year: 2022,
    category: "Sistem Informasi",
    status: "TERSEDIA",
    shelfLocation: "Rak Sistem Informasi",
    archiveType: "Ringkasan Skripsi",
  },
  {
    title: "Implementasi Algoritma Genetika untuk Optimasi Penjadwalan Kuliah",
    author: "Hendri Wijaya",
    year: 2021,
    category: "Kecerdasan Buatan",
    status: "DIPINJAM",
    shelfLocation: "Rak A1",
    archiveType: "Skripsi",
  },
  {
    title: "Analisis Kerentanan Keamanan Aplikasi Web Menggunakan OWASP",
    author: "Fitri Handayani",
    year: 2024,
    category: "Keamanan Siber",
    status: "TERSEDIA",
    shelfLocation: "Rak B1",
    archiveType: "Naskah Publikasi",
  },
  {
    title: "Pengembangan REST API untuk Aplikasi E-Commerce dengan Node.js",
    author: "Dimas Permana",
    year: 2023,
    category: "Rekayasa Perangkat Lunak",
    status: "TERSEDIA",
    shelfLocation: "Rak C1",
    archiveType: "Skripsi",
  },
  {
    title: "Sistem Pendukung Keputusan Pemilihan Jurusan dengan Metode AHP",
    author: "Laila Sari",
    year: 2025,
    category: "Sistem Informasi",
    status: "DIPINJAM",
    shelfLocation: "Rak Sistem Informasi",
    archiveType: "Ringkasan Skripsi",
  },
];

// --- DATA AKUN DUMMY ---
const devUsers = [
  {
    name: "Administrator Perpustakaan",
    username: "admin_perpustakaan",
    email: "delanomanafe05@gmail.com",
    password: "adminPERPUSTAKAAN123",
    nim: "230000001",
    role: "ADMIN",
    wa_number: "082339113591",
  },
  {
    name: "Petugas Perpustakaan",
    username: "petugas1",
    email: "petugasperpus@gmail.com",
    password: "Petugas#1",
    nim: "230000002",
    role: "PETUGAS",
    wa_number: "081234567891",
  },
  {
    name: "Mahasiswa Demo",
    username: "mahasiswa1",
    email: "mahasiswa1@gmail.com",
    password: "mahasiswa1234",
    nim: "2201020001",
    role: "MAHASISWA",
    wa_number: "081234567892",
  },
];

async function main() {
  console.log("Memulai proses seeding data development...\n");

  // ==========================================
  // 1. SEEDING BUKU
  // ==========================================
  console.log("--- SEEDING BUKU ---");
  await prisma.borrowing.deleteMany({});
  await prisma.book.deleteMany({});

  let insertedBooks = 0;
  for (const book of devBooks) {
    await prisma.book.create({ data: book });
    insertedBooks++;
  }
  console.log(`✓ ${insertedBooks} arsip buku berhasil ditambahkan.\n`);

  // ==========================================
  // 2. SEEDING USER
  // ==========================================
  console.log("--- SEEDING AKUN USER ---");
  for (const userData of devUsers) {
    // Mengecek apakah email sudah ada agar script aman dijalankan berulang kali
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!existingUser) {
      // Pendaftaran via Better Auth agar password otomatis dienkripsi
      await auth.api.signUpEmail({
        body: {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          username: userData.username,
          nim: userData.nim,
          role: userData.role,
          wa_number: userData.wa_number,
        },
      });

      console.log(
        `✓ Akun [${userData.role}] Username: '${userData.username}' berhasil dibuat.`,
      );
    } else {
      console.log(
        `⚠ Akun [${userData.role}] ${userData.email} sudah ada, dilewati.`,
      );
    }
  }

  console.log("\nProses seeding selesai secara keseluruhan!");
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

import "dotenv/config";
import pkg from "@prisma/client";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { auth } from "../src/auth.ts";
const { PrismaClient, ArchiveStatus, Role } = pkg;

// Konfigurasi koneksi Neon Serverless
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Memulai proses seeding data Arsip...");

  //  SEEDING AKUN USER
  console.log("Menyiapkan akun User untuk keperluan login...");

  const usersToCreate = [
    {
      email: "delanomanafe05@gmail.com",
      password: "admin_PERPUSTAKAAN123",
      name: "Administrator Perpustakaan",
      username: "admin_perpustakaan",
      nim: "230000001",
      wa_number: "082339113591",
      role: Role.ADMIN,
    },
    {
      email: "petugasperpus@gmail.com",
      password: "petugas_PERPUSTAKAAN123",
      name: "Petugas Perpustakaan",
      username: "petugas1",
      nim: "230000002",
      wa_number: "081234567891",
      role: Role.PETUGAS,
    },
    {
      email: "mahasiswa1@gmail.com",
      password: "mahasiswa_ILKOM123",
      name: "Mahasiswa Demo",
      username: "mahasiswa1",
      nim: "2201020001",
      wa_number: "081234567892",
      role: Role.MAHASISWA,
    },
  ];

  for (const user of usersToCreate) {
    try {
      await auth.api.signUpEmail({ body: user });
      console.log(`[+] Akun ${user.role} (${user.email}) berhasil dibuat!`);
    } catch (error) {
      console.log(
        `[!] Info: Akun ${user.role} sudah ada / gagal dibuat. (Alasan: ${error?.body?.message || "Username/Email sudah terpakai"})`,
      );
    }
  }
  console.log("Seeding User selesai!\n");
  // ----------------------------------------

  // Hapus semua data arsip sebelumnya untuk mencegah duplikasi
  console.log("Membersihkan data arsip lama...");
  await prisma.archive.deleteMany();

  const devArchives = [
    // 1. DATA SKRIPSI (Memiliki Lokasi Rak)
    {
      title: "Penerapan Algoritma K-Means untuk Klasifikasi Data Akademik",
      author: "Budi Santoso",
      year: 2023,
      category: "Kecerdasan Buatan",
      archiveType: "Skripsi",
      status: ArchiveStatus.TERSEDIA,
      quantity: 2,
      shelfLocation: "Rak-A1",
    },
    {
      title: "Audit Keamanan Sistem Informasi Menggunakan Standar ISO 27001",
      author: "Maya Sari",
      year: 2023,
      category: "Keamanan Jaringan",
      archiveType: "Skripsi",
      status: ArchiveStatus.TERSEDIA,
      quantity: 1,
      shelfLocation: "Rak-A2",
    },
    {
      title: "Sistem Pendukung Keputusan Pemilihan Karyawan Terbaik",
      author: "Eko Prasetyo",
      year: 2022,
      category: "Sistem Informasi",
      archiveType: "Skripsi",
      status: ArchiveStatus.DIPINJAM,
      quantity: 1,
      shelfLocation: "Rak-B1",
    },

    // 2. DATA RINGKASAN SKRIPSI
    {
      title: "Analisis Sentimen Pengguna Twitter Terhadap Layanan E-Commerce",
      author: "Siti Aminah",
      year: 2022,
      category: "Data Science",
      archiveType: "Ringkasan Skripsi",
      status: ArchiveStatus.DIPINJAM,
      quantity: 1,
    },
    {
      title: "Pengembangan Game Edukasi Sejarah Kemerdekaan Indonesia",
      author: "Gilang Ramadhan",
      year: 2022,
      category: "Multimedia",
      archiveType: "Ringkasan Skripsi",
      status: ArchiveStatus.TERSEDIA,
      quantity: 3,
    },

    // 3. DATA NASKAH PUBLIKASI
    {
      title: "Rancang Bangun Aplikasi Perpustakaan Berbasis Web",
      author: "Rina Kumala",
      year: 2024,
      category: "Rekayasa Perangkat Lunak",
      archiveType: "Naskah Publikasi",
      status: ArchiveStatus.TERSEDIA,
      quantity: 5,
    },
    {
      title: "Analisis Perbandingan Kinerja Framework React dan Vue",
      author: "Dina Novita",
      year: 2024,
      category: "Web Development",
      archiveType: "Naskah Publikasi",
      status: ArchiveStatus.TERSEDIA,
      quantity: 2,
    },
    {
      title: "Perancangan UI/UX Aplikasi Layanan Kesehatan Mental",
      author: "Tiara Anindya",
      year: 2024,
      category: "HCI",
      archiveType: "Naskah Publikasi",
      status: ArchiveStatus.TERSEDIA,
      quantity: 4,
    },
  ];

  // Eksekusi penambahan data menggunakan prisma.archive
  for (const data of devArchives) {
    await prisma.archive.create({ data });
  }

  console.log(
    `Seeding selesai! ${devArchives.length} Data Arsip berhasil ditambahkan ke database.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

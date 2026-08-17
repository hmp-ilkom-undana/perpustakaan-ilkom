import 'dotenv/config';
import { PrismaClient, ArchiveStatus, Role } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { username } from 'better-auth/plugins';

// Konfigurasi koneksi Neon Serverless
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Standalone Auth Instance khusus untuk Seed
const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username()],
  user: {
    additionalFields: {
      role: { type: 'string' },
      nim: { type: 'string' },
      wa_number: { type: 'string' },
    },
  },
});

async function main() {
  console.log('Memulai proses seeding data Arsip...');

  //  SEEDING AKUN USER
  console.log('Menyiapkan akun User untuk keperluan login...');

  const usersToCreate = [
    {
      email: 'delanomanafe05@gmail.com',
      password: 'admin_PERPUSTAKAAN123',
      name: 'Administrator Perpustakaan',
      username: 'admin_perpustakaan',
      nim: '230000001',
      wa_number: '082339113591',
      role: Role.ADMIN,
    },
    {
      email: 'petugasperpus@gmail.com',
      password: 'petugas_PERPUSTAKAAN123',
      name: 'Petugas Perpustakaan',
      username: 'petugas1',
      nim: '230000002',
      wa_number: '081234567891',
      role: Role.PETUGAS,
    },
    {
      email: 'mahasiswa1@gmail.com',
      password: 'mahasiswa_ILKOM123',
      name: 'Mahasiswa Demo',
      username: 'mahasiswa1',
      nim: '2201020001',
      wa_number: '081234567892',
      role: Role.MAHASISWA,
    },
  ];

  for (const user of usersToCreate) {
    try {
      await auth.api.signUpEmail({ body: user });
      console.log(`[+] Akun ${user.role} (${user.email}) berhasil dibuat!`);
    } catch (error) {
      console.log(
        `[!] Info: Akun ${user.role} sudah ada / gagal dibuat. (Alasan: ${error?.body?.message || 'Username/Email sudah terpakai'})`,
      );
    }
  }
  console.log('Seeding User selesai!\n');
  // ----------------------------------------

  // Hapus semua data arsip sebelumnya untuk mencegah duplikasi
  console.log('Membersihkan data arsip lama...');
  await prisma.archive.deleteMany();

  const devArchives = [
    // 1. DATA SKRIPSI (Memiliki Lokasi Rak)
    {
      title: 'Penerapan Algoritma K-Means untuk Klasifikasi Data Akademik',
      author: 'Budi Santoso',
      year: 2023,
      category: 'Kecerdasan Buatan',
      archiveType: 'Skripsi',
      status: ArchiveStatus.TERSEDIA,
      quantity: 2,
      shelfLocation: 'Rak-A1',
    },
    {
      title: 'Audit Keamanan Sistem Informasi Menggunakan Standar ISO 27001',
      author: 'Maya Sari',
      year: 2023,
      category: 'Keamanan Jaringan',
      archiveType: 'Skripsi',
      status: ArchiveStatus.TERSEDIA,
      quantity: 1,
      shelfLocation: 'Rak-A2',
    },
    {
      title: 'Sistem Pendukung Keputusan Pemilihan Karyawan Terbaik',
      author: 'Eko Prasetyo',
      year: 2022,
      category: 'Sistem Informasi',
      archiveType: 'Skripsi',
      status: ArchiveStatus.DIPINJAM,
      quantity: 1,
      shelfLocation: 'Rak-B1',
    },

    // 2. DATA RINGKASAN SKRIPSI
    {
      title: 'Analisis Sentimen Pengguna Twitter Terhadap Layanan E-Commerce',
      author: 'Siti Aminah',
      year: 2022,
      category: 'Data Science',
      archiveType: 'Ringkasan Skripsi',
      status: ArchiveStatus.DIPINJAM,
      quantity: 1,
    },
    {
      title: 'Pengembangan Game Edukasi Sejarah Kemerdekaan Indonesia',
      author: 'Gilang Ramadhan',
      year: 2022,
      category: 'Multimedia',
      archiveType: 'Ringkasan Skripsi',
      status: ArchiveStatus.TERSEDIA,
      quantity: 3,
    },

    // 3. DATA NASKAH PUBLIKASI
    {
      title: 'Rancang Bangun Aplikasi Perpustakaan Berbasis Web',
      author: 'Rina Kumala',
      year: 2024,
      category: 'Rekayasa Perangkat Lunak',
      archiveType: 'Naskah Publikasi',
      status: ArchiveStatus.TERSEDIA,
      quantity: 5,
    },
    {
      title: 'Analisis Perbandingan Kinerja Framework React dan Vue',
      author: 'Dina Novita',
      year: 2024,
      category: 'Web Development',
      archiveType: 'Naskah Publikasi',
      status: ArchiveStatus.TERSEDIA,
      quantity: 2,
    },
    {
      title: 'Perancangan UI/UX Aplikasi Layanan Kesehatan Mental',
      author: 'Tiara Anindya',
      year: 2024,
      category: 'HCI',
      archiveType: 'Naskah Publikasi',
      status: ArchiveStatus.TERSEDIA,
      quantity: 4,
    },
  ];

  // Eksekusi penambahan data menggunakan prisma.archive
  let skrCounter = 1;
  let rksCounter = 1;
  let npbCounter = 1;

  for (const data of devArchives) {
    let prefix = 'UMM';
    let num = 1;
    if (data.archiveType === 'Skripsi') { prefix = 'SKR'; num = skrCounter++; }
    else if (data.archiveType === 'Ringkasan Skripsi') { prefix = 'RKS'; num = rksCounter++; }
    else if (data.archiveType === 'Naskah Publikasi') { prefix = 'NPB'; num = npbCounter++; }
    
    const archiveCode = `${prefix}-${num.toString().padStart(4, '0')}`;
    await prisma.archive.create({ data: { ...data, archiveCode } });
  }

  console.log(
    `Seeding selesai! ${devArchives.length} Data Arsip berhasil ditambahkan ke database.`,
  );

  // SEEDING SYSTEM SETTINGS DEFAULT
  console.log('Menyiapkan Pengaturan Sistem Default...');
  await prisma.systemSetting.upsert({
    where: { id: 'DEFAULT' },
    update: {},
    create: {
      id: 'DEFAULT',
      operatingDays: [1, 2, 3, 4, 5], // Senin - Jumat
      pickupDurationDays: 3,
      autoCancelUnpicked: true,
      loanDurationDays: 30,
      maxActiveSkripsi: 2,
      maxActiveRingkasan: 1,
      maxActiveNaskah: 1,
      lateBaseFine: 50000,
      lateThresholdDays: 7,
      lateDailyFine: 10000,
      damagedFine: 75000,
      lostFine: 100000,
      adminWaNumber: '082339113591',
      adminContactName: 'Admin Perpustakaan ILKOM',
    },
  });
  console.log('[+] Pengaturan Sistem Default berhasil disiapkan!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

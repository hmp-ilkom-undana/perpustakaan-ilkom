import 'dotenv/config';
import { PrismaClient, Role, BorrowStatus, KondisiArsip } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { username } from 'better-auth/plugins';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
      role: {
        type: 'string',
        required: false,
        defaultValue: 'MAHASISWA',
      },
      nim: {
        type: 'string',
        required: false,
      },
      wa_number: {
        type: 'string',
        required: false,
      },
    },
  },
});

async function main() {
  console.log('====================================================');
  console.log('🚀 MEMULAI SEEDING DATA DUMMY SISTEM PERPUSTAKAAN');
  console.log('====================================================\n');

  // 1. SEEDING / UPSERT SYSTEM SETTINGS
  console.log('⚙️  [1/4] Menyiapkan Pengaturan Sistem Default...');
  await prisma.systemSetting.upsert({
    where: { id: 'DEFAULT' },
    update: {
      operatingDays: [1, 2, 3, 4, 5],
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
    create: {
      id: 'DEFAULT',
      operatingDays: [1, 2, 3, 4, 5],
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
  console.log('✅ Pengaturan sistem berhasil disiapkan.\n');

  // 2. SEEDING AKUN PENGGUNA (Admin, Petugas, Mahasiswa)
  console.log('👥 [2/4] Menyiapkan Akun Pengguna (Auth & Role)...');

  // 2a. Administrator
  const adminUser = {
    email: 'delanomanafe05@gmail.com',
    password: 'admin_PERPUSTAKAAN123',
    name: 'Administrator Perpustakaan',
    username: 'admin_perpustakaan',
    nim: '230000001',
    wa_number: '082339113591',
    role: Role.ADMIN,
  };

  try {
    await auth.api.signUpEmail({ body: adminUser });
    console.log(`[+] Akun ADMIN (${adminUser.email}) berhasil dibuat.`);
  } catch {
    console.log(`[i] Akun ADMIN (${adminUser.email}) sudah terdaftar, memperbarui data...`);
  }
  await prisma.user.updateMany({
    where: { email: adminUser.email },
    data: {
      name: adminUser.name,
      nim: adminUser.nim,
      wa_number: adminUser.wa_number,
      role: adminUser.role,
    },
  });

  // 2b. Petugas Operasional (Hanya Email & Password)
  const staffList = [
    {
      email: 'petugasperpus@gmail.com',
      password: 'petugas_PERPUSTAKAAN123',
    },
    {
      email: 'petugas2@gmail.com',
      password: 'petugas_PERPUSTAKAAN123',
    },
    {
      email: 'petugas3@gmail.com',
      password: 'petugas_PERPUSTAKAAN123',
    },
  ];

  for (const staff of staffList) {
    const rawUsername = staff.email.split('@')[0];
    const formattedName =
      rawUsername
        .split(/[._-]+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') || 'Petugas';

    try {
      await auth.api.signUpEmail({
        body: {
          email: staff.email,
          password: staff.password,
          name: formattedName,
          username: rawUsername,
        },
      });
      console.log(`[+] Akun PETUGAS (${staff.email}) berhasil dibuat.`);
    } catch {
      console.log(`[i] Akun PETUGAS (${staff.email}) sudah terdaftar, menyelaraskan role...`);
    }

    // Pastikan akun petugas bersih dari NIM & WA
    await prisma.user.updateMany({
      where: { email: staff.email },
      data: {
        role: Role.PETUGAS,
        nim: null,
        wa_number: null,
        name: formattedName,
      },
    });
  }

  // 2c. Akun Mahasiswa
  const studentsList = [
    {
      email: 'mahasiswa1@gmail.com',
      password: 'mahasiswa_ILKOM123',
      name: 'Andi Saputra',
      username: 'mahasiswa1',
      nim: '2201020001',
      wa_number: '081234567892',
      role: Role.MAHASISWA,
    },
    {
      email: 'mahasiswa2@gmail.com',
      password: 'mahasiswa_ILKOM123',
      name: 'Bunga Citra Lestari',
      username: 'mahasiswa2',
      nim: '2201020002',
      wa_number: '081234567893',
      role: Role.MAHASISWA,
    },
    {
      email: 'mahasiswa3@gmail.com',
      password: 'mahasiswa_ILKOM123',
      name: 'Candra Wijaya',
      username: 'mahasiswa3',
      nim: '2201020003',
      wa_number: '081234567894',
      role: Role.MAHASISWA,
    },
    {
      email: 'mahasiswa4@gmail.com',
      password: 'mahasiswa_ILKOM123',
      name: 'Dina Permata',
      username: 'mahasiswa4',
      nim: '2201020004',
      wa_number: '081234567895',
      role: Role.MAHASISWA,
    },
    {
      email: 'mahasiswa5@gmail.com',
      password: 'mahasiswa_ILKOM123',
      name: 'Eko Kurniawan',
      username: 'mahasiswa5',
      nim: '2201020005',
      wa_number: '081234567896',
      role: Role.MAHASISWA,
    },
    {
      email: 'mahasiswa6@gmail.com',
      password: 'mahasiswa_ILKOM123',
      name: 'Farhan Maulana',
      username: 'mahasiswa6',
      nim: '2201020006',
      wa_number: '081234567897',
      role: Role.MAHASISWA,
    },
    {
      email: 'mahasiswa7@gmail.com',
      password: 'mahasiswa_ILKOM123',
      name: 'Gita Gutawa',
      username: 'mahasiswa7',
      nim: '2201020007',
      wa_number: '081234567898',
      role: Role.MAHASISWA,
    },
    {
      email: 'mahasiswa8@gmail.com',
      password: 'mahasiswa_ILKOM123',
      name: 'Hadi Firmansyah',
      username: 'mahasiswa8',
      nim: '2201020008',
      wa_number: '081234567899',
      role: Role.MAHASISWA,
    },
    {
      email: 'mahasiswa9@gmail.com',
      password: 'mahasiswa_ILKOM123',
      name: 'Indah Permatasari',
      username: 'mahasiswa9',
      nim: '2201020009',
      wa_number: '081234567800',
      role: Role.MAHASISWA,
    },
    {
      email: 'mahasiswa10@gmail.com',
      password: 'mahasiswa_ILKOM123',
      name: 'Joko Prasetyo',
      username: 'mahasiswa10',
      nim: '2201020010',
      wa_number: '081234567801',
      role: Role.MAHASISWA,
    },
  ];

  for (const student of studentsList) {
    try {
      await auth.api.signUpEmail({ body: student });
      console.log(`[+] Akun MAHASISWA (${student.email}) berhasil dibuat.`);
    } catch {
      console.log(`[i] Akun MAHASISWA (${student.email}) sudah terdaftar, memperbarui data...`);
    }

    await prisma.user.updateMany({
      where: { email: student.email },
      data: {
        name: student.name,
        nim: student.nim,
        wa_number: student.wa_number,
        role: student.role,
      },
    });
  }
  console.log('✅ Sinkronisasi akun pengguna selesai.\n');

  // 3. SINKRONISASI DATA KOLEKSI ARSIP (24 KOLEKSI LENGKAP)
  console.log('📚 [3/4] Menyiapkan dan Menyinkronkan 24 Data Arsip...');
  const initialArchives = [
    // --- SKRIPSI (8 Koleksi) ---
    {
      archiveCode: 'SKR-2024-001',
      title: 'Penerapan Algoritma K-Means untuk Klasifikasi Data Akademik Mahasiswa',
      author: 'Budi Santoso',
      year: 2024,
      category: 'Kecerdasan Buatan',
      archiveType: 'Skripsi',
      quantity: 2,
      shelfLocation: 'Rak A-1',
    },
    {
      archiveCode: 'SKR-2023-002',
      title: 'Audit Keamanan Sistem Informasi Menggunakan Kerangka Kerja COBIT 5',
      author: 'Maya Sari',
      year: 2023,
      category: 'Keamanan Jaringan',
      archiveType: 'Skripsi',
      quantity: 1,
      shelfLocation: 'Rak A-2',
    },
    {
      archiveCode: 'SKR-2022-003',
      title: 'Sistem Pendukung Keputusan Pemilihan Karyawan Terbaik dengan Metode TOPSIS',
      author: 'Eko Prasetyo',
      year: 2022,
      category: 'Sistem Informasi',
      archiveType: 'Skripsi',
      quantity: 1,
      shelfLocation: 'Rak A-3',
    },
    {
      archiveCode: 'SKR-2024-004',
      title: 'Implementasi Deep Learning untuk Deteksi Penyakit Daun Padi Menggunakan CNN',
      author: 'Kevin Sanjaya',
      year: 2024,
      category: 'Kecerdasan Buatan',
      archiveType: 'Skripsi',
      quantity: 2,
      shelfLocation: 'Rak A-1',
    },
    {
      archiveCode: 'SKR-2023-005',
      title: 'Analisis Forensik Digital pada Kasus Kebocoran Data Jaringan Nirkabel',
      author: 'Reza Rahadian',
      year: 2023,
      category: 'Keamanan Jaringan',
      archiveType: 'Skripsi',
      quantity: 1,
      shelfLocation: 'Rak A-2',
    },
    {
      archiveCode: 'SKR-2023-006',
      title: 'Pengembangan Sistem Informasi Manajemen Aset Laboratorium Berbasis Cloud',
      author: 'Sarah Azhari',
      year: 2023,
      category: 'Sistem Informasi',
      archiveType: 'Skripsi',
      quantity: 2,
      shelfLocation: 'Rak A-3',
    },
    {
      archiveCode: 'SKR-2022-007',
      title: 'Prediksi Harga Saham Sektor Perbankan Menggunakan Algoritma LSTM',
      author: 'Hendra Wijaya',
      year: 2022,
      category: 'Data Science',
      archiveType: 'Skripsi',
      quantity: 1,
      shelfLocation: 'Rak A-4',
    },
    {
      archiveCode: 'SKR-2021-008',
      title: 'Sistem Informasi Geografis Pemetaan Daerah Rawan Bencana Banjir',
      author: 'Anita Lestari',
      year: 2021,
      category: 'Sistem Informasi',
      archiveType: 'Skripsi',
      quantity: 1,
      shelfLocation: 'Rak A-3',
    },

    // --- RINGKASAN SKRIPSI (8 Koleksi) ---
    {
      archiveCode: 'RS-2022-001',
      title: 'Analisis Sentimen Pengguna Twitter Terhadap Layanan E-Commerce di Indonesia',
      author: 'Siti Aminah',
      year: 2022,
      category: 'Data Science',
      archiveType: 'Ringkasan Skripsi',
      quantity: 1,
      shelfLocation: 'Rak B-1',
    },
    {
      archiveCode: 'RS-2022-002',
      title: 'Pengembangan Game Edukasi Sejarah Kemerdekaan Menggunakan Unity Engine',
      author: 'Gilang Ramadhan',
      year: 2022,
      category: 'Multimedia',
      archiveType: 'Ringkasan Skripsi',
      quantity: 1,
      shelfLocation: 'Rak B-2',
    },
    {
      archiveCode: 'RS-2024-003',
      title: 'Optimasi Model Prediksi Churn Pelanggan Telekomunikasi Menggunakan XGBoost',
      author: 'Dimas Aditya',
      year: 2024,
      category: 'Data Science',
      archiveType: 'Ringkasan Skripsi',
      quantity: 2,
      shelfLocation: 'Rak B-1',
    },
    {
      archiveCode: 'RS-2023-004',
      title: 'Visualisasi 3D Bangunan Bersejarah Kota Kupang Berbasis Augmented Reality',
      author: 'Putri Ayu',
      year: 2023,
      category: 'Multimedia',
      archiveType: 'Ringkasan Skripsi',
      quantity: 1,
      shelfLocation: 'Rak B-2',
    },
    {
      archiveCode: 'RS-2023-005',
      title: 'Evaluasi Kinerja Query Database PostgreSQL pada Sistem Transaksi Skala Besar',
      author: 'Fajar Nugraha',
      year: 2023,
      category: 'Rekayasa Perangkat Lunak',
      archiveType: 'Ringkasan Skripsi',
      quantity: 2,
      shelfLocation: 'Rak B-3',
    },
    {
      archiveCode: 'RS-2021-006',
      title: 'Analisis Pola Belanja Pelanggan Supermarket Menggunakan Algoritma Apriori',
      author: 'Clarissa Putri',
      year: 2021,
      category: 'Data Science',
      archiveType: 'Ringkasan Skripsi',
      quantity: 1,
      shelfLocation: 'Rak B-1',
    },
    {
      archiveCode: 'RS-2024-007',
      title: 'Perancangan UI/UX Dashboard Monitoring IoT Berbasis Web Menggunakan Figma',
      author: 'Bagus Pratama',
      year: 2024,
      category: 'HCI',
      archiveType: 'Ringkasan Skripsi',
      quantity: 2,
      shelfLocation: 'Rak B-4',
    },
    {
      archiveCode: 'RS-2020-008',
      title: 'Simulasi Jaringan Komputer Kampus Menggunakan Cisco Packet Tracer',
      author: 'Wahyu Hidayat',
      year: 2020,
      category: 'Keamanan Jaringan',
      archiveType: 'Ringkasan Skripsi',
      quantity: 1,
      shelfLocation: 'Rak B-3',
    },

    // --- NASKAH PUBLIKASI (8 Koleksi) ---
    {
      archiveCode: 'NP-2024-001',
      title: 'Rancang Bangun Aplikasi Perpustakaan Berbasis Web dengan Clean Architecture',
      author: 'Rina Kumala',
      year: 2024,
      category: 'Rekayasa Perangkat Lunak',
      archiveType: 'Naskah Publikasi',
      quantity: 2,
      shelfLocation: 'Rak C-1',
    },
    {
      archiveCode: 'NP-2024-002',
      title: 'Analisis Perbandingan Kinerja Framework React dan Vue pada Single Page Application',
      author: 'Dina Novita',
      year: 2024,
      category: 'Web Development',
      archiveType: 'Naskah Publikasi',
      quantity: 2,
      shelfLocation: 'Rak C-2',
    },
    {
      archiveCode: 'NP-2024-003',
      title: 'Perancangan UI/UX Aplikasi Layanan Kesehatan Mental bagi Mahasiswa Tingkat Akhir',
      author: 'Tiara Anindya',
      year: 2024,
      category: 'HCI',
      archiveType: 'Naskah Publikasi',
      quantity: 2,
      shelfLocation: 'Rak C-3',
    },
    {
      archiveCode: 'NP-2023-004',
      title: 'Implementasi Microservices Architecture pada Platform E-Learning Kampus',
      author: 'Satria Yudha',
      year: 2023,
      category: 'Rekayasa Perangkat Lunak',
      archiveType: 'Naskah Publikasi',
      quantity: 1,
      shelfLocation: 'Rak C-1',
    },
    {
      archiveCode: 'NP-2023-005',
      title: 'Pengembangan Web Service RESTful API Menggunakan NestJS dan Prisma ORM',
      author: 'Nadia Safitri',
      year: 2023,
      category: 'Web Development',
      archiveType: 'Naskah Publikasi',
      quantity: 2,
      shelfLocation: 'Rak C-2',
    },
    {
      archiveCode: 'NP-2024-006',
      title: 'Studi Usability Testing Aplikasi Mobile Banking Menggunakan Metode System Usability Scale (SUS)',
      author: 'Daniel Christian',
      year: 2024,
      category: 'HCI',
      archiveType: 'Naskah Publikasi',
      quantity: 2,
      shelfLocation: 'Rak C-3',
    },
    {
      archiveCode: 'NP-2022-007',
      title: 'Implementasi Continuous Integration dan Continuous Deployment (CI/CD) pada Cloud Server',
      author: 'Ilham Maulana',
      year: 2022,
      category: 'Web Development',
      archiveType: 'Naskah Publikasi',
      quantity: 1,
      shelfLocation: 'Rak C-2',
    },
    {
      archiveCode: 'NP-2021-008',
      title: 'Penerapan Single Sign-On (SSO) Menggunakan OAuth2 dan OpenID Connect',
      author: 'Cindy Claudia',
      year: 2021,
      category: 'Keamanan Jaringan',
      archiveType: 'Naskah Publikasi',
      quantity: 1,
      shelfLocation: 'Rak C-1',
    },
  ];

  for (const arc of initialArchives) {
    await prisma.archive.upsert({
      where: { archiveCode: arc.archiveCode },
      update: {
        title: arc.title,
        author: arc.author,
        year: arc.year,
        category: arc.category,
        archiveType: arc.archiveType,
        quantity: arc.quantity,
        shelfLocation: arc.shelfLocation,
      },
      create: arc,
    });
  }

  const existingArchives = await prisma.archive.findMany({
    orderBy: { createdAt: 'asc' },
  });

  console.log(`ℹ️  Berhasil menyinkronkan ${existingArchives.length} koleksi arsip di database.`);

  const skripsiList = existingArchives.filter(
    (a) => a.archiveType.toLowerCase().includes('skripsi') && !a.archiveType.toLowerCase().includes('ringkasan'),
  );
  const ringkasanList = existingArchives.filter((a) =>
    a.archiveType.toLowerCase().includes('ringkasan'),
  );
  const naskahList = existingArchives.filter((a) =>
    a.archiveType.toLowerCase().includes('naskah') || a.archiveType.toLowerCase().includes('publikasi'),
  );

  const getArchive = (type: 'skripsi' | 'ringkasan' | 'naskah', index: number) => {
    let poolList = skripsiList;
    if (type === 'ringkasan' && ringkasanList.length > 0) poolList = ringkasanList;
    else if (type === 'naskah' && naskahList.length > 0) poolList = naskahList;
    else if (poolList.length === 0) poolList = existingArchives;

    return poolList[index % poolList.length];
  };

  const userMap = new Map<string, string>();
  const dbUsers = await prisma.user.findMany();
  for (const u of dbUsers) {
    userMap.set(u.email, u.id);
  }

  const getUserId = (email: string) => {
    const id = userMap.get(email);
    if (!id) throw new Error(`User dengan email ${email} tidak ditemukan.`);
    return id;
  };

  // 4. SEEDING TRANSAKSI PEMINJAMAN, SIRKULASI & DENDA
  console.log('🔄 [4/4] Membersihkan dan Membangun Ulang Transaksi Peminjaman & Denda...');
  await prisma.borrowing.deleteMany();

  await prisma.archive.updateMany({
    data: { reservedQuantity: 0 },
  });

  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;

  const borrowingsData: Array<{
    userId: string;
    archiveId: string;
    borrowDate: Date;
    accDate?: Date | null;
    returnDate?: Date | null;
    status: BorrowStatus;
    fineAmount: number;
    pickupCode?: string | null;
    rejectReason?: string | null;
    kondisiPinjam?: KondisiArsip | null;
    catatanKondisiPinjam?: string | null;
    fotoUrlPinjam?: string | null;
    kondisiKembali?: KondisiArsip | null;
    catatanKondisiKembali?: string | null;
    fotoUrlKembali?: string | null;
    finePaidAt?: Date | null;
    finePaymentMethod?: string | null;
    fineReceivedBy?: string | null;
    fineNotes?: string | null;
  }> = [
    // ==========================================
    // A. TRANSAKSI UNTUK MAHASISWA 1 (DEMO 4 ARSIP TUNGGAKAN OVERDUE)
    // ==========================================
    {
      userId: getUserId('mahasiswa1@gmail.com'),
      archiveId: getArchive('skripsi', 0).id,
      borrowDate: new Date(now.getTime() - 45 * dayMs),
      accDate: new Date(now.getTime() - 45 * dayMs),
      returnDate: new Date(now.getTime() - 15 * dayMs),
      status: BorrowStatus.OVERDUE,
      pickupCode: 'PK-1001',
      fineAmount: 110000,
      finePaidAt: null,
      kondisiPinjam: KondisiArsip.BAIK,
      catatanKondisiPinjam: 'Fisik buku mulus saat serah terima.',
    },
    {
      userId: getUserId('mahasiswa1@gmail.com'),
      archiveId: getArchive('skripsi', 1).id,
      borrowDate: new Date(now.getTime() - 40 * dayMs),
      accDate: new Date(now.getTime() - 40 * dayMs),
      returnDate: new Date(now.getTime() - 10 * dayMs),
      status: BorrowStatus.OVERDUE,
      pickupCode: 'PK-1002',
      fineAmount: 80000,
      finePaidAt: null,
      kondisiPinjam: KondisiArsip.BAIK,
      catatanKondisiPinjam: 'Halaman lengkap dan jilid rapi.',
    },
    {
      userId: getUserId('mahasiswa1@gmail.com'),
      archiveId: getArchive('ringkasan', 0).id,
      borrowDate: new Date(now.getTime() - 38 * dayMs),
      accDate: new Date(now.getTime() - 38 * dayMs),
      returnDate: new Date(now.getTime() - 8 * dayMs),
      status: BorrowStatus.OVERDUE,
      pickupCode: 'PK-2001',
      fineAmount: 60000,
      finePaidAt: null,
      kondisiPinjam: KondisiArsip.BAIK,
      catatanKondisiPinjam: 'Fisik dokumen baik.',
    },
    {
      userId: getUserId('mahasiswa1@gmail.com'),
      archiveId: getArchive('naskah', 0).id,
      borrowDate: new Date(now.getTime() - 35 * dayMs),
      accDate: new Date(now.getTime() - 35 * dayMs),
      returnDate: new Date(now.getTime() - 5 * dayMs),
      status: BorrowStatus.OVERDUE,
      pickupCode: 'PK-3001',
      fineAmount: 50000,
      finePaidAt: null,
      kondisiPinjam: KondisiArsip.BAIK,
      catatanKondisiPinjam: 'Kondisi baik saat serah terima di meja sirkulasi.',
    },
    {
      userId: getUserId('mahasiswa1@gmail.com'),
      archiveId: getArchive('skripsi', 2).id,
      borrowDate: new Date(now.getTime() - 60 * dayMs),
      accDate: new Date(now.getTime() - 60 * dayMs),
      returnDate: new Date(now.getTime() - 35 * dayMs),
      status: BorrowStatus.RETURNED,
      pickupCode: 'PK-2101',
      fineAmount: 0,
      kondisiPinjam: KondisiArsip.BAIK,
      catatanKondisiPinjam: 'Kondisi awal baik.',
      kondisiKembali: KondisiArsip.BAIK,
      catatanKondisiKembali: 'Dikembalikan lengkap tanpa kerusakan fisik.',
    },
    {
      userId: getUserId('mahasiswa1@gmail.com'),
      archiveId: getArchive('ringkasan', 1).id,
      borrowDate: new Date(now.getTime() - 25 * dayMs),
      status: BorrowStatus.CANCELLED,
      fineAmount: 0,
    },
    {
      userId: getUserId('mahasiswa1@gmail.com'),
      archiveId: getArchive('naskah', 1).id,
      borrowDate: new Date(now.getTime() - 18 * dayMs),
      status: BorrowStatus.REJECTED,
      rejectReason: 'Fisik arsip sedang dalam proses penjilidan ulang dan preservasi.',
      fineAmount: 0,
    },

    // ==========================================
    // B. TRANSAKSI UNTUK MAHASISWA LAIN (KASIR, SIRKULASI & AUDIT)
    // ==========================================
    {
      userId: getUserId('mahasiswa2@gmail.com'),
      archiveId: getArchive('skripsi', 3).id,
      borrowDate: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      status: BorrowStatus.REQUESTED,
      fineAmount: 0,
    },
    {
      userId: getUserId('mahasiswa2@gmail.com'),
      archiveId: getArchive('skripsi', 4).id,
      borrowDate: new Date(now.getTime() - 30 * dayMs),
      accDate: new Date(now.getTime() - 30 * dayMs),
      returnDate: new Date(now.getTime() - 3 * dayMs),
      status: BorrowStatus.DAMAGED,
      pickupCode: 'PK-4420',
      fineAmount: 75000,
      finePaidAt: null,
      kondisiPinjam: KondisiArsip.BAIK,
      kondisiKembali: KondisiArsip.RUSAK,
      catatanKondisiKembali: 'Cover belakang sobek dan 2 lembar halaman lepas.',
    },
    {
      userId: getUserId('mahasiswa3@gmail.com'),
      archiveId: getArchive('naskah', 2).id,
      borrowDate: new Date(now.getTime() - 1 * dayMs),
      status: BorrowStatus.REQUESTED,
      fineAmount: 0,
    },
    {
      userId: getUserId('mahasiswa3@gmail.com'),
      archiveId: getArchive('ringkasan', 2).id,
      borrowDate: new Date(now.getTime() - 45 * dayMs),
      accDate: new Date(now.getTime() - 45 * dayMs),
      returnDate: new Date(now.getTime() - 12 * dayMs),
      status: BorrowStatus.DAMAGED,
      pickupCode: 'PK-3190',
      fineAmount: 75000,
      finePaidAt: new Date(now.getTime() - 2 * dayMs),
      finePaymentMethod: 'Tunai',
      fineReceivedBy: 'petugasperpus@gmail.com',
      fineNotes: 'Pelunasan denda kerusakan cover fisik tunai di meja sirkulasi.',
      kondisiPinjam: KondisiArsip.BAIK,
      kondisiKembali: KondisiArsip.RUSAK,
      catatanKondisiKembali: 'Terdapat coretan stabilo tebal pada bab pembahasan.',
    },
    {
      userId: getUserId('mahasiswa4@gmail.com'),
      archiveId: getArchive('skripsi', 5).id,
      borrowDate: new Date(now.getTime() - 2 * dayMs),
      accDate: new Date(now.getTime() - 2 * dayMs),
      status: BorrowStatus.WAITING_PICKUP,
      pickupCode: 'PK-5512',
      fineAmount: 0,
    },
    {
      userId: getUserId('mahasiswa4@gmail.com'),
      archiveId: getArchive('skripsi', 6).id,
      borrowDate: new Date(now.getTime() - 28 * dayMs),
      accDate: new Date(now.getTime() - 28 * dayMs),
      status: BorrowStatus.LOST,
      pickupCode: 'PK-4911',
      fineAmount: 100000,
      finePaidAt: null,
      kondisiPinjam: KondisiArsip.BAIK,
      kondisiKembali: KondisiArsip.HILANG,
      catatanKondisiKembali: 'Mahasiswa melaporkan arsip hilang tertinggal di laboratorium komputer.',
    },
    {
      userId: getUserId('mahasiswa5@gmail.com'),
      archiveId: getArchive('ringkasan', 3).id,
      borrowDate: new Date(now.getTime() - 1 * dayMs),
      accDate: new Date(now.getTime() - 1 * dayMs),
      status: BorrowStatus.WAITING_PICKUP,
      pickupCode: 'PK-1289',
      fineAmount: 0,
    },
    {
      userId: getUserId('mahasiswa5@gmail.com'),
      archiveId: getArchive('skripsi', 7).id,
      borrowDate: new Date(now.getTime() - 50 * dayMs),
      accDate: new Date(now.getTime() - 50 * dayMs),
      status: BorrowStatus.LOST,
      pickupCode: 'PK-5890',
      fineAmount: 100000,
      finePaidAt: new Date(now.getTime() - 4 * dayMs),
      finePaymentMethod: 'Transfer',
      fineReceivedBy: 'delanomanafe05@gmail.com',
      fineNotes: 'Pelunasan denda kehilangan via transfer QRIS HMP terverifikasi.',
      kondisiPinjam: KondisiArsip.BAIK,
      kondisiKembali: KondisiArsip.HILANG,
      catatanKondisiKembali: 'Arsip hilang saat pengerjaan penelitian tugas akhir.',
    },
    {
      userId: getUserId('mahasiswa6@gmail.com'),
      archiveId: getArchive('naskah', 3).id,
      borrowDate: new Date(now.getTime() - 6 * dayMs),
      accDate: new Date(now.getTime() - 6 * dayMs),
      returnDate: new Date(now.getTime() + 24 * dayMs),
      status: BorrowStatus.BORROWED,
      pickupCode: 'PK-6601',
      fineAmount: 0,
      kondisiPinjam: KondisiArsip.BAIK,
      catatanKondisiPinjam: 'Kondisi arsip baik.',
    },
    {
      userId: getUserId('mahasiswa6@gmail.com'),
      archiveId: getArchive('skripsi', 8).id,
      borrowDate: new Date(now.getTime() - 15 * dayMs),
      status: BorrowStatus.CANCELLED,
      fineAmount: 0,
    },
    {
      userId: getUserId('mahasiswa7@gmail.com'),
      archiveId: getArchive('skripsi', 9).id,
      borrowDate: new Date(now.getTime() - 12 * dayMs),
      accDate: new Date(now.getTime() - 12 * dayMs),
      returnDate: new Date(now.getTime() + 18 * dayMs),
      status: BorrowStatus.BORROWED,
      pickupCode: 'PK-7732',
      fineAmount: 0,
      kondisiPinjam: KondisiArsip.BAIK,
      catatanKondisiPinjam: 'Kondisi rapi.',
    },
    {
      userId: getUserId('mahasiswa7@gmail.com'),
      archiveId: getArchive('naskah', 4).id,
      borrowDate: new Date(now.getTime() - 8 * dayMs),
      status: BorrowStatus.REJECTED,
      rejectReason: 'Kuota peminjaman kategori Naskah Publikasi telah penuh.',
      fineAmount: 0,
    },
    {
      userId: getUserId('mahasiswa8@gmail.com'),
      archiveId: getArchive('skripsi', 10).id,
      borrowDate: new Date(now.getTime() - 38 * dayMs),
      accDate: new Date(now.getTime() - 38 * dayMs),
      returnDate: new Date(now.getTime() - 8 * dayMs),
      status: BorrowStatus.OVERDUE,
      pickupCode: 'PK-8809',
      fineAmount: 60000,
      finePaidAt: null,
      kondisiPinjam: KondisiArsip.BAIK,
      catatanKondisiPinjam: 'Kondisi buku baik.',
    },
    {
      userId: getUserId('mahasiswa8@gmail.com'),
      archiveId: getArchive('ringkasan', 4).id,
      borrowDate: new Date(now.getTime() - 75 * dayMs),
      accDate: new Date(now.getTime() - 75 * dayMs),
      returnDate: new Date(now.getTime() - 25 * dayMs),
      status: BorrowStatus.RETURNED,
      pickupCode: 'PK-8199',
      fineAmount: 50000,
      finePaidAt: new Date(now.getTime() - 24 * dayMs),
      finePaymentMethod: 'Tunai',
      fineReceivedBy: 'petugas2@gmail.com',
      fineNotes: 'Denda keterlambatan 3 hari dibayar tunai di kasir.',
      kondisiPinjam: KondisiArsip.BAIK,
      kondisiKembali: KondisiArsip.BAIK,
      catatanKondisiKembali: 'Kondisi baik, denda telah dilunasi.',
    },
    {
      userId: getUserId('mahasiswa9@gmail.com'),
      archiveId: getArchive('skripsi', 11).id,
      borrowDate: new Date(now.getTime() - 8 * dayMs),
      accDate: new Date(now.getTime() - 8 * dayMs),
      returnDate: new Date(now.getTime() + 22 * dayMs),
      status: BorrowStatus.BORROWED,
      pickupCode: 'PK-9944',
      fineAmount: 0,
      kondisiPinjam: KondisiArsip.BAIK,
      catatanKondisiPinjam: 'Arsip baru, kondisi sangat baik.',
    },
    {
      userId: getUserId('mahasiswa9@gmail.com'),
      archiveId: getArchive('ringkasan', 5).id,
      borrowDate: new Date(now.getTime() - 40 * dayMs),
      accDate: new Date(now.getTime() - 40 * dayMs),
      returnDate: new Date(now.getTime() - 15 * dayMs),
      status: BorrowStatus.RETURNED,
      pickupCode: 'PK-9120',
      fineAmount: 0,
      kondisiPinjam: KondisiArsip.BAIK,
      kondisiKembali: KondisiArsip.BAIK,
      catatanKondisiKembali: 'Dikembalikan lengkap.',
    },
    {
      userId: getUserId('mahasiswa10@gmail.com'),
      archiveId: getArchive('skripsi', 12).id,
      borrowDate: new Date(now.getTime() - 1 * dayMs),
      accDate: new Date(now.getTime() - 1 * dayMs),
      status: BorrowStatus.WAITING_PICKUP,
      pickupCode: 'PK-2041',
      fineAmount: 0,
    },
    {
      userId: getUserId('mahasiswa10@gmail.com'),
      archiveId: getArchive('naskah', 5).id,
      borrowDate: new Date(now.getTime() - 55 * dayMs),
      accDate: new Date(now.getTime() - 55 * dayMs),
      returnDate: new Date(now.getTime() - 30 * dayMs),
      status: BorrowStatus.RETURNED,
      pickupCode: 'PK-1099',
      fineAmount: 0,
      kondisiPinjam: KondisiArsip.BAIK,
      kondisiKembali: KondisiArsip.BAIK,
      catatanKondisiKembali: 'Selesai tepat waktu.',
    },
  ];

  for (const bData of borrowingsData) {
    await prisma.borrowing.create({ data: bData });
  }

  const reservedSummary = await prisma.borrowing.groupBy({
    by: ['archiveId'],
    where: {
      status: { in: [BorrowStatus.REQUESTED, BorrowStatus.WAITING_PICKUP] },
    },
    _count: { id: true },
  });

  for (const item of reservedSummary) {
    await prisma.archive.update({
      where: { id: item.archiveId },
      data: { reservedQuantity: item._count.id },
    });
  }

  console.log(`✅ Berhasil membuat ${borrowingsData.length} data transaksi sirkulasi & denda.`);
  console.log('\n====================================================');
  console.log('🎉 PROSES SEEDING SELESAI DENGAN SUKSES!');
  console.log('====================================================');
}

main()
  .catch((e) => {
    console.error('❌ Terjadi kesalahan saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

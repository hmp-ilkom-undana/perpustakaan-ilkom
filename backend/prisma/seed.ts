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

  // 3. MEMERIKSA DATA ARSIP YANG SUDAH ADA
  console.log('📚 [3/4] Memeriksa Data Arsip di Database...');
  const existingArchives = await prisma.archive.findMany({
    orderBy: { createdAt: 'asc' },
  });

  if (existingArchives.length === 0) {
    console.warn('⚠️  PERINGATAN: Tidak ditemukan data Arsip di database.');
    console.warn('Pastikan data arsip telah diisi atau diimpor terlebih dahulu.');
    return;
  }

  console.log(`ℹ️  Ditemukan ${existingArchives.length} koleksi arsip di database.`);

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
    // A. TRANSAKSI UNTUK MAHASISWA 1 (DEMO UTAMA)
    // ==========================================
    {
      userId: getUserId('mahasiswa1@gmail.com'),
      archiveId: getArchive('skripsi', 0).id,
      borrowDate: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      status: BorrowStatus.REQUESTED,
      fineAmount: 0,
    },
    {
      userId: getUserId('mahasiswa1@gmail.com'),
      archiveId: getArchive('ringkasan', 0).id,
      borrowDate: new Date(now.getTime() - 1 * dayMs),
      accDate: new Date(now.getTime() - 1 * dayMs),
      status: BorrowStatus.WAITING_PICKUP,
      pickupCode: 'PK-8821',
      fineAmount: 0,
    },
    {
      userId: getUserId('mahasiswa1@gmail.com'),
      archiveId: getArchive('skripsi', 1).id,
      borrowDate: new Date(now.getTime() - 10 * dayMs),
      accDate: new Date(now.getTime() - 10 * dayMs),
      returnDate: new Date(now.getTime() + 20 * dayMs),
      status: BorrowStatus.BORROWED,
      pickupCode: 'PK-7741',
      fineAmount: 0,
      kondisiPinjam: KondisiArsip.BAIK,
      catatanKondisiPinjam: 'Fisik buku mulus, halaman lengkap dan jilid rapi.',
    },
    {
      userId: getUserId('mahasiswa1@gmail.com'),
      archiveId: getArchive('naskah', 0).id,
      borrowDate: new Date(now.getTime() - 40 * dayMs),
      accDate: new Date(now.getTime() - 40 * dayMs),
      returnDate: new Date(now.getTime() - 10 * dayMs),
      status: BorrowStatus.OVERDUE,
      pickupCode: 'PK-3319',
      fineAmount: 80000,
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

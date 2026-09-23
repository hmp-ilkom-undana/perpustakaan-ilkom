import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
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
  console.log('🚀 INISIALISASI DATABASE & SEEDING AKUN ADMIN HMP');
  console.log('====================================================\n');

  // 1. PEMBERSIHAN DATA LAMA (CLEANUP)
  console.log('🧹 [1/3] Membersihkan data arsip, sirkulasi, dan akun lama...');
  await prisma.activityLog.deleteMany();
  await prisma.borrowing.deleteMany();
  await prisma.archive.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Database bersih dari arsip dan riwayat lama.\n');

  // 2. SISTEM PENGATURAN DEFAULT
  console.log('⚙️  [2/3] Menyiapkan Pengaturan Sistem Default...');
  await prisma.systemSetting.upsert({
    where: { id: 'DEFAULT' },
    update: {},
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
  console.log('✅ Pengaturan sistem default aktif.\n');

  // 3. PEMBUATAN AKUN ADMIN HMP
  console.log('👑 [3/3] Mendaftarkan Akun Administrator Tunggal...');
  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL;
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_DEFAULT_EMAIL atau ADMIN_DEFAULT_PASSWORD belum dikonfigurasi di file .env');
  }

  const adminName = 'Administrator Perpustakaan ILKOM';
  const adminUsername = adminEmail.split('@')[0];

  try {
    await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: adminName,
        username: adminUsername,
      },
    });
    console.log(`[+] Akun ADMIN (${adminEmail}) berhasil didaftarkan di Better-Auth.`);
  } catch (error) {
    console.log(`[i] Akun ADMIN (${adminEmail}) sudah ada, menyelaraskan kredensial...`);
  }

  await prisma.user.updateMany({
    where: { email: adminEmail },
    data: {
      name: adminName,
      nim: null,
      wa_number: null,
      role: Role.ADMIN,
      emailVerified: true,
    },
  });

  console.log('✅ Role ADMIN dan verifikasi akun berhasil dikonfirmasi.');
  console.log('\n====================================================');
  console.log('🎉 SEEDING SELESAI: Database bersih, hanya akun ADMIN aktif!');
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

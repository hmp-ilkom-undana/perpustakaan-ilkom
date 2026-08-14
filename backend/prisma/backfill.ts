import 'dotenv/config';
import pkg from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { PrismaClient } = pkg;
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Cari semua arsip yang kode arsipnya masih kosong
  const archives = await prisma.archive.findMany({
    where: {
      OR: [
        { archiveCode: '' },
        { archiveCode: null as unknown as string },
      ],
    },
    orderBy: { createdAt: 'asc' },
  });

  console.log(`Menemukan ${archives.length} arsip yang butuh kode...`);

  const counters: Record<string, number> = {};

  for (const archive of archives) {
    let prefix = 'UMM';
    if (archive.archiveType === 'Skripsi') prefix = 'SKR';
    else if (archive.archiveType === 'Ringkasan Skripsi') prefix = 'RKS';
    else if (archive.archiveType === 'Naskah Publikasi') prefix = 'NPB';

    // Set nilai hitungan (counter) jika belum ada di memori
    if (!counters[prefix]) {
      const last = await prisma.archive.findFirst({
        where: { archiveCode: { startsWith: `${prefix}-` } },
        orderBy: { archiveCode: 'desc' },
      });
      if (last && last.archiveCode) {
        counters[prefix] = parseInt(last.archiveCode.split('-')[1], 10) + 1;
      } else {
        counters[prefix] = 1;
      }
    }

    // Generate kode
    const code = `${prefix}-${counters[prefix].toString().padStart(4, '0')}`;
    counters[prefix]++; // Tambah angka untuk arsip selanjutnya dengan prefix yang sama

    // Simpan ke database
    await prisma.archive.update({
      where: { id: archive.id },
      data: { archiveCode: code },
    });
    console.log(
      `✅ [${code}] berhasil diatur untuk arsip: ${archive.title.substring(0, 30)}...`,
    );
  }

  console.log(
    '\nProses Backfill Selesai! Semua data arsip sekarang memiliki kode unik.',
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

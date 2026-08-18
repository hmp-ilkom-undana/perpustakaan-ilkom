// backend/src/archive/archive.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArchiveDto } from './dto/create-archive.dto';
import { UpdateArchiveDto } from './dto/update-archive.dto';
import * as xlsx from 'xlsx';

@Injectable()
export class ArchiveService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    page: number;
    limit: number;
    search?: string;
    type?: string;
    category?: string;
    availability?: string;
  }) {
    // Lapisan pertahanan kedua: pastikan nilai page dan limit selalu angka valid (>= 1)
    const pageNum = Math.max(
      1,
      Number.isInteger(params.page) ? params.page : 1,
    );
    const limitNum = Math.max(
      1,
      Number.isInteger(params.limit) ? params.limit : 10,
    );
    const { search, type, category, availability } = params;
    const skip = (pageNum - 1) * limitNum;
    const where: any = {};

    if (search) {
      where.OR = [
        { archiveCode: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type && type !== 'all' && type !== 'Semua') {
      where.archiveType = type;
    }

    if (category && category !== 'all' && category !== 'Semua') {
      where.category = category;
    }

    if (availability === 'Tersedia') {
      const results: { id: string }[] = await this.prisma.$queryRawUnsafe(`
        SELECT id FROM "Archive" WHERE ("quantity" - "reservedQuantity") > 0 AND "status" != 'DIPINJAM'
      `);
      where.id = { in: results.map((r) => r.id) };
    } else if (availability === 'Diajukan') {
      const results: { id: string }[] = await this.prisma.$queryRawUnsafe(`
        SELECT DISTINCT a.id FROM "Archive" a
        LEFT JOIN "Borrowing" b ON b."archiveId" = a.id
        WHERE a."reservedQuantity" > 0 OR b."status" IN ('REQUESTED', 'WAITING_PICKUP')
      `);
      where.id = { in: results.map((r) => r.id) };
    } else if (availability === 'Dipinjam') {
      const results: { id: string }[] = await this.prisma.$queryRawUnsafe(`
        SELECT id FROM "Archive" WHERE ("quantity" - "reservedQuantity") <= 0 OR "status" = 'DIPINJAM'
      `);
      where.id = { in: results.map((r) => r.id) };
    }

    const [data, total] = await Promise.all([
      this.prisma.archive.findMany({
        where,
        skip,
        take: limitNum,
        select: {
          id: true,
          archiveCode: true,
          title: true,
          author: true,
          year: true,
          category: true,
          archiveType: true,
          quantity: true,
          reservedQuantity: true,
          shelfLocation: true,
          status: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.archive.count({ where }),
    ]);
    return {
      data,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async generateArchiveCode(archiveType: string): Promise<string> {
    let prefix = 'UMM'; // Default
    if (archiveType === 'Skripsi') prefix = 'SKR';
    else if (archiveType === 'Ringkasan Skripsi') prefix = 'RKS';
    else if (archiveType === 'Naskah Publikasi') prefix = 'NPB';
    const lastArchive = await this.prisma.archive.findFirst({
      where: { archiveCode: { startsWith: `${prefix}-` } },
      orderBy: { archiveCode: 'desc' },
    });
    if (!lastArchive || !lastArchive.archiveCode) {
      return `${prefix}-0001`; 
    }
    const lastNumberStr = lastArchive.archiveCode.split('-')[1];
    const parsedNumber = parseInt(lastNumberStr, 10);
    const nextNumber = isNaN(parsedNumber) ? 1 : parsedNumber + 1;

    const paddedNumber = nextNumber.toString().padStart(4, '0');
    return `${prefix}-${paddedNumber}`;
  }
  async create(createArchiveDto: CreateArchiveDto) {
    const generatedCode = await this.generateArchiveCode(
      createArchiveDto.archiveType,
    );
    return this.prisma.archive.create({
      data: {
        archiveCode: generatedCode,
        title: createArchiveDto.title,
        author: createArchiveDto.author,
        year: createArchiveDto.year,
        category: createArchiveDto.category,
        archiveType: createArchiveDto.archiveType,
        quantity: createArchiveDto.quantity ?? 1,
        shelfLocation: createArchiveDto.shelfLocation,
      },
    });
  }

  async findOne(id: string) {
    const archive = await this.prisma.archive.findUnique({
      where: { id },
    });

    if (!archive) {
      throw new NotFoundException(`Arsip dengan ID ${id} tidak ditemukan`);
    }

    return archive;
  }

  async update(id: string, updateArchiveDto: UpdateArchiveDto) {
    const existingArchive = await this.prisma.archive.findUnique({
      where: { id },
    });
    if (!existingArchive)
      throw new NotFoundException(`Arsip dengan ID ${id} tidak ditemukan`);

    return this.prisma.archive.update({
      where: { id },
      data: updateArchiveDto,
    });
  }

  async remove(id: string) {
    const existingArchive = await this.prisma.archive.findUnique({
      where: { id },
    });
    if (!existingArchive)
      throw new NotFoundException(`Arsip dengan ID ${id} tidak ditemukan`);

    return this.prisma.archive.delete({ where: { id } });
  }

  // LOGIKA IMPORT EXCEL
  async importExcel(buffer: Buffer, archiveType: string) {
    // 1. Baca Buffer Excel menjadi JSON
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames?.[0];
    if (!sheetName) {
      return { success: 0, skipped: 0, total: 0 };
    }
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json<any>(sheet);

    console.log(
      `[IMPORT] Memproses import Excel untuk jenis: "${archiveType}", Total baris dibaca: ${rows.length}`,
    );
    if (rows.length > 0) {
      console.log('[IMPORT] Sample kolom baris pertama:', Object.keys(rows[0]));
    }

    // 2. Ambil semua arsip existing DENGAN archiveType untuk cek duplikasi secara spesifik per jenis arsip
    const existingArchives = await this.prisma.archive.findMany({
      where: { archiveType: archiveType },
      select: { title: true, author: true, year: true, archiveType: true },
    });
    const existingSet = new Set(
      existingArchives.map(
        (a) =>
          `${(a.title || '').trim().toLowerCase()}|${(a.author || '').trim().toLowerCase()}|${a.year}|${(a.archiveType || '').trim().toLowerCase()}`,
      ),
    );

    let prefix = 'UMM';
    if (archiveType === 'Skripsi') prefix = 'SKR';
    else if (archiveType === 'Ringkasan Skripsi') prefix = 'RKS';
    else if (archiveType === 'Naskah Publikasi') prefix = 'NPB';

    let nextSeqNumber = 1;
    const lastArchive = await this.prisma.archive.findFirst({
      where: { archiveCode: { startsWith: `${prefix}-` } },
      orderBy: { archiveCode: 'desc' },
    });
    if (lastArchive && lastArchive.archiveCode) {
      const lastNumberStr = lastArchive.archiveCode.split('-')[1];
      const parsedNumber = parseInt(lastNumberStr, 10);
      nextSeqNumber = isNaN(parsedNumber) ? 1 : parsedNumber + 1;
    }

    const validDataToInsert: any[] = [];
    let skippedCount = 0;

    for (const row of rows) {
      let title = '';
      let author = '';
      let year: number | null = null;
      let category = 'Umum';
      let quantity = 1;
      let shelfLocation: string | null = null;

      // 3. Ekstrak data secara fleksibel (toleran terhadap variasi nama kolom dan huruf besar/kecil)
      for (const [rawKey, rawVal] of Object.entries(row)) {
        if (rawVal === undefined || rawVal === null) continue;
        const key = rawKey.trim().toLowerCase();
        const val = rawVal.toString().trim();
        if (!val) continue;

        if (
          !title &&
          (key.includes('judul') ||
            key.includes('title') ||
            key.includes('naskah') ||
            key.includes('makalah') ||
            key.includes('karya') ||
            key === 'skripsi')
        ) {
          title = val;
        } else if (
          !author &&
          (key.includes('penulis') ||
            key.includes('author') ||
            key.includes('pengarang') ||
            key === 'nama' ||
            key === 'nama mahasiswa' ||
            key.startsWith('nama'))
        ) {
          if (
            !key.includes('pembimbing') &&
            !key.includes('penguji') &&
            !key.includes('dosen')
          ) {
            author = val;
          }
        } else if (
          year === null &&
          (key.includes('tahun') || key.includes('year') || key.includes('thn'))
        ) {
          const match = val.match(/\b(19\d{2}|20\d{2})\b/);
          if (match) {
            year = parseInt(match[0], 10);
          }
        } else if (
          key.includes('kategori') ||
          key.includes('category') ||
          key.includes('bidang') ||
          key.includes('topik') ||
          key.includes('peminatan')
        ) {
          category = val;
        } else if (
          key.includes('jumlah') ||
          key.includes('stok') ||
          key.includes('qty') ||
          key.includes('stock') ||
          key.includes('eks')
        ) {
          const parsedQty = parseInt(val, 10);
          if (!isNaN(parsedQty) && parsedQty > 0) {
            quantity = parsedQty;
          }
        } else if (
          key.includes('lokasi') ||
          key.includes('rak') ||
          key.includes('shelf') ||
          key.includes('lemari')
        ) {
          shelfLocation = val;
        }
      }

      // Fallback matching jika belum terdeteksi dari perulangan
      if (!title) {
        title =
          row['JUDUL'] ||
          row['Judul'] ||
          row['judul'] ||
          row['Title'] ||
          row['TITLE'] ||
          '';
      }
      if (!author) {
        author =
          row['PENULIS'] ||
          row['Penulis'] ||
          row['penulis'] ||
          row['NAMA'] ||
          row['Nama'] ||
          row['nama'] ||
          '';
      }
      if (year === null) {
        const rawYear =
          row['TAHUN'] ||
          row['Tahun'] ||
          row['tahun'] ||
          row['Year'] ||
          row['YEAR'];
        if (rawYear) {
          const match = rawYear.toString().match(/\b(19\d{2}|20\d{2})\b/);
          year = match
            ? parseInt(match[0], 10)
            : parseInt(rawYear.toString(), 10);
        }
        if (!year || isNaN(year)) {
          year = new Date().getFullYear();
        }
      }

      // 4. Validasi kolom wajib (Skip HANYA jika Judul atau Penulis kosong)
      if (!title || !author) {
        skippedCount++;
        continue;
      }

      // 5. Cleansing Kategori
      if (!category) category = 'Umum';
      if (
        typeof category === 'string' &&
        category.trim().toLowerCase() === 'machine larning'
      ) {
        category = 'Machine Learning';
      }

      const titleStr = title.toString().trim();
      const authorStr = author.toString().trim();

      // 6. Cek Duplikasi (Spesifik per jenis arsip)
      const uniqueKey = `${titleStr.toLowerCase()}|${authorStr.toLowerCase()}|${year}|${archiveType.trim().toLowerCase()}`;
      if (existingSet.has(uniqueKey)) {
        skippedCount++;
        continue;
      }

      existingSet.add(uniqueKey);

      const paddedNumber = nextSeqNumber.toString().padStart(4, '0');
      const generatedCode = `${prefix}-${paddedNumber}`;
      nextSeqNumber++;

      validDataToInsert.push({
        archiveCode: generatedCode,
        title: titleStr,
        author: authorStr,
        year: year,
        category: category.toString().trim(),
        archiveType: archiveType,
        quantity: quantity,
        shelfLocation: shelfLocation ? shelfLocation.toString().trim() : null,
      });
    }

    // 7. Bulk Insert ke Database
    if (validDataToInsert.length > 0) {
      await this.prisma.archive.createMany({
        data: validDataToInsert,
      });
    }

    console.log(
      `[IMPORT] Selesai: Berhasil insert ${validDataToInsert.length} baris, Skip ${skippedCount} baris`,
    );

    return {
      success: validDataToInsert.length,
      skipped: skippedCount,
      total: rows.length,
    };
  }
}

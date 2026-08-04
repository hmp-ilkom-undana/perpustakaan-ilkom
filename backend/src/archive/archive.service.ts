// backend/src/archive/archive.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArchiveDto } from './dto/create-archive.dto';
import { UpdateArchiveDto } from './dto/update-archive.dto';
import * as xlsx from 'xlsx'; 

@Injectable()
export class ArchiveService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.archive.findMany({
      select: {
        id: true, title: true, author: true, year: true, category: true,
        archiveType: true, quantity: true, reservedQuantity: true, shelfLocation: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(createArchiveDto: CreateArchiveDto) {
    return this.prisma.archive.create({
      data: {
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

  async update(id: string, updateArchiveDto: UpdateArchiveDto) {
    const existingArchive = await this.prisma.archive.findUnique({ where: { id } });
    if (!existingArchive) throw new NotFoundException(`Arsip dengan ID ${id} tidak ditemukan`);

    return this.prisma.archive.update({
      where: { id },
      data: updateArchiveDto,
    });
  }

  async remove(id: string) {
    const existingArchive = await this.prisma.archive.findUnique({ where: { id } });
    if (!existingArchive) throw new NotFoundException(`Arsip dengan ID ${id} tidak ditemukan`);

    return this.prisma.archive.delete({ where: { id } });
  }

  // LOGIKA IMPORT EXCEL 
  async importExcel(buffer: Buffer, archiveType: string) {
    // 1. Baca Buffer Excel menjadi JSON
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames?.[0]; // Ambil sheet pertama
    if (!sheetName) {
      return { success: 0, skipped: 0, total: 0 };
    }
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json<any>(sheet);

    // 2. Ambil semua arsip existing untuk cek duplikasi secara efisien di memori (Set)
    const existingArchives = await this.prisma.archive.findMany({
      select: { title: true, author: true, year: true }
    });
    const existingSet = new Set(
      existingArchives.map(a => `${(a.title || '').trim().toLowerCase()}|${(a.author || '').trim().toLowerCase()}|${a.year}`)
    );

    const validDataToInsert: any[] = [];
    let skippedCount = 0;

    for (const row of rows) {
      // 3. Ekstrak data (Handle nama kolom yang beda kapitalisasinya)
      const title = row['JUDUL'] || row['Judul'] || row['judul'];
      const author = row['PENULIS'] || row['Penulis'] || row['penulis'];
      const yearRaw = row['TAHUN'] || row['Tahun'] || row['tahun'];
      let category = row['KATEGORI'] || row['Kategori'] || row['kategori'];
      const quantityRaw = row['JUMLAH'] || row['Jumlah'] || row['jumlah'];
      const shelfLocation = row['Lokasi Rak'] || row['LOKASI RAK'] || null;

      // 4. Validasi kolom wajib (Skip jika kosong)
      if (!title || !author || !yearRaw || quantityRaw === undefined || quantityRaw === null) {
        skippedCount++;
        continue;
      }

      // 5. Cleansing Data
      if (!category) category = 'Umum'; // Handle NaN / kosong
      if (typeof category === 'string' && category.trim().toLowerCase() === 'machine larning') {
        category = 'Machine Learning'; // Fix Typo
      }

      const year = parseInt(yearRaw.toString(), 10);
      const quantity = parseInt(quantityRaw.toString(), 10);

      // Lewati jika tahun atau jumlah gagal di-parse menjadi angka
      if (isNaN(year) || isNaN(quantity)) {
        skippedCount++;
        continue;
      }

      const titleStr = title.toString().trim();
      const authorStr = author.toString().trim();
      
      // 6. Cek Duplikasi
      const uniqueKey = `${titleStr.toLowerCase()}|${authorStr.toLowerCase()}|${year}`;
      if (existingSet.has(uniqueKey)) {
        skippedCount++;
        continue; // Skip jika sudah ada di database atau sudah ditambahkan dari baris Excel sebelumnya
      }

      // Tandai sudah diproses agar tidak ada duplikasi internal di dalam file Excel itu sendiri
      existingSet.add(uniqueKey);

      // Siapkan data yang valid
      validDataToInsert.push({
        title: titleStr,
        author: authorStr,
        year: year,
        category: category.toString().trim(),
        archiveType: archiveType,
        quantity: quantity,
        shelfLocation: shelfLocation ? shelfLocation.toString().trim() : null,
      });
    }

    // 7. Bulk Insert 
    if (validDataToInsert.length > 0) {
      await this.prisma.archive.createMany({
        data: validDataToInsert,
      });
    }

    return {
      success: validDataToInsert.length,
      skipped: skippedCount,
      total: rows.length,
    };
  }
}

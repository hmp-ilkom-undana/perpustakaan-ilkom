import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArchiveDto } from './dto/create-archive.dto';
import { UpdateArchiveDto } from './dto/update-archive.dto';

@Injectable()
export class ArchiveService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.archive.findMany({
      select: {
        id: true,
        title: true,
        author: true,
        year: true,
        category: true,
        archiveType: true,
        quantity: true,
        reservedQuantity: true,
        shelfLocation: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(createArchiveDto: CreateArchiveDto) {
    // Insert data baru ke database
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
    // Pastikan arsip dengan ID tersebut benar-benar ada sebelum di-update
    const existingArchive = await this.prisma.archive.findUnique({
      where: { id },
    });
    if (!existingArchive) {
      throw new NotFoundException(`Arsip dengan ID ${id} tidak ditemukan`);
    }
    // Lakukan update hanya untuk field yang dikirimkan (opsional)
    return this.prisma.archive.update({
      where: { id },
      data: updateArchiveDto,
    });
  }
  async remove(id: string) {
    // Pastikan data ada sebelum dihapus
    const existingArchive = await this.prisma.archive.findUnique({
      where: { id },
    });
    if (!existingArchive) {
      throw new NotFoundException(`Arsip dengan ID ${id} tidak ditemukan`);
    }
    // Hapus data dari database
    return this.prisma.archive.delete({
      where: { id },
    });
  }
}

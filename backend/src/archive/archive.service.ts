import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArchiveService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.archive.findMany({
      where: {
        status: 'TERSEDIA',
      },
      select: {
        id: true,
        title: true,
        author: true,
        year: true,
        category: true,
        archiveType: true,
        quantity: true,
        reservedQuantity: true,
      },
    });
  }
}

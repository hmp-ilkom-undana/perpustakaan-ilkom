import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DriveService } from './drive.service';

@Injectable()
export class BorrowingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly driveService: DriveService,
  ) {}

  async requestBorrow(userId: string, archiveId: string) {
    return await this.prisma.$transaction(async (tx) => {
      const archive = await tx.archive.findUnique({
        where: { id: archiveId },
      });

      if (!archive) {
        throw new BadRequestException('Arsip tidak ditemukan.');
      }

      const activeBorrowings = await tx.borrowing.findMany({
        where: {
          userId: userId,
          status: {
            in: ['REQUESTED', 'WAITING_PICKUP', 'BORROWED', 'OVERDUE'],
          },
        },
        include: {
          archive: true,
        },
      });

      let countSkripsi = 0;
      let countRingkasan = 0;
      let countNaskah = 0;

      for (const b of activeBorrowings) {
        const type = b.archive.archiveType.toUpperCase().replace(' ', '_');
        if (type === 'SKRIPSI') countSkripsi++;
        else if (type === 'RINGKASAN_SKRIPSI') countRingkasan++;
        else if (type === 'NASKAH_PUBLIKASI') countNaskah++;
      }

      const reqType = archive.archiveType.toUpperCase().replace(' ', '_');

      if (reqType === 'SKRIPSI' && countSkripsi >= 2) {
        throw new BadRequestException(
          'Batas maksimal peminjaman (2 Skripsi) telah tercapai.',
        );
      }
      if (reqType === 'RINGKASAN_SKRIPSI' && countRingkasan >= 1) {
        throw new BadRequestException(
          'Batas maksimal peminjaman (1 Ringkasan Skripsi) telah tercapai.',
        );
      }
      if (reqType === 'NASKAH_PUBLIKASI' && countNaskah >= 1) {
        throw new BadRequestException(
          'Batas maksimal peminjaman (1 Naskah Publikasi) telah tercapai.',
        );
      }

      const availableStock = archive.quantity - archive.reservedQuantity;
      if (availableStock <= 0) {
        throw new BadRequestException(
          'Maaf, stok arsip ini sedang kosong atau sudah dipesan orang lain.',
        );
      }

      await tx.archive.update({
        where: { id: archiveId },
        data: {
          reservedQuantity: { increment: 1 },
        },
      });

      const borrowing = await tx.borrowing.create({
        data: {
          userId: userId,
          archiveId: archiveId,
          status: 'REQUESTED',
        },
      });

      return borrowing;
    });
  }
  
  async getMyBorrowings(userId: string) {
    return this.prisma.borrowing.findMany({
      where: { userId: userId },
      include: {
        archive: {
          select: {
            title: true,
            author: true,
            archiveType: true,
            category: true,
          },
        },
      },
      orderBy: {
        borrowDate: 'desc',
      },
    });
  }

  async cancelBorrowing(userId: string, borrowingId: string) {
    return await this.prisma.$transaction(async (tx) => {
      const borrowing = await tx.borrowing.findUnique({
        where: { id: borrowingId },
      });

      if (!borrowing) {
        throw new BadRequestException('Peminjaman tidak ditemukan.');
      }

      if (borrowing.userId !== userId) {
        throw new BadRequestException(
          'Anda tidak berhak membatalkan antrean ini.',
        );
      }

      if (
        borrowing.status !== 'REQUESTED' &&
        borrowing.status !== 'WAITING_PICKUP'
      ) {
        throw new BadRequestException(
          'Hanya antrean yang belum dipinjam yang dapat dibatalkan.',
        );
      }

      await tx.archive.update({
        where: { id: borrowing.archiveId },
        data: { reservedQuantity: { decrement: 1 } },
      });

      const updatedBorrowing = await tx.borrowing.update({
        where: { id: borrowingId },
        data: {
          status: 'CANCELLED',
          returnDate: new Date(),
        },
      });

      return updatedBorrowing;
    });
  }

  // ==========================================
  // TAHAP 1: FITUR PETUGAS (ACC PEMINJAMAN)
  // ==========================================

  async getActiveBorrowings() {
    return this.prisma.borrowing.findMany({
      where: {
        status: {
          in: ['REQUESTED', 'WAITING_PICKUP', 'BORROWED', 'OVERDUE'],
        }
      },
      include: {
        user: {
          select: {
            name: true,
            nim: true,
            role: true,
          }
        },
        archive: {
          select: {
            title: true,
            author: true,
            archiveType: true,
            category: true,
          }
        }
      },
      orderBy: {
        borrowDate: 'asc', // Yang mengantre lebih dulu di atas
      }
    });
  }

  async approveBorrowing(borrowingId: string) {
    const borrowing = await this.prisma.borrowing.findUnique({
      where: { id: borrowingId }
    });

    if (!borrowing) {
      throw new BadRequestException('Peminjaman tidak ditemukan.');
    }

    if (borrowing.status !== 'REQUESTED') {
      throw new BadRequestException('Hanya peminjaman berstatus REQUESTED yang bisa disetujui.');
    }

    // Generate random pickup code (Contoh: P-A1B2C3)
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    const pickupCode = `P-${randomString}`;

    return this.prisma.borrowing.update({
      where: { id: borrowingId },
      data: {
        status: 'WAITING_PICKUP',
        pickupCode: pickupCode,
        accDate: new Date()
      }
    });
  }

  async rejectBorrowing(borrowingId: string, reason?: string) {
    return await this.prisma.$transaction(async (tx) => {
      const borrowing = await tx.borrowing.findUnique({
        where: { id: borrowingId }
      });

      if (!borrowing) {
        throw new BadRequestException('Peminjaman tidak ditemukan.');
      }

      if (borrowing.status !== 'REQUESTED') {
        throw new BadRequestException('Hanya peminjaman berstatus REQUESTED yang bisa ditolak.');
      }

      // Kembalikan stok
      await tx.archive.update({
        where: { id: borrowing.archiveId },
        data: { reservedQuantity: { decrement: 1 } },
      });

      // Ubah status jadi REJECTED
      return tx.borrowing.update({
        where: { id: borrowingId },
        data: {
          status: 'REJECTED',
          returnDate: new Date(),
          rejectReason: reason || null
        }
      });
    });
  }

  async handoverBorrowing(borrowingId: string, file?: Express.Multer.File) {
    return await this.prisma.$transaction(async (tx) => {
      const borrowing = await tx.borrowing.findUnique({
        where: { id: borrowingId }
      });

      if (!borrowing) {
        throw new BadRequestException('Peminjaman tidak ditemukan.');
      }

      if (borrowing.status !== 'WAITING_PICKUP') {
        throw new BadRequestException('Hanya peminjaman berstatus WAITING_PICKUP yang bisa diserahkan.');
      }

      // Upload file jika ada
      let fotoUrl: string | null = null;
      if (file) {
        const timestamp = new Date().getTime();
        const fileName = `SerahTerima_${borrowing.pickupCode}_${timestamp}.jpg`;
        fotoUrl = await this.driveService.uploadPhoto(file, fileName, 'PEMINJAMAN');
      }

      // 1. Ubah status jadi BORROWED
      // 2. Set returnDate (+30 hari)
      const today = new Date();
      const returnDate = new Date();
      returnDate.setDate(today.getDate() + 30);

      return await tx.borrowing.update({
        where: { id: borrowingId },
        data: {
          status: 'BORROWED',
          borrowDate: today,
          returnDate: returnDate,
          fotoUrlPinjam: fotoUrl
        }
      });
    });
  }
}

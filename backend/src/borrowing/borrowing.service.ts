import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DriveService } from './drive.service';
import { SettingService } from '../setting/setting.service';
import * as crypto from 'crypto';

@Injectable()
export class BorrowingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly driveService: DriveService,
    private readonly settingService: SettingService,
  ) {}

  async requestBorrow(userId: string, archiveId: string) {
    const settings = await this.settingService.getSettings();

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
        const type = b.archive?.archiveType?.toUpperCase().replace(' ', '_') || '';
        if (type === 'SKRIPSI') countSkripsi++;
        else if (type === 'RINGKASAN_SKRIPSI') countRingkasan++;
        else if (type === 'NASKAH_PUBLIKASI') countNaskah++;
      }

      const reqType = archive.archiveType?.toUpperCase().replace(' ', '_') || '';

      if (reqType === 'SKRIPSI' && countSkripsi >= settings.maxActiveSkripsi) {
        throw new BadRequestException(
          `Batas maksimal peminjaman (${settings.maxActiveSkripsi} Skripsi) telah tercapai.`,
        );
      }
      if (
        reqType === 'RINGKASAN_SKRIPSI' &&
        countRingkasan >= settings.maxActiveRingkasan
      ) {
        throw new BadRequestException(
          `Batas maksimal peminjaman (${settings.maxActiveRingkasan} Ringkasan Skripsi) telah tercapai.`,
        );
      }
      if (
        reqType === 'NASKAH_PUBLIKASI' &&
        countNaskah >= settings.maxActiveNaskah
      ) {
        throw new BadRequestException(
          `Batas maksimal peminjaman (${settings.maxActiveNaskah} Naskah Publikasi) telah tercapai.`,
        );
      }

      // Validasi 1 Pengguna Hanya Boleh 1 Arsip yang Sama
      const existingActiveBorrowing = await tx.borrowing.findFirst({
        where: {
          userId: userId,
          archiveId: archiveId,
          status: {
            in: ['REQUESTED', 'WAITING_PICKUP', 'BORROWED', 'OVERDUE'],
          },
        },
      });

      if (existingActiveBorrowing) {
        throw new BadRequestException(
          'Anda sedang mengajukan atau meminjam arsip ini. Tidak dapat meminjam 2 eksemplar yang sama secara bersamaan.',
        );
      }

      // Validasi Pengguna Terkena Denda/Tunggakan Belum Lunas
      const unpaidFinesCount = await tx.borrowing.count({
        where: {
          userId: userId,
          fineAmount: { gt: 0 },
          finePaidAt: null,
        },
      });

      if (unpaidFinesCount > 0) {
        throw new BadRequestException(
          'Anda memiliki tagihan denda keterlambatan atau kerusakan yang belum dilunasi. Harap selesaikan administrasi denda terlebih dahulu.',
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

      // Standar Unified Transaction Code: PK-XXXXXX
      const randomCode = crypto.randomBytes(3).toString('hex').toUpperCase();
      const pickupCode = `PK-${randomCode}`;

      const borrowing = await tx.borrowing.create({
        data: {
          userId: userId,
          archiveId: archiveId,
          status: 'REQUESTED',
          pickupCode: pickupCode,
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

    // Gunakan pickupCode yang sudah ada sejak pengajuan, atau generate format PK- baru jika belum ada
    const randomCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    const pickupCode = borrowing.pickupCode || `PK-${randomCode}`;

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
      // 2. Set returnDate (+loanDurationDays hari)
      const settings = await this.settingService.getSettings();
      const today = new Date();
      const returnDate = new Date();
      returnDate.setDate(today.getDate() + settings.loanDurationDays);

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

  async returnBorrowing(borrowingId: string, file: Express.Multer.File | undefined, kondisiStr: string, catatan?: string, fineAmountStr?: string) {
    if (!file) {
      throw new BadRequestException('Foto serah terima pengembalian wajib disertakan.');
    }

    return await this.prisma.$transaction(async (tx) => {
      const borrowing = await tx.borrowing.findUnique({
        where: { id: borrowingId }
      });

      if (!borrowing) {
        throw new BadRequestException('Peminjaman tidak ditemukan.');
      }

      if (borrowing.status !== 'BORROWED' && borrowing.status !== 'OVERDUE') {
        throw new BadRequestException('Hanya peminjaman berstatus BORROWED atau OVERDUE yang bisa dikembalikan.');
      }

      const timestamp = new Date().getTime();
      const fileName = `SerahTerimaKembali_${borrowing.pickupCode}_${timestamp}.jpg`;
      const fotoUrl = await this.driveService.uploadPhoto(file, fileName, 'PENGEMBALIAN');

      // Validasi Kondisi
      const kondisiKembali = kondisiStr === 'RUSAK' ? 'RUSAK' : (kondisiStr === 'HILANG' ? 'HILANG' : 'BAIK');
      let newStatus: 'RETURNED' | 'DAMAGED' | 'LOST' = 'RETURNED';
      if (kondisiKembali === 'RUSAK') newStatus = 'DAMAGED';
      if (kondisiKembali === 'HILANG') newStatus = 'LOST';

      // Kalkulasi Denda (Fines) otomatis berbasis hari kerja & kondisi fisik
      const settings = await this.settingService.getSettings();
      const fineResult = this.settingService.calculateFine({
        returnDate: borrowing.returnDate || new Date(),
        actualDate: new Date(),
        kondisi: kondisiKembali,
        settings,
      });
      const fine = fineResult.fineAmount;

      // Pengembalian stok
      if (kondisiKembali !== 'HILANG') {
        await tx.archive.update({
          where: { id: borrowing.archiveId },
          data: { reservedQuantity: { decrement: 1 } },
        });
      } else {
        await tx.archive.update({
          where: { id: borrowing.archiveId },
          data: { 
            reservedQuantity: { decrement: 1 },
            quantity: { decrement: 1 } // Kurangi stok asli karena hilang
          },
        });
      }

      return await tx.borrowing.update({
        where: { id: borrowingId },
        data: {
          status: newStatus,
          kondisiKembali: kondisiKembali as any,
          catatanKondisiKembali: catatan || null,
          fotoUrlKembali: fotoUrl,
          fineAmount: fine,
          returnDate: new Date(), // Menyimpan tanggal aktual dikembalikan
        }
      });
    });
  }
}

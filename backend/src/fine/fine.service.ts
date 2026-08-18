import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Service untuk mengelola pencatatan denda dan transaksi kasir pelunasan.
 */

@Injectable()
export class FineService {
  constructor(private readonly prisma: PrismaService) {}

  private determineFineType(borrowing: any): string {
    if (
      borrowing.kondisiKembali === 'RUSAK' ||
      borrowing.status === 'DAMAGED'
    ) {
      return 'Kerusakan Fisik';
    }
    if (borrowing.kondisiKembali === 'HILANG' || borrowing.status === 'LOST') {
      return 'Kehilangan Arsip';
    }
    return 'Terlambat';
  }

  private mapFine(borrowing: any) {
    return {
      id: borrowing.id,
      transactionId:
        borrowing.pickupCode || `PK-${borrowing.id.slice(0, 6).toUpperCase()}`,
      studentName: borrowing.user?.name || 'Mahasiswa',
      studentId: borrowing.user?.email
        ? borrowing.user.email.split('@')[0]
        : borrowing.userId.slice(0, 8),
      studentEmail: borrowing.user?.email || '',
      studentPhone: borrowing.user?.wa_number || '',
      archiveTitle: borrowing.archive?.title || 'Arsip',
      archiveCode: borrowing.archive?.archiveCode || '',
      fineType: this.determineFineType(borrowing),
      amount: borrowing.fineAmount,
      status: borrowing.finePaidAt ? 'PAID' : 'UNPAID',
      createdAt:
        borrowing.borrowDate?.toISOString() || new Date().toISOString(),
      paidAt: borrowing.finePaidAt?.toISOString() || null,
      paymentMethod: borrowing.finePaymentMethod || null,
      receivedBy: borrowing.fineReceivedBy || null,
      notes: borrowing.fineNotes || null,
      borrowStatus: borrowing.status,
    };
  }

  async getFines(params: { status?: string; search?: string }) {
    const { status, search } = params;

    const where: any = {
      fineAmount: { gt: 0 },
    };

    if (status === 'UNPAID') {
      where.finePaidAt = null;
    } else if (status === 'PAID') {
      where.finePaidAt = { not: null };
    }

    if (search && search.trim() !== '') {
      const q = search.trim();
      where.OR = [
        { id: { contains: q, mode: 'insensitive' } },
        { pickupCode: { contains: q, mode: 'insensitive' } },
        { user: { name: { contains: q, mode: 'insensitive' } } },
        { user: { email: { contains: q, mode: 'insensitive' } } },
        { archive: { title: { contains: q, mode: 'insensitive' } } },
        { archive: { archiveCode: { contains: q, mode: 'insensitive' } } },
      ];
    }

    const borrowings = await this.prisma.borrowing.findMany({
      where,
      include: {
        user: true,
        archive: true,
      },
      orderBy: [{ finePaidAt: 'desc' }, { borrowDate: 'desc' }],
    });

    return borrowings.map((b) => this.mapFine(b));
  }

  async getStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [unpaidBorrowings, paidBorrowings] = await Promise.all([
      this.prisma.borrowing.findMany({
        where: {
          fineAmount: { gt: 0 },
          finePaidAt: null,
        },
        select: {
          id: true,
          userId: true,
          fineAmount: true,
        },
      }),
      this.prisma.borrowing.findMany({
        where: {
          fineAmount: { gt: 0 },
          finePaidAt: { gte: startOfMonth },
        },
        select: {
          id: true,
          fineAmount: true,
        },
      }),
    ]);

    const totalUnpaidAmount = unpaidBorrowings.reduce(
      (sum, item) => sum + item.fineAmount,
      0,
    );
    const unpaidCount = unpaidBorrowings.length;

    // Total denda terbayar (bulan ini)
    const totalPaidAmount = paidBorrowings.reduce(
      (sum, item) => sum + item.fineAmount,
      0,
    );
    const paidCount = paidBorrowings.length;

    // Mahasiswa terblokir (memiliki denda unpaid > 0)
    const blockedStudentsCount = new Set(
      unpaidBorrowings.map((item) => item.userId),
    ).size;

    return {
      totalUnpaidAmount,
      unpaidCount,
      totalPaidAmount,
      paidCount,
      blockedStudentsCount,
    };
  }

  async payFine(
    borrowingId: string,
    officerName: string,
    payload: { paymentMethod: string; notes?: string },
  ) {
    const borrowing = await this.prisma.borrowing.findUnique({
      where: { id: borrowingId },
      include: { user: true, archive: true },
    });

    if (!borrowing) {
      throw new NotFoundException('Data transaksi peminjaman tidak ditemukan.');
    }

    if (borrowing.fineAmount <= 0) {
      throw new BadRequestException(
        'Transaksi ini tidak memiliki tagihan denda.',
      );
    }

    if (borrowing.finePaidAt) {
      throw new BadRequestException(
        'Denda transaksi ini sudah lunas sebelumnya.',
      );
    }

    // Update status pelunasan denda
    const updated = await this.prisma.borrowing.update({
      where: { id: borrowingId },
      data: {
        finePaidAt: new Date(),
        finePaymentMethod: payload.paymentMethod,
        fineReceivedBy: officerName,
        fineNotes: payload.notes || null,
        status: borrowing.status === 'OVERDUE' ? 'RETURNED' : borrowing.status,
      },
      include: {
        user: true,
        archive: true,
      },
    });

    return this.mapFine(updated);
  }
}

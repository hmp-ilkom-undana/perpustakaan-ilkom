import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface DashboardPeriodQuery {
  period?: 'hari_ini' | '7_hari' | 'bulan_ini' | 'semester_ini' | 'tahun_ini';
}

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  private getDateRange(period: string = 'bulan_ini'): { startDate: Date; endDate: Date; bucketType: 'hour' | 'day' | 'month' } {
    const now = new Date();
    const endDate = new Date(now);
    let startDate = new Date(now);
    let bucketType: 'hour' | 'day' | 'month' = 'day';

    switch (period) {
      case 'hari_ini':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        bucketType = 'hour';
        break;
      case '7_hari':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        bucketType = 'day';
        break;
      case 'semester_ini':
        startDate = new Date(now);
        startDate.setDate(1);
        startDate.setMonth(now.getMonth() - 5);
        startDate.setHours(0, 0, 0, 0);
        bucketType = 'month';
        break;
      case 'tahun_ini':
        startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
        bucketType = 'month';
        break;
      case 'bulan_ini':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
        bucketType = 'day';
        break;
    }

    return { startDate, endDate, bucketType };
  }

  async getAdminDashboardStats(periodQuery?: string) {
    const period = periodQuery || 'bulan_ini';
    const { startDate, endDate, bucketType } = this.getDateRange(period);

    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    const [
      totalArchives,
      availableArchivesCount,
      archivesByType,
      totalActiveCirculation,
      circulationByStatus,
      finePaidAggregate,
      fineUnpaidAggregate,
      blockedStudentsRaw,
      totalStudents,
      totalStaff,
      activeBorrowersRaw,
      recentLogs,
      categoryDistributionRaw,
      pendingAccUrgent,
      overdueUrgent,
      waitingPickupExpiring,
      borrowingsInPeriod,
      returnsInPeriod,
    ] = await Promise.all([
      // 1. Total Koleksi Arsip
      this.prisma.archive.count(),

      // 2. Arsip Tersedia (stok fisik > reservedQuantity dan status != DIPINJAM)
      this.prisma.archive.count({
        where: {
          quantity: { gt: 0 },
          status: 'TERSEDIA',
        },
      }),

      // 3. Distribusi Tipe Arsip
      this.prisma.archive.groupBy({
        by: ['archiveType'],
        _count: { id: true },
      }),

      // 4. Total Sirkulasi Aktif
      this.prisma.borrowing.count({
        where: {
          status: {
            in: ['REQUESTED', 'WAITING_PICKUP', 'BORROWED', 'OVERDUE'],
          },
        },
      }),

      // 5. Sirkulasi per Status
      this.prisma.borrowing.groupBy({
        by: ['status'],
        _count: { id: true },
      }),

      // 6. Kas Denda Terkumpul (Lunas)
      this.prisma.borrowing.aggregate({
        where: {
          fineAmount: { gt: 0 },
          finePaidAt: { not: null },
        },
        _sum: { fineAmount: true },
      }),

      // 7. Tunggakan Denda Aktif (Belum Lunas)
      this.prisma.borrowing.aggregate({
        where: {
          fineAmount: { gt: 0 },
          finePaidAt: null,
        },
        _sum: { fineAmount: true },
      }),

      // 8. Mahasiswa Terblokir Denda
      this.prisma.borrowing.findMany({
        where: {
          fineAmount: { gt: 0 },
          finePaidAt: null,
        },
        select: { userId: true },
        distinct: ['userId'],
      }),

      // 9. Total Mahasiswa
      this.prisma.user.count({
        where: { role: 'MAHASISWA' },
      }),

      // 10. Total Petugas
      this.prisma.user.count({
        where: { role: 'PETUGAS' },
      }),

      // 11. Mahasiswa yang Sedang Meminjam
      this.prisma.borrowing.findMany({
        where: {
          status: {
            in: ['REQUESTED', 'WAITING_PICKUP', 'BORROWED', 'OVERDUE'],
          },
        },
        select: { userId: true },
        distinct: ['userId'],
      }),

      // 12. 5 Log Aktivitas Terbaru
      this.prisma.activityLog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),

      // 13. Top Kategori Koleksi
      this.prisma.archive.groupBy({
        by: ['category'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),

      // 14. Peringatan: Pengajuan Menunggu ACC > 2 Hari
      this.prisma.borrowing.count({
        where: {
          status: 'REQUESTED',
          borrowDate: { lte: twoDaysAgo },
        },
      }),

      // 15. Peringatan: Keterlambatan Pengembalian (OVERDUE)
      this.prisma.borrowing.count({
        where: {
          status: 'OVERDUE',
        },
      }),

      // 16. Peringatan: Antrean Ambil Mendekati Batas Waktu (> 2 Hari di WAITING_PICKUP)
      this.prisma.borrowing.count({
        where: {
          status: 'WAITING_PICKUP',
          accDate: { lte: twoDaysAgo },
        },
      }),

      // 17. Transaksi Peminjaman dalam Periode Terpilih
      this.prisma.borrowing.findMany({
        where: {
          borrowDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          borrowDate: true,
        },
      }),

      // 18. Transaksi Pengembalian dalam Periode Terpilih
      this.prisma.borrowing.findMany({
        where: {
          returnDate: {
            gte: startDate,
            lte: endDate,
          },
          status: {
            in: ['RETURNED', 'DAMAGED', 'LOST'],
          },
        },
        select: {
          returnDate: true,
        },
      }),
    ]);

    // Format Status Sirkulasi
    const statusMap: Record<string, number> = {};
    circulationByStatus.forEach((item) => {
      statusMap[item.status] = item._count.id;
    });

    const waitingAccCount = statusMap['REQUESTED'] || 0;
    const waitingPickupCount = statusMap['WAITING_PICKUP'] || 0;
    const borrowedCount = statusMap['BORROWED'] || 0;
    const overdueCount = statusMap['OVERDUE'] || 0;

    // Format Tipe Arsip
    const typeMap: Record<string, number> = {};
    archivesByType.forEach((item) => {
      typeMap[item.archiveType] = item._count.id;
    });

    // Format Kategori Terfavorit & Persentase
    const categoryColors = [
      '#F97316', // Orange
      '#1E3A8A', // Deep Navy
      '#F59E0B', // Amber
      '#10B981', // Emerald
      '#64748B', // Slate
    ];

    const totalCategoryItems = categoryDistributionRaw.reduce((sum, c) => sum + c._count.id, 0);
    const topCategories = categoryDistributionRaw.map((cat, idx) => {
      const percentage = totalCategoryItems > 0 ? Math.round((cat._count.id / totalCategoryItems) * 100) : 0;
      return {
        name: cat.category || 'Umum',
        count: cat._count.id,
        percentage,
        color: categoryColors[idx % categoryColors.length],
      };
    });

    // Generate Trend Data Points based on Period
    const trendData = this.buildTrendData(startDate, endDate, bucketType, borrowingsInPeriod, returnsInPeriod);

    // Build Actionable Operational Alerts
    const alerts: Array<{
      id: string;
      title: string;
      detail: string;
      desc: string;
      type: 'danger' | 'warning' | 'info';
      targetUrl: string;
    }> = [];
    if (pendingAccUrgent > 0) {
      alerts.push({
        id: 'pending_acc',
        title: 'Pengajuan Menunggak ACC (> 2 Hari)',
        detail: `${pendingAccUrgent} Transaksi`,
        desc: 'Pengajuan peminjaman belum diverifikasi oleh petugas loket.',
        type: 'danger',
        targetUrl: '/admin/sirkulasi',
      });
    }
    if (overdueUrgent > 0) {
      alerts.push({
        id: 'overdue_books',
        title: 'Keterlambatan Pengembalian Buku',
        detail: `${overdueUrgent} Mahasiswa`,
        desc: 'Buku telah melewati tenggat jatuh tempo peminjaman.',
        type: 'warning',
        targetUrl: '/admin/sirkulasi',
      });
    }
    if (waitingPickupExpiring > 0) {
      alerts.push({
        id: 'pickup_expiring',
        title: 'Antrean Ambil Mendekati Batas Hangus',
        detail: `${waitingPickupExpiring} Berkas`,
        desc: 'Peminjaman sudah di-ACC namun belum diambil di loket.',
        type: 'info',
        targetUrl: '/admin/sirkulasi',
      });
    }

    // Hitung Koleksi yang Sedang Berada di Tangan Mahasiswa (BORROWED + OVERDUE)
    const currentlyBorrowedCount = (statusMap['BORROWED'] || 0) + (statusMap['OVERDUE'] || 0);
    const availableCount = Math.max(0, totalArchives - currentlyBorrowedCount);

    // Response JSON
    return {
      period,
      stats: {
        koleksi: {
          total: totalArchives,
          tersedia: availableCount,
          dipinjam: currentlyBorrowedCount,
          byType: {
            skripsi: typeMap['Skripsi'] || 0,
            ringkasan: typeMap['Ringkasan Skripsi'] || 0,
            naskah: typeMap['Naskah Publikasi'] || 0,
          },
        },
        sirkulasi: {
          totalAktif: totalActiveCirculation,
          waitingAcc: waitingAccCount,
          waitingPickup: waitingPickupCount,
          borrowed: borrowedCount,
          overdue: overdueCount,
        },
        keuangan: {
          totalKasTerkumpul: finePaidAggregate._sum.fineAmount || 0,
          totalTunggakan: fineUnpaidAggregate._sum.fineAmount || 0,
          mahasiswaTerblokir: blockedStudentsRaw.length,
        },
        pengguna: {
          totalMahasiswa: totalStudents,
          mahasiswaAktifMeminjam: activeBorrowersRaw.length,
          totalPetugas: totalStaff,
        },
      },
      trendData,
      topCategories,
      alerts,
      recentLogs: recentLogs.map((log) => ({
        id: log.id,
        userName: log.userName,
        userRole: log.userRole,
        action: log.action,
        description: log.description,
        createdAt: log.createdAt,
      })),
    };
  }

  private buildTrendData(
    startDate: Date,
    endDate: Date,
    bucketType: 'hour' | 'day' | 'month',
    borrowings: { borrowDate: Date }[],
    returns: { returnDate: Date | null }[],
  ) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    if (bucketType === 'hour') {
      const hours = [8, 10, 12, 14, 16, 18];
      return hours.map((hour) => {
        const label = `${hour.toString().padStart(2, '0')}:00`;
        const pengajuan = borrowings.filter((b) => {
          const d = new Date(b.borrowDate);
          return d.getHours() >= hour && d.getHours() < hour + 2;
        }).length;
        const pengembalian = returns.filter((r) => {
          if (!r.returnDate) return false;
          const d = new Date(r.returnDate);
          return d.getHours() >= hour && d.getHours() < hour + 2;
        }).length;
        return { label, pengajuan, pengembalian };
      });
    }

    if (bucketType === 'month') {
      const result: Array<{ label: string; pengajuan: number; pengembalian: number }> = [];
      const current = new Date(startDate);
      current.setDate(1);
      let iter = 0;
      while (current <= endDate && iter < 24) {
        iter++;
        const m = current.getMonth();
        const y = current.getFullYear();
        const label = `${months[m]} ${y !== new Date().getFullYear() ? y : ''}`.trim();

        const pengajuan = borrowings.filter((b) => {
          const d = new Date(b.borrowDate);
          return d.getMonth() === m && d.getFullYear() === y;
        }).length;

        const pengembalian = returns.filter((r) => {
          if (!r.returnDate) return false;
          const d = new Date(r.returnDate);
          return d.getMonth() === m && d.getFullYear() === y;
        }).length;

        result.push({ label, pengajuan, pengembalian });
        current.setMonth(current.getMonth() + 1);
      }
      return result;
    }

    // Default: daily buckets
    const result: Array<{ label: string; pengajuan: number; pengembalian: number }> = [];
    const current = new Date(startDate);
    let iter = 0;
    while (current <= endDate && iter < 60) {
      iter++;
      const dNum = current.getDate();
      const mNum = current.getMonth();
      const dayName = days[current.getDay()];
      const label = `${dayName}, ${dNum} ${months[mNum]}`;

      const year = current.getFullYear();
      const month = current.getMonth();
      const date = current.getDate();

      const pengajuan = borrowings.filter((b) => {
        const d = new Date(b.borrowDate);
        return d.getFullYear() === year && d.getMonth() === month && d.getDate() === date;
      }).length;

      const pengembalian = returns.filter((r) => {
        if (!r.returnDate) return false;
        const d = new Date(r.returnDate);
        return d.getFullYear() === year && d.getMonth() === month && d.getDate() === date;
      }).length;

      result.push({ label, pengajuan, pengembalian });
      current.setDate(current.getDate() + 1);
    }

    return result;
  }
}

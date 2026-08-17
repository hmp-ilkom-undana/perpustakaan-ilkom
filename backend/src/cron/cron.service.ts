import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { SettingService } from '../setting/setting.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly settingService: SettingService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyMaintenance() {
    this.logger.log('Menjalankan pemeliharaan harian sistem (Cron Job)...');

    const settings = await this.settingService.getSettings();
    const now = new Date();

    // 1. Pengecekan Keterlambatan & Denda Harian (Overdue)
    const activeBorrowings = await this.prisma.borrowing.findMany({
      where: {
        status: {
          in: ['BORROWED', 'OVERDUE'],
        },
      },
    });

    for (const borrowing of activeBorrowings) {
      if (!borrowing.returnDate) continue;

      const fineResult = this.settingService.calculateFine({
        returnDate: borrowing.returnDate,
        actualDate: now,
        settings,
      });

      const newStatus = fineResult.isLate ? 'OVERDUE' : borrowing.status;
      const calculatedFine = fineResult.fineAmount;

      if (
        borrowing.status !== newStatus ||
        borrowing.fineAmount !== calculatedFine
      ) {
        await this.prisma.borrowing.update({
          where: { id: borrowing.id },
          data: {
            status: newStatus,
            fineAmount: calculatedFine,
          },
        });
        this.logger.log(
          `[Overdue Cron] ID: ${borrowing.id} | Status: ${newStatus} | Denda: Rp${calculatedFine} (${fineResult.lateDays} hari kerja)`,
        );
      }
    }

    // 2. Auto-Cancel Arsip yang Belum Diambil (Unpicked WAITING_PICKUP)
    if (settings.autoCancelUnpicked) {
      this.logger.log(
        `Menjalankan pengecekan auto-cancel arsip (Batas: ${settings.pickupDurationDays} hari kerja)...`,
      );

      const waitingPickups = await this.prisma.borrowing.findMany({
        where: {
          status: 'WAITING_PICKUP',
          accDate: { not: null },
        },
      });

      for (const pickup of waitingPickups) {
        if (!pickup.accDate) continue;

        const elapsedBusinessDays = this.settingService.countBusinessDays(
          pickup.accDate,
          now,
          settings.operatingDays,
        );

        if (elapsedBusinessDays >= settings.pickupDurationDays) {
          await this.prisma.$transaction([
            this.prisma.archive.update({
              where: { id: pickup.archiveId },
              data: { reservedQuantity: { decrement: 1 } },
            }),
            this.prisma.borrowing.update({
              where: { id: pickup.id },
              data: {
                status: 'CANCELLED',
                returnDate: now,
                rejectReason: `Dibatalkan otomatis oleh sistem karena tidak diambil dalam batas ${settings.pickupDurationDays} hari kerja.`,
              },
            }),
          ]);

          this.logger.log(
            `[Auto-Cancel] ID: ${pickup.id} dibatalkan otomatis (${elapsedBusinessDays} hari kerja terlewati).`,
          );
        }
      }
    }

    this.logger.log('Pemeliharaan harian selesai.');
  }
}

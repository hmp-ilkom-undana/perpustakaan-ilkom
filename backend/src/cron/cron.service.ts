import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleOverdueBorrowings() {
    this.logger.log('Menjalankan pengecekan peminjaman terlambat (Cron Job)...');

    const now = new Date();

    const activeBorrowings = await this.prisma.borrowing.findMany({
      where: {
        status: {
          in: ['BORROWED', 'OVERDUE'],
        },
      },
    });

    for (const borrowing of activeBorrowings) {
      if (!borrowing.returnDate) continue;

      const isLate = now > borrowing.returnDate;

      if (isLate) {
        const diffTime = now.getTime() - borrowing.returnDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        let newStatus = borrowing.status;
        let calculatedFine = 0;

        if (diffDays >= 1) {
          newStatus = 'OVERDUE';
          
          if (diffDays > 7) {
            const extraDays = diffDays - 7;
            calculatedFine = 50000 + (extraDays * 10000);
          }
        }

        if (borrowing.status !== newStatus || borrowing.fineAmount !== calculatedFine) {
          await this.prisma.borrowing.update({
            where: { id: borrowing.id },
            data: {
              status: newStatus,
              fineAmount: calculatedFine,
            },
          });
          this.logger.log(`Memperbarui ID: ${borrowing.id} | Status: ${newStatus} | Denda: Rp${calculatedFine}`);
        }
      }
    }
    
    this.logger.log('Pengecekan selesai.');
  }
}

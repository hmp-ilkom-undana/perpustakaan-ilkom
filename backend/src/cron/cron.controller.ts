import {
  Controller,
  Get,
  Headers,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { CronService } from './cron.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('api/cron')
export class CronController {
  private readonly logger = new Logger(CronController.name);

  constructor(private readonly cronService: CronService) {}

  /**
   * Endpoint HTTP untuk memicu pemeliharaan harian sistem.
   * Didesain khusus untuk dipanggil oleh Vercel Cron Jobs atau penjadwal eksternal.
   */
  @Public()
  @Get('maintenance')
  async triggerMaintenance(@Headers('authorization') authHeader?: string) {
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret) {
      if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
        this.logger.warn('Trigger cron ditolak: Secret authorization tidak valid');
        throw new UnauthorizedException('Unauthorized: Invalid cron secret');
      }
    }

    this.logger.log('Menerima pemicu cron eksternal. Memulai pemeliharaan harian...');
    await this.cronService.handleDailyMaintenance();

    return {
      success: true,
      message: 'Pemeliharaan harian sistem berhasil dijalankan',
      timestamp: new Date().toISOString(),
    };
  }
}

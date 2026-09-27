import {
  Controller,
  Get,
  Headers,
  UnauthorizedException,
  InternalServerErrorException,
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

    if (!cronSecret || cronSecret.trim() === '') {
      this.logger.error(
        'Trigger cron ditolak: CRON_SECRET belum dikonfigurasi pada environment server',
      );
      throw new InternalServerErrorException(
        'Server configuration error: Cron secret is not configured',
      );
    }

    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
      this.logger.warn(
        'Trigger cron ditolak: Secret authorization tidak valid atau tidak disertakan',
      );
      throw new UnauthorizedException('Unauthorized: Invalid cron secret');
    }

    this.logger.log(
      'Menerima pemicu cron eksternal yang terotentikasi. Memulai pemeliharaan harian...',
    );
    await this.cronService.handleDailyMaintenance();

    return {
      success: true,
      message: 'Pemeliharaan harian sistem berhasil dijalankan',
      timestamp: new Date().toISOString(),
    };
  }
}

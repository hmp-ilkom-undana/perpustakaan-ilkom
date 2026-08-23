import {
  Controller,
  Get,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { ActivityLogService } from './activity-log.service';
import { AuthService } from '../auth/auth.service';
import { GetLogsQueryDto } from './dto/get-logs-query.dto';

@Controller('api/activity-logs')
export class ActivityLogController {
  constructor(
    private readonly activityLogService: ActivityLogService,
    private readonly authService: AuthService,
  ) {}

  private async validateAdminRole(req: Request) {
    const sessionData = await this.authService.auth.api.getSession({
      headers: req.headers as any,
    });

    if (!sessionData) {
      throw new UnauthorizedException(
        'Sesi tidak valid, Anda harus login terlebih dahulu.',
      );
    }

    if ((sessionData.user as any).role !== 'ADMIN') {
      throw new UnauthorizedException('Akses ditolak: Hanya untuk Administrator.');
    }

    return sessionData.user;
  }

  @Get('stats')
  async getStats(@Req() req: Request) {
    await this.validateAdminRole(req);
    return this.activityLogService.getStats();
  }

  @Get()
  async getLogs(@Req() req: Request, @Query() query: GetLogsQueryDto) {
    await this.validateAdminRole(req);
    return this.activityLogService.getLogs(query);
  }
}

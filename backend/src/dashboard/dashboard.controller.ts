import {
  Controller,
  Get,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { DashboardService } from './dashboard.service';
import { AuthService } from '../auth/auth.service';

@Controller('api/admin/dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
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

    if (
      (sessionData.user as any).role !== 'ADMIN' &&
      (sessionData.user as any).role !== 'PETUGAS'
    ) {
      throw new UnauthorizedException(
        'Akses ditolak: Hanya untuk Admin atau Petugas Perpustakaan.',
      );
    }

    return sessionData.user;
  }

  @Get('stats')
  async getDashboardStats(
    @Req() req: Request,
    @Query('period') period?: string,
  ) {
    await this.validateAdminRole(req);
    return this.dashboardService.getAdminDashboardStats(period);
  }
}

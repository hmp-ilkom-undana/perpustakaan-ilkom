import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @Roles('ADMIN', 'PETUGAS')
  async getDashboardStats(
    @Query('period') period?: string,
  ) {
    return this.dashboardService.getAdminDashboardStats(period);
  }
}

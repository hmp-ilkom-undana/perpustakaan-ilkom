import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { FineService } from './fine.service';
import { AuthService } from '../auth/auth.service';
import { PayFineDto } from './dto/pay-fine.dto';

@Controller('api/fines')
export class FineController {
  constructor(
    private readonly fineService: FineService,
    private readonly authService: AuthService,
  ) {}

  private async validateOfficerRole(req: Request) {
    const sessionData = await this.authService.auth.api.getSession({
      headers: req.headers as any,
    });

    if (!sessionData) {
      throw new UnauthorizedException('Sesi tidak valid, Anda harus login terlebih dahulu.');
    }

    if (sessionData.user.role !== 'PETUGAS' && sessionData.user.role !== 'ADMIN') {
      throw new UnauthorizedException('Akses ditolak: Hanya untuk Petugas atau Admin.');
    }

    return sessionData.user;
  }

  @Get('stats')
  async getStats(@Req() req: Request) {
    await this.validateOfficerRole(req);
    return this.fineService.getStats();
  }

  @Get()
  async getFines(
    @Req() req: Request,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    await this.validateOfficerRole(req);
    return this.fineService.getFines({ status, search });
  }

  @Patch(':id/pay')
  async payFine(
    @Param('id') id: string,
    @Body() body: PayFineDto,
    @Req() req: Request,
  ) {
    const user = await this.validateOfficerRole(req);
    const officerName = user.name || 'Petugas Perpustakaan';
    return this.fineService.payFine(id, officerName, body);
  }
}

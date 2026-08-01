import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UnauthorizedException,
  Param,
  Patch,
} from '@nestjs/common';
import type { Request } from 'express';
import { BorrowingService } from './borrowing.service';
import { AuthService } from '../auth/auth.service';

@Controller('api/borrowings')
export class BorrowingController {
  constructor(
    private readonly borrowingService: BorrowingService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async requestBorrow(
    @Req() req: Request,
    @Body() body: { archiveId: string },
  ) {
    const sessionData = await this.authService.auth.api.getSession({
      headers: req.headers as any,
    });

    if (!sessionData) {
      throw new UnauthorizedException(
        'Sesi tidak valid, Anda harus login terlebih dahulu.',
      );
    }

    return this.borrowingService.requestBorrow(
      sessionData.user.id,
      body.archiveId,
    );
  }
  @Get('my-history')
  async getMyHistory(@Req() req: Request) {
    const sessionData = await this.authService.auth.api.getSession({
      headers: req.headers as any,
    });
    if (!sessionData) {
      throw new UnauthorizedException(
        'Sesi tidak valid, Anda harus login terlebih dahulu.',
      );
    }
    return this.borrowingService.getMyBorrowings(sessionData.user.id);
  }

  @Post(':id/cancel')
  async cancelBorrowing(@Req() req: Request, @Param('id') borrowingId: string) {
    const sessionData = await this.authService.auth.api.getSession({
      headers: req.headers as any,
    });

    if (!sessionData) {
      throw new UnauthorizedException(
        'Sesi tidak valid, Anda harus login terlebih dahulu.',
      );
    }

    return this.borrowingService.cancelBorrowing(
      sessionData.user.id,
      borrowingId,
    );
  }

  // ==========================================
  // TAHAP 1: FITUR PETUGAS (ACC PEMINJAMAN)
  // ==========================================

  @Get('active')
  async getActiveBorrowings(@Req() req: Request) {
    const sessionData = await this.authService.auth.api.getSession({
      headers: req.headers as any,
    });

    if (!sessionData) {
      throw new UnauthorizedException('Sesi tidak valid, Anda harus login.');
    }

    if (sessionData.user.role !== 'PETUGAS' && sessionData.user.role !== 'ADMIN') {
      throw new UnauthorizedException('Akses ditolak: Hanya untuk Petugas.');
    }

    return this.borrowingService.getActiveBorrowings();
  }

  @Patch(':id/approve')
  async approveBorrowing(@Req() req: Request, @Param('id') borrowingId: string) {
    const sessionData = await this.authService.auth.api.getSession({
      headers: req.headers as any,
    });

    if (!sessionData) {
      throw new UnauthorizedException('Sesi tidak valid, Anda harus login.');
    }

    if (sessionData.user.role !== 'PETUGAS' && sessionData.user.role !== 'ADMIN') {
      throw new UnauthorizedException('Akses ditolak: Hanya untuk Petugas.');
    }

    return this.borrowingService.approveBorrowing(borrowingId);
  }

  @Patch(':id/reject')
  async rejectBorrowing(@Req() req: Request, @Param('id') borrowingId: string) {
    const sessionData = await this.authService.auth.api.getSession({
      headers: req.headers as any,
    });

    if (!sessionData) {
      throw new UnauthorizedException('Sesi tidak valid, Anda harus login.');
    }

    if (sessionData.user.role !== 'PETUGAS' && sessionData.user.role !== 'ADMIN') {
      throw new UnauthorizedException('Akses ditolak: Hanya untuk Petugas.');
    }

    return this.borrowingService.rejectBorrowing(borrowingId);
  }
}

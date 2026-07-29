import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UnauthorizedException,
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
  async cancelBorrowing(@Req() req: Request, @Req() request: any) {
    const sessionData = await this.authService.auth.api.getSession({
      headers: req.headers as any,
    });

    if (!sessionData) {
      throw new UnauthorizedException(
        'Sesi tidak valid, Anda harus login terlebih dahulu.',
      );
    }

    const borrowingId = req.params?.id || request.params?.id;
    return this.borrowingService.cancelBorrowing(sessionData.user.id, borrowingId);
  }
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';

@Controller('api/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  private async validateAdmin(req: Request) {
    const sessionData = await this.authService.auth.api.getSession({
      headers: req.headers as any,
    });

    if (!sessionData) {
      throw new UnauthorizedException(
        'Sesi tidak valid, Anda harus login terlebih dahulu.',
      );
    }

    if ((sessionData.user as any).role !== 'ADMIN') {
      throw new ForbiddenException(
        'Akses ditolak: Hanya Administrator yang berhak mengelola akun staf/petugas.',
      );
    }

    return sessionData.user;
  }

  @Get('students')
  async getStudents(@Query('search') search?: string) {
    return this.userService.getStudents(search);
  }

  @Get('students/:id/borrowings')
  async getStudentBorrowings(@Param('id') id: string) {
    return this.userService.getStudentBorrowings(id);
  }

  @Get('staff')
  async getStaff(@Req() req: Request, @Query('search') search?: string) {
    await this.validateAdmin(req);
    return this.userService.getStaff(search);
  }

  @Post('staff')
  async createStaff(
    @Req() req: Request,
    @Body()
    body: {
      email: string;
      password?: string;
    },
  ) {
    const user = await this.validateAdmin(req);
    return this.userService.createStaff(body, user as any);
  }

  @Post('staff/batch')
  async createBatchStaff(
    @Req() req: Request,
    @Body()
    body: {
      staffList: Array<{ email: string; password?: string }>;
    },
  ) {
    const user = await this.validateAdmin(req);
    return this.userService.createBatchStaff(body.staffList, user as any);
  }

  @Patch('profile/:id')
  async updateProfile(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: { name?: string; email?: string; wa_number?: string },
  ) {
    const sessionData = await this.authService.auth.api.getSession({
      headers: req.headers as any,
    });

    if (!sessionData) {
      throw new UnauthorizedException(
        'Sesi tidak valid, Anda harus login terlebih dahulu.',
      );
    }

    const isOwner = sessionData.user.id === id;
    const isAdmin = (sessionData.user as any).role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'Anda tidak memiliki akses untuk mengubah profil ini',
      );
    }

    return this.userService.updateProfile(id, body);
  }

  @Patch('staff/:id')
  async updateStaff(
    @Param('id') id: string,
    @Req() req: Request,
    @Body()
    body: {
      name?: string;
      email?: string;
      wa_number?: string;
      status?: string;
    },
  ) {
    const user = await this.validateAdmin(req);
    return this.userService.updateStaff(id, body, user as any);
  }

  @Post('reset-password')
  async resetPassword(@Body('identifier') identifier: string) {
    return this.userService.resetPassword(identifier);
  }

  @Delete('staff/:id')
  async deleteStaff(@Param('id') id: string, @Req() req: Request) {
    const user = await this.validateAdmin(req);
    return this.userService.deleteStaff(id, user as any);
  }
}

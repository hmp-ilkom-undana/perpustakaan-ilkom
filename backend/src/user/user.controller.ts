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

  @Get('students')
  async getStudents(@Query('search') search?: string) {
    return this.userService.getStudents(search);
  }

  @Get('students/:id/borrowings')
  async getStudentBorrowings(@Param('id') id: string) {
    return this.userService.getStudentBorrowings(id);
  }

  @Get('staff')
  async getStaff(@Query('search') search?: string) {
    return this.userService.getStaff(search);
  }

  @Post('staff')
  async createStaff(
    @Body()
    body: {
      email: string;
      password?: string;
    },
  ) {
    return this.userService.createStaff(body);
  }

  @Post('staff/batch')
  async createBatchStaff(
    @Body()
    body: {
      staffList: Array<{ email: string; password?: string }>;
    },
  ) {
    return this.userService.createBatchStaff(body.staffList);
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
    @Body()
    body: {
      name?: string;
      email?: string;
      wa_number?: string;
      status?: string;
    },
  ) {
    return this.userService.updateStaff(id, body);
  }

  @Post('reset-password')
  async resetPassword(@Body('identifier') identifier: string) {
    return this.userService.resetPassword(identifier);
  }

  @Delete('staff/:id')
  async deleteStaff(@Param('id') id: string) {
    return this.userService.deleteStaff(id);
  }
}

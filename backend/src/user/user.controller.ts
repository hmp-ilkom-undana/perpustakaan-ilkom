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
  ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from './user.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { CreateStaffDto } from './dto/create-staff.dto';
import { CreateBatchStaffDto } from './dto/create-batch-staff.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('students')
  @Roles('ADMIN', 'PETUGAS')
  async getStudents(@Query('search') search?: string) {
    return this.userService.getStudents(search);
  }

  @Get('students/:id/borrowings')
  @Roles('ADMIN', 'PETUGAS')
  async getStudentBorrowings(@Param('id') id: string) {
    return this.userService.getStudentBorrowings(id);
  }

  @Get('staff')
  @Roles('ADMIN')
  async getStaff(@Query('search') search?: string) {
    return this.userService.getStaff(search);
  }

  @Post('staff')
  @Roles('ADMIN')
  async createStaff(@Req() req: Request, @Body() body: CreateStaffDto) {
    return this.userService.createStaff(body, req['user'] as any);
  }

  @Post('staff/batch')
  @Roles('ADMIN')
  async createBatchStaff(@Req() req: Request, @Body() body: CreateBatchStaffDto) {
    return this.userService.createBatchStaff(body.staffList, req['user'] as any);
  }

  @Patch('profile/:id')
  async updateProfile(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: UpdateProfileDto,
  ) {
    const user = req['user'] as any;
    const isOwner = user.id === id;
    const isAdmin = user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'Akses ditolak: Anda tidak memiliki izin untuk mengubah profil ini.',
      );
    }

    return this.userService.updateProfile(id, body);
  }

  @Patch('staff/:id')
  @Roles('ADMIN')
  async updateStaff(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: UpdateStaffDto,
  ) {
    return this.userService.updateStaff(id, body, req['user'] as any);
  }

  @Post('reset-password')
  @Roles('ADMIN')
  async resetPassword(@Body('identifier') identifier: string) {
    return this.userService.resetPassword(identifier);
  }

  @Delete('staff/:id')
  @Roles('ADMIN')
  async deleteStaff(@Param('id') id: string, @Req() req: Request) {
    return this.userService.deleteStaff(id, req['user'] as any);
  }

  @Public()
  @Get('check-health')
  healthCheck() {
    return { status: 'ok' };
  }
}

import {
  Controller,
  Get,
  Put,
  Body,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { SettingService } from './setting.service';
import { AuthService } from '../auth/auth.service';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Controller('api/settings')
export class SettingController {
  constructor(
    private readonly settingService: SettingService,
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
      throw new UnauthorizedException('Akses ditolak: Hanya untuk Admin.');
    }

    return sessionData.user;
  }

  @Get()
  async getSettings() {
    return this.settingService.getSettings();
  }

  @Put()
  async updateSettings(
    @Req() req: Request,
    @Body() body: UpdateSettingDto,
  ) {
    const user = await this.validateAdminRole(req);
    return this.settingService.updateSettings(body, user as any);
  }
}

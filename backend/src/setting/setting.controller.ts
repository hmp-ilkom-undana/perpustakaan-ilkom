import {
  Controller,
  Get,
  Put,
  Body,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { SettingService } from './setting.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('api/settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Public()
  @Get()
  async getSettings() {
    return this.settingService.getSettings();
  }

  @Put()
  @Roles('ADMIN')
  async updateSettings(
    @Req() req: Request,
    @Body() body: UpdateSettingDto,
  ) {
    return this.settingService.updateSettings(body, req['user'] as any);
  }
}

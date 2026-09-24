import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { FineService } from './fine.service';
import { PayFineDto } from './dto/pay-fine.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/fines')
export class FineController {
  constructor(private readonly fineService: FineService) {}

  @Get('stats')
  @Roles('ADMIN', 'PETUGAS')
  async getStats() {
    return this.fineService.getStats();
  }

  @Get()
  @Roles('ADMIN', 'PETUGAS')
  async getFines(
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.fineService.getFines({ status, search });
  }

  @Patch(':id/pay')
  @Roles('ADMIN', 'PETUGAS')
  async payFine(
    @Param('id') id: string,
    @Body() body: PayFineDto,
    @Req() req: Request,
  ) {
    return this.fineService.payFine(id, req['user'] as any, body);
  }
}

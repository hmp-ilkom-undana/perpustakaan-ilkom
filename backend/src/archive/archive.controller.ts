import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { ArchiveService } from './archive.service';
import { CreateArchiveDto } from './dto/create-archive.dto';
import { UpdateArchiveDto } from './dto/update-archive.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('api/archives')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  @Public()
  @Get()
  async getCatalog(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('category') category?: string,
    @Query('availability') availability?: string,
    @Query('userId') userId?: string,
  ) {
    const parsedPage = parseInt(page ?? '', 10);
    const parsedLimit = parseInt(limit ?? '', 10);

    return this.archiveService.findAll({
      page: !isNaN(parsedPage) && parsedPage > 0 ? parsedPage : 1,
      limit: !isNaN(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10,
      search,
      type,
      category,
      availability,
      userId,
    });
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.archiveService.findOne(id);
  }

  @Post('import')
  @Roles('ADMIN', 'PETUGAS')
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body('archiveType') archiveType: string,
  ) {
    if (!file) {
      throw new BadRequestException('File Excel tidak ditemukan');
    }
    if (!archiveType) {
      throw new BadRequestException('Tipe arsip belum dipilih');
    }

    return this.archiveService.importExcel(file.buffer, archiveType, req['user'] as any);
  }

  @Post()
  @Roles('ADMIN', 'PETUGAS')
  async create(
    @Req() req: Request,
    @Body() createArchiveDto: CreateArchiveDto,
  ) {
    return this.archiveService.create(createArchiveDto, req['user'] as any);
  }

  @Patch(':id')
  @Roles('ADMIN', 'PETUGAS')
  async update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateArchiveDto: UpdateArchiveDto,
  ) {
    return this.archiveService.update(id, updateArchiveDto, req['user'] as any);
  }

  @Delete(':id')
  @Roles('ADMIN', 'PETUGAS')
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.archiveService.remove(id, req['user'] as any);
  }
}

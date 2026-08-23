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
  UnauthorizedException,
  ForbiddenException,
  Query,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { ArchiveService } from './archive.service';
import { AuthService } from '../auth/auth.service';
import { CreateArchiveDto } from './dto/create-archive.dto';
import { UpdateArchiveDto } from './dto/update-archive.dto';

@Controller('api/archives')
export class ArchiveController {
  constructor(
    private readonly archiveService: ArchiveService,
    private readonly authService: AuthService,
  ) {}

  private async validateStaffOrAdmin(req: Request) {
    const sessionData = await this.authService.auth.api.getSession({
      headers: req.headers as any,
    });

    if (!sessionData) {
      throw new UnauthorizedException(
        'Sesi tidak valid, Anda harus login terlebih dahulu.',
      );
    }

    const role = (sessionData.user as any)?.role;
    if (role !== 'ADMIN' && role !== 'PETUGAS') {
      throw new ForbiddenException(
        'Akses ditolak: Hanya Petugas atau Administrator yang berhak memodifikasi katalog arsip.',
      );
    }

    return sessionData.user;
  }

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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.archiveService.findOne(id);
  }

  @Post('import')
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

    const user = await this.validateStaffOrAdmin(req);
    return this.archiveService.importExcel(file.buffer, archiveType, user as any);
  }

  @Post()
  async create(
    @Req() req: Request,
    @Body() createArchiveDto: CreateArchiveDto,
  ) {
    const user = await this.validateStaffOrAdmin(req);
    return this.archiveService.create(createArchiveDto, user as any);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateArchiveDto: UpdateArchiveDto,
  ) {
    const user = await this.validateStaffOrAdmin(req);
    return this.archiveService.update(id, updateArchiveDto, user as any);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const user = await this.validateStaffOrAdmin(req);
    return this.archiveService.remove(id, user as any);
  }
}

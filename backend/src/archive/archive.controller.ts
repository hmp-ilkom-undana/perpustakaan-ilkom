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
import { AuthService } from '../auth/auth.service';
import { CreateArchiveDto } from './dto/create-archive.dto';
import { UpdateArchiveDto } from './dto/update-archive.dto';

@Controller('api/archives')
export class ArchiveController {
  constructor(
    private readonly archiveService: ArchiveService,
    private readonly authService: AuthService,
  ) {}

  private async getSessionUser(req: Request) {
    try {
      const sessionData = await this.authService.auth.api.getSession({
        headers: req.headers as any,
      });
      return sessionData?.user || null;
    } catch {
      return null;
    }
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

    const user = await this.getSessionUser(req);
    return this.archiveService.importExcel(file.buffer, archiveType, user);
  }

  @Post()
  async create(
    @Req() req: Request,
    @Body() createArchiveDto: CreateArchiveDto,
  ) {
    const user = await this.getSessionUser(req);
    return this.archiveService.create(createArchiveDto, user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateArchiveDto: UpdateArchiveDto,
  ) {
    const user = await this.getSessionUser(req);
    return this.archiveService.update(id, updateArchiveDto, user);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const user = await this.getSessionUser(req);
    return this.archiveService.remove(id, user);
  }
}

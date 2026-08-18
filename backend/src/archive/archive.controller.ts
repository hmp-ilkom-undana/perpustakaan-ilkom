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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArchiveService } from './archive.service';
import { CreateArchiveDto } from './dto/create-archive.dto';
import { UpdateArchiveDto } from './dto/update-archive.dto';

@Controller('api/archives')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  @Get()
  async getCatalog(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('category') category?: string,
    @Query('availability') availability?: string,
  ) {
    // Validasi NaN: jika query param bukan angka valid (contoh: ?page=abc),
    // parseInt akan menghasilkan NaN. Kita paksa ke angka default agar Prisma tidak crash.
    const parsedPage = parseInt(page ?? '', 10);
    const parsedLimit = parseInt(limit ?? '', 10);

    return this.archiveService.findAll({
      page: !isNaN(parsedPage) && parsedPage > 0 ? parsedPage : 1,
      limit: !isNaN(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10,
      search,
      type,
      category,
      availability,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.archiveService.findOne(id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(
    @UploadedFile() file: Express.Multer.File,
    @Body('archiveType') archiveType: string,
  ) {
    if (!file) {
      throw new BadRequestException('File Excel tidak ditemukan');
    }
    if (!archiveType) {
      throw new BadRequestException('Tipe arsip belum dipilih');
    }

    return this.archiveService.importExcel(file.buffer, archiveType);
  }

  @Post()
  async create(@Body() createArchiveDto: CreateArchiveDto) {
    return this.archiveService.create(createArchiveDto);
  }
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArchiveDto: UpdateArchiveDto,
  ) {
    return this.archiveService.update(id, updateArchiveDto);
  }
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.archiveService.remove(id);
  }
}

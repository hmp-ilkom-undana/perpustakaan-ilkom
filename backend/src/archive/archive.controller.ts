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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArchiveService } from './archive.service';
import { CreateArchiveDto } from './dto/create-archive.dto';
import { UpdateArchiveDto } from './dto/update-archive.dto';

@Controller('api/archives')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  @Get()
  async getCatalog() {
    return this.archiveService.findAll();
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

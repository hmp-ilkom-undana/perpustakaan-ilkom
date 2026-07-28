import { Controller, Get } from '@nestjs/common';
import { ArchiveService } from './archive.service';

@Controller('api/archives')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  @Get()
  async getCatalog() {
    return this.archiveService.findAll();
  }
}

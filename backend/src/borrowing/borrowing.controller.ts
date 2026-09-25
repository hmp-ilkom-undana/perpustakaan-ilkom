import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  MaxFileSizeValidator,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { BorrowingService } from './borrowing.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RequestBorrowDto } from './dto/request-borrow.dto';
import { RejectBorrowDto } from './dto/reject-borrow.dto';
import { ReturnBorrowDto } from './dto/return-borrow.dto';

@Controller('api/borrowings')
export class BorrowingController {
  constructor(private readonly borrowingService: BorrowingService) {}

  @Post()
  async requestBorrow(
    @Req() req: Request,
    @Body() body: RequestBorrowDto,
  ) {
    return this.borrowingService.requestBorrow(req['user'].id, body.archiveId);
  }

  @Get('my-history')
  async getMyHistory(@Req() req: Request) {
    return this.borrowingService.getMyBorrowings(req['user'].id);
  }

  @Post(':id/cancel')
  async cancelBorrowing(@Req() req: Request, @Param('id') borrowingId: string) {
    return this.borrowingService.cancelBorrowing(req['user'].id, borrowingId);
  }

  @Get('active')
  @Roles('ADMIN', 'PETUGAS')
  async getActiveBorrowings() {
    return this.borrowingService.getActiveBorrowings();
  }

  @Patch(':id/approve')
  @Roles('ADMIN', 'PETUGAS')
  async approveBorrowing(@Req() req: Request, @Param('id') borrowingId: string) {
    return this.borrowingService.approveBorrowing(borrowingId, req['user'] as any);
  }

  @Patch(':id/reject')
  @Roles('ADMIN', 'PETUGAS')
  async rejectBorrowing(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: RejectBorrowDto,
  ) {
    return this.borrowingService.rejectBorrowing(id, body.reason, req['user'] as any);
  }

  @Patch(':id/handover')
  @Roles('ADMIN', 'PETUGAS')
  @UseInterceptors(FileInterceptor('photo'))
  async handoverBorrowing(
    @Param('id') id: string,
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|jpg|png|webp)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    return this.borrowingService.handoverBorrowing(id, file, req['user'] as any);
  }

  @Patch(':id/return')
  @Roles('ADMIN', 'PETUGAS')
  @UseInterceptors(FileInterceptor('photo'))
  async returnBorrowing(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: ReturnBorrowDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|jpg|png|webp)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    const returnToStock =
      body.returnToStock === 'false' || body.returnToStock === false
        ? false
        : true;

    return this.borrowingService.returnBorrowing(
      id,
      file,
      body.kondisiKembali,
      body.catatanKondisiKembali,
      body.fineAmount,
      req['user'] as any,
      returnToStock,
    );
  }
}

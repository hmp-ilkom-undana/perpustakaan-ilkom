import { Module } from '@nestjs/common';
import { BorrowingService } from './borrowing.service';
import { BorrowingController } from './borrowing.controller';
import { AuthModule } from '../auth/auth.module';

import { DriveService } from './drive.service';

@Module({
  imports: [AuthModule],
  controllers: [BorrowingController],
  providers: [BorrowingService, DriveService],
})
export class BorrowingModule {}

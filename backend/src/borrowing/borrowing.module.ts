import { Module } from '@nestjs/common';
import { BorrowingService } from './borrowing.service';
import { BorrowingController } from './borrowing.controller';
import { AuthModule } from '../auth/auth.module';
import { SettingModule } from '../setting/setting.module';
import { ActivityLogModule } from '../activity-log/activity-log.module';
import { DriveService } from './drive.service';

@Module({
  imports: [AuthModule, SettingModule, ActivityLogModule],
  controllers: [BorrowingController],
  providers: [BorrowingService, DriveService],
})
export class BorrowingModule {}

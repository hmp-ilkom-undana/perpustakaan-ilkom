import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ArchiveModule } from './archive/archive.module';
import { BorrowingModule } from './borrowing/borrowing.module';
import { CronModule } from './cron/cron.module';
import { FineModule } from './fine/fine.module';
import { UserModule } from './user/user.module';
import { SettingModule } from './setting/setting.module';
import { ActivityLogModule } from './activity-log/activity-log.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    ArchiveModule,
    BorrowingModule,
    CronModule,
    FineModule,
    UserModule,
    SettingModule,
    ActivityLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

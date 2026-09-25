import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CronController } from './cron.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SettingModule } from '../setting/setting.module';

@Module({
  imports: [PrismaModule, SettingModule],
  controllers: [CronController],
  providers: [CronService],
})
export class CronModule {}

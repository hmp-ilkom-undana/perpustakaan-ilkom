import { Module } from '@nestjs/common';
import { FineController } from './fine.controller';
import { FineService } from './fine.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ActivityLogModule } from '../activity-log/activity-log.module';

@Module({
  imports: [PrismaModule, AuthModule, ActivityLogModule],
  controllers: [FineController],
  providers: [FineService],
  exports: [FineService],
})
export class FineModule {}

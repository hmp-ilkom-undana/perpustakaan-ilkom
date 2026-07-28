import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ArchiveModule } from './archive/archive.module';
import { BorrowingModule } from './borrowing/borrowing.module';

@Module({
  imports: [PrismaModule, AuthModule, ArchiveModule, BorrowingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

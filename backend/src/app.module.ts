import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ArchiveModule } from './archive/archive.module';

@Module({
  imports: [PrismaModule, AuthModule, ArchiveModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

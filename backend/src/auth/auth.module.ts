import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], // Diekspor agar modul lain bisa mengecek session pengguna
})
export class AuthModule {}

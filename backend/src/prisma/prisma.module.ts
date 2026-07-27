import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // <-- Membuat PrismaService bisa dipakai di semua modul (Buku, Peminjaman) tanpa perlu import ulang
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

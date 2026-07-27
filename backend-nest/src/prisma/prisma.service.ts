import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable() // <-- Menjadikannya bisa di-inject (Dependency Injection)
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    // Dipanggil saat aplikasi NestJS mulai berjalan
    await this.$connect();
  }

  async onModuleDestroy() {
    // Dipanggil saat aplikasi NestJS dimatikan
    await this.$disconnect();
  }
}

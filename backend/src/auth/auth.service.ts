import { Injectable } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  // Instance Better Auth yang sudah dikonfigurasi
  public readonly auth; 

  constructor(private prisma: PrismaService) {
    this.auth = betterAuth({
      // Menggunakan Prisma Adapter dan menyuntikkan PrismaService kita
      database: prismaAdapter(this.prisma, {
        provider: 'postgresql',
      }),
      // Mengaktifkan fitur login dengan Email & Password
      emailAndPassword: {
        enabled: true,
      },
      // Anda bisa menambahkan plugin tambahan di sini nanti (misal: JWT, OAuth, dll)
    });
  }
}

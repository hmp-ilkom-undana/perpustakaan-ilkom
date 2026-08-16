import { Injectable } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { username } from 'better-auth/plugins';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  public readonly auth;

  constructor(private prisma: PrismaService) {
    this.auth = betterAuth({
      database: prismaAdapter(this.prisma, {
        provider: 'postgresql',
      }),
      emailAndPassword: {
        enabled: true,
      },
      plugins: [username()],
      trustedOrigins: [process.env.FRONTEND_URL || '', 'http://localhost:5173'],
      user: {
        additionalFields: {
          role: {
            type: 'string',
            required: false,
            defaultValue: 'MAHASISWA',
          },
          nim: {
            type: 'string',
            required: false,
          },
          wa_number: {
            type: 'string',
            required: false,
          },
        },
      },
    });
  }
}

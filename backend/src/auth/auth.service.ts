import { Injectable } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { username } from 'better-auth/plugins';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  public readonly auth;

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {
    this.auth = betterAuth({
      database: prismaAdapter(this.prisma, {
        provider: 'postgresql',
      }),
      emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url }) => {
          await this.mailService.sendPasswordResetEmail(user.email, url, user.name);
        },
      },
      baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5000',
      trustedOrigins: [
        process.env.FRONTEND_URL || '',
        'http://localhost:5173',
        'http://localhost:5000',
      ].filter(Boolean),
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

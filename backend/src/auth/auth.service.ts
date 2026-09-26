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
        sendResetPassword: async ({ user, token }) => {
          const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
          const directResetUrl = `${frontendUrl}/reset-sandi?token=${encodeURIComponent(token)}`;
          await this.mailService.sendPasswordResetEmail(user.email, directResetUrl, user.name);
        },
      },
      plugins: [username()],
      baseURL: (process.env.BETTER_AUTH_URL || 'http://localhost:5000').replace(/\/+$/, ''),
      trustedOrigins: (request) => {
        const frontendUrl = (process.env.FRONTEND_URL || '').replace(/\/+$/, '');
        const origins = [
          frontendUrl,
          'https://perpustakaan-ilmu-komputer.vercel.app',
          'http://localhost:5173',
          'http://localhost:5000',
        ].filter(Boolean);

        const origin = request?.headers?.get?.('origin');
        if (
          origin &&
          /^https:\/\/perpustakaan-ilmu-komputer(-[a-z0-9]+)*\.vercel\.app$/.test(
            origin,
          )
        ) {
          origins.push(origin);
        }

        return origins;
      },
      advanced: {
        defaultCookieAttributes: {
          sameSite: 'none',
          secure: true,
        },
      },
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

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService implements OnModuleInit {
  public auth: any;
  private initPromise: Promise<any> | null = null;

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async onModuleInit() {
    await this.getAuth();
  }

  async getAuth() {
    if (this.auth) return this.auth;
    if (!this.initPromise) {
      this.initPromise = (async () => {
        try {
          const { betterAuth } = await import('better-auth');
          const { prismaAdapter } = await import('better-auth/adapters/prisma');
          const { username } = await import('better-auth/plugins');

          this.auth = betterAuth({
            database: prismaAdapter(this.prisma, {
              provider: 'postgresql',
            }),
            emailAndPassword: {
              enabled: true,
              sendResetPassword: async ({ user, token }: any) => {
                const frontendUrl =
                  process.env.FRONTEND_URL || 'http://localhost:5173';
                const directResetUrl = `${frontendUrl}/reset-sandi?token=${encodeURIComponent(token)}`;
                await this.mailService.sendPasswordResetEmail(
                  user.email,
                  directResetUrl,
                  user.name,
                );
              },
            },
            plugins: [username()],
            baseURL: (
              process.env.BETTER_AUTH_URL || 'http://localhost:5000'
            ).replace(/\/+$/, ''),
            trustedOrigins: (request: any) => {
              const frontendUrl = (process.env.FRONTEND_URL || '').replace(
                /\/+$/,
                '',
              );
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
          return this.auth;
        } catch (error) {
          this.initPromise = null;
          throw error;
        }
      })();
    }
    return this.initPromise;
  }
}

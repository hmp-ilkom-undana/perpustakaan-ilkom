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
      plugins: [
        username(),
      ],
      trustedOrigins: ['http://localhost:5173'],
    });
  }
}

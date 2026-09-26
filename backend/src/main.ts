import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import corsMiddleware from 'cors';

let cachedApp: INestApplication;
const expressInstance: Express = express();

function getAllowedOrigins(): string[] {
  const frontendUrl = (process.env.FRONTEND_URL || '').replace(/\/+$/, '');
  return [frontendUrl, 'http://localhost:5173', 'http://localhost:5000'].filter(
    Boolean,
  );
}

/**
 * Middleware cors (package resmi) dipasang di Express instance sebelum NestJS init.
 * Ini penting agar preflight OPTIONS pada route /api/auth/* dari Better Auth
 * mendapat header CORS yang benar, sebelum toNodeHandler mengambil alih request.
 */
expressInstance.use(
  corsMiddleware({
    origin: (origin, callback) => {
      const allowedOrigins = getAllowedOrigins();
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }),
);

export async function bootstrap(): Promise<INestApplication> {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressInstance), {
      bodyParser: false,
    });

    app.use(
      helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
      }),
    );

    app.enableCors({
      origin: (origin, callback) => {
        const allowedOrigins = getAllowedOrigins();
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
      },
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

// Menjalankan server pada mode standalone / local development
if (!process.env.VERCEL) {
  bootstrap().then(async (app) => {
    await app.listen(process.env.PORT ?? 5000);
  });
}

// Handler serverless resmi untuk Vercel Function
export default async function handler(req: Request, res: Response) {
  await bootstrap();
  expressInstance(req, res);
}

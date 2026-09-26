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

/**
 * Menentukan apakah suatu origin diperbolehkan.
 * Mendukung:
 * - Production URL dari env FRONTEND_URL
 * - Localhost untuk development
 * - Semua preview URL Vercel (*.vercel.app) milik project frontend ini
 */
function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return true;

  const frontendUrl = (process.env.FRONTEND_URL || '').replace(/\/+$/, '');
  const staticAllowed = [
    frontendUrl,
    'https://perpustakaan-ilmu-komputer.vercel.app',
    'http://localhost:5173',
    'http://localhost:5000',
  ].filter(Boolean);

  if (staticAllowed.includes(origin)) return true;

  // Izinkan semua domain produksi maupun preview perpustakaan-ilmu-komputer di vercel.app
  const vercelPattern = /^https:\/\/perpustakaan-ilmu-komputer.*\.vercel\.app$/;
  return vercelPattern.test(origin);
}

expressInstance.use(
  corsMiddleware({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }),
);

export async function bootstrap(): Promise<INestApplication> {
  if (!cachedApp) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressInstance),
      { bodyParser: false },
    );

    app.use(
      helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
      }),
    );

    app.enableCors({
      origin: (origin, callback) => {
        if (isOriginAllowed(origin)) {
          callback(null, true);
        } else {
          callback(null, false);
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

/**
 * Handler utama untuk Vercel Serverless Function.
 * CORS preflight (OPTIONS) di-handle di sini sebelum Express dipanggil
 * agar tidak bergantung pada middleware chain NestJS/Better Auth.
 */
export default async function handler(req: Request, res: Response) {
  const origin = req.headers.origin;

  if (isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin as string);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type,Authorization,X-Requested-With',
    );
  }

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  await bootstrap();
  expressInstance(req, res);
}

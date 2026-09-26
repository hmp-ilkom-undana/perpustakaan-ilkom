import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

let cachedApp: INestApplication;
const expressInstance: Express = express();

function getAllowedOrigins(): string[] {
  const frontendUrl = (process.env.FRONTEND_URL || '').replace(/\/+$/, '');
  return [frontendUrl, 'http://localhost:5173', 'http://localhost:5000'].filter(
    Boolean,
  );
}

/**
 * Middleware CORS dipasang langsung di Express instance sebelum NestJS init.
 * Ini memastikan preflight (OPTIONS) selalu mendapat header yang benar,
 * bahkan sebelum middleware chain NestJS berjalan.
 */
expressInstance.use((req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = getAllowedOrigins();
  const origin = req.headers.origin;

  const isOriginAllowed =
    allowedOrigins.length > 0 &&
    typeof origin === 'string' &&
    origin.length > 0 &&
    allowedOrigins.includes(origin);

  if (isOriginAllowed) {
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
    res.status(isOriginAllowed ? 204 : 403).end();
    return;
  }

  next();
});

export async function bootstrap(): Promise<INestApplication> {
  if (!cachedApp) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressInstance),
    );

    app.use(
      helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
      }),
    );

    const allowedOrigins = getAllowedOrigins();

    app.enableCors({
      origin: (origin, callback) => {
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

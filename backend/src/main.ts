import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';

let cachedApp: INestApplication;
const expressInstance: Express = express();

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

    const frontendUrl = (process.env.FRONTEND_URL || '').replace(/\/+$/, '');
    const allowedOrigins = [
      frontendUrl,
      'http://localhost:5173',
      'http://localhost:5000',
    ].filter(Boolean);

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

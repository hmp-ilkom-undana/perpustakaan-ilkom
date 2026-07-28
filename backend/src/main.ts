import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Mengaktifkan CORS agar frontend (React/Vite) bisa berkomunikasi dengan backend
  app.enableCors({
    origin: 'http://localhost:5173', // Sesuaikan dengan port frontend Anda
    credentials: true, // Wajib diaktifkan untuk Better Auth (mengirim cookie sesi)
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

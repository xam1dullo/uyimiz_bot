import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { validateEnv } from '@uyimiz/config';

async function bootstrap() {
  const env = validateEnv(process.env);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ 
      bodyLimit: 1048576,  // 1MB
      requestTimeout: 30000,  // 30s
      trustProxy: true,
    }),
  );

  // Security headers
  app.enableCors({
    origin: ['https://t.me', ...(env.MINIAPP_URL ? [env.MINIAPP_URL] : [])],
    credentials: true,
    maxAge: 86400,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  const port = env.PORT;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server running on http://localhost:${port}`);
}

bootstrap();

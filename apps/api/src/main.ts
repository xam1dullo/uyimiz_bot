import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { validateEnv } from '@uyimiz/config';

async function bootstrap() {
  const env = validateEnv(process.env);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ 
      bodyLimit: 1048576,
      requestTimeout: 30000,
      trustProxy: true,
    }),
  );

  app.enableCors({
    origin: ['https://t.me', ...(env.MINIAPP_URL ? [env.MINIAPP_URL] : [])],
    credentials: true,
    maxAge: 86400,
  });

  app.setGlobalPrefix('api');

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('@uyimiz_bot API')
    .setDescription('Family management Telegram bot + REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = env.PORT;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server: http://localhost:${port}`);
  console.log(`📚 Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();

import { NestFactory } from '@nestjs/core';
import { RateServiceModule } from './rate-service.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(RateServiceModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
  await app.listen(process.env.port ?? 3001);
}
bootstrap();

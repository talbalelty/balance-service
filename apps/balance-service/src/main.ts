import { NestFactory } from '@nestjs/core';
import { BalanceModule } from './balance.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(BalanceModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
  await app.listen(3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Makes validation pipes global
  app.useGlobalPipes(
    new ValidationPipe(
      // Removes elements not defined in dto from req body
      { whitelist: true },
    ),
  );
  await app.listen(3000);
}
bootstrap();

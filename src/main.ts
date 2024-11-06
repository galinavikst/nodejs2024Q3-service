import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // filter out properties that should not be received by the method handler
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const port = process.env.PORT;
  await app.listen(port);
  console.log('Server running on port', port);
}
bootstrap();

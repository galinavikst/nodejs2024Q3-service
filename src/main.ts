import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  function createSwaggerDocument(app: INestApplication): OpenAPIObject {
    const config = new DocumentBuilder()
      .setTitle('Home Library Service')
      .setDescription('Home music library service')
      .setVersion('1.0')
      .build();

    return SwaggerModule.createDocument(app, config);
  }

  const document = createSwaggerDocument(app);
  SwaggerModule.setup('api', app, document);

  // filter out properties that should not be received by the method handler
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, stopAtFirstError: true }),
  );

  const port = process.env.PORT;
  await app.listen(port);
  console.log('Server running on port', port);
}
bootstrap();

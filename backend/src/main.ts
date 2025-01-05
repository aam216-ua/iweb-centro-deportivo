import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = (
    await NestFactory.create(AppModule, {
      logger: ['debug', 'error', 'fatal', 'log', 'verbose', 'warn'],
    })
  ).setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const swagger = new DocumentBuilder()
    .setTitle('IWEB Module')
    .setDescription('API Documentation')
    .setVersion('0.0')
    .build();

  SwaggerModule.setup('api', app, () =>
    SwaggerModule.createDocument(app, swagger)
  );

  await app.listen(3000);
}
bootstrap();

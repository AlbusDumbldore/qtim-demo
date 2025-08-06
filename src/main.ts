import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { bootstrapPipes, bootstrapSwagger } from './bootstrap';
import appConfig from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());

  bootstrapPipes(app);
  bootstrapSwagger(app);

  app.enableShutdownHooks();

  await app.listen(appConfig.port, '0.0.0.0');
}

bootstrap();

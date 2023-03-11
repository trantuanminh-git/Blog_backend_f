import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // origin: 'http://54.179.238.121:3000',
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: '*',
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();

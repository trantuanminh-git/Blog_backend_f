import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {

  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION,
  });

  const app = await NestFactory.create(AppModule);
  const configApp = new DocumentBuilder()
    .setTitle('Blog')
    .setDescription('The blog API description')
    .setVersion('1.0')
    .addTag('blog')
    .build();
  const document = SwaggerModule.createDocument(app, configApp);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    // origin: 'http://54.179.238.121:3000',
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: '*',
  });
  await app.listen(3000);
}
bootstrap();

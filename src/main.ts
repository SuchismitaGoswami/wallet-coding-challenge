import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({}));
  const config = new DocumentBuilder()
    .setTitle('Wallet Management API')
    .setDescription(
      "The openapi specification for the wallet coding challenge that is set by Admiral's Customer Engagement tribe. The challenge is to create an API which matches the specification below which allows a customer to create and view a wallet, apply some transcations (debit and withdrawls) and view a list of all transcations for a specific wallet",
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();

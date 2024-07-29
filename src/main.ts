import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  process.env.TZ = '-03:00';
  app.useGlobalPipes(new ValidationPipe());  //Habilitamos o Validation Globalmente 
  app.enableCors();  //habilitamos requisições de outras origens (Servidores). Faz com que o backend vá pra o front

  await app.listen(4000);
}
bootstrap();

import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: 'http://localhost:5173', // replace with your frontend URL
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

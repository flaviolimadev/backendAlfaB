import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 🛡️ Libera CORS para domínios específicos
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

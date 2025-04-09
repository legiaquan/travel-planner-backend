import { NestFactory } from '@nestjs/core';
import { setupMiddleware } from './app';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setup middleware
  setupMiddleware(app);

  const PORT = process.env.PORT || 3000;

  await app.listen(PORT);
}

bootstrap();

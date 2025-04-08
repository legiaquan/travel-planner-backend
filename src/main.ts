import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupMiddleware } from './app';
async function bootstrapLocal() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  setupMiddleware(app);

  const PORT = process.env.PORT || 3000;
  console.log('PORT', PORT);

  await app.listen(PORT);
}

bootstrapLocal();

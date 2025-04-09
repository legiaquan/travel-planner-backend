import { NestFactory } from '@nestjs/core';

import { setupMiddleware } from './app';
import { AppModule } from './app.module';

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

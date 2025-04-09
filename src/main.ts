import { createAppInstance, setupMiddleware } from './app';

async function bootstrapLocal() {
  const app = await createAppInstance();

  setupMiddleware(app);

  const PORT = process.env.PORT || 3000;

  await app.listen(PORT);
}

bootstrapLocal();

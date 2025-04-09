import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { ValidationPipe } from './pipes/validation.pipe';

export function setupMiddleware(app: INestApplication) {
  const expressApp = app as NestExpressApplication;
  const configService = app.get(ConfigService);
  dotenv.config();

  expressApp.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          connectSrc: [
            `'self'`,
            `'unsafe-inline'`,
            `https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com`,
          ],
          scriptSrc: [
            `'self'`,
            `'unsafe-inline'`,
            'https://*.googletagmanager.com https://tagmanager.google.com',
          ],
          styleSrc: [
            `'self'`,
            `'unsafe-inline'`,
            'https://tagmanager.google.com https://www.googletagmanager.com https://fonts.googleapis.com https://*.googletagmanager.com',
          ],
          imgSrc: [
            `'self'`,
            'data:',
            'https://*.googletagmanager.com https://ssl.gstatic.com https://www.gstatic.com https://*.google-analytics.com',
          ],
          fontSrc: [`'self'`, 'data:', 'https://fonts.gstatic.com'],
        },
      },
    }),
  );

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  //set up swagger
  const apiPrefix = configService.get<string>('app.apiPrefix');
  const apiPath = `${apiPrefix}/docs`;

  const config = new DocumentBuilder()
    .setTitle('Travel Planner API')
    .setDescription('Travel Planner API Documentation')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', in: 'header' }, 'token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(apiPath, app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  expressApp.disable('x-powered-by');

  // Configure body parser
  expressApp.use(bodyParser.json({ limit: '2048mb' }));
  expressApp.use(bodyParser.urlencoded({ limit: '2048mb', extended: true }));

  // Configure compression
  expressApp.use(compression());

  // Configure cookie parser
  expressApp.use(cookieParser());

  // Enable CORS
  expressApp.enableCors({
    origin: configService.get('app.corsOrigin'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  return expressApp;
}

async function createAppInstance() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  setupMiddleware(app);

  return app;
}

async function bootstrapLocal() {
  const app = await createAppInstance();
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port');
  await app.listen(port);
}

// Only run if this file is the entry point
if (require.main === module) {
  bootstrapLocal();
}

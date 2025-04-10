import { INestApplication, VersioningType } from '@nestjs/common';
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

  // Basic security
  expressApp.disable('x-powered-by');
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

  // Body parsing - Must be before any middleware that needs body
  expressApp.use(bodyParser.json({ limit: '2048mb' }));
  expressApp.use(bodyParser.urlencoded({ limit: '2048mb', extended: true }));

  // Cookie parsing
  expressApp.use(cookieParser());

  // Compression
  expressApp.use(compression());

  // CORS
  expressApp.enableCors({
    origin: configService.get('app.corsOrigin'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  // Swagger
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

  return expressApp;
}

export async function createAppInstance() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose', 'fatal'],
    bufferLogs: true,
  });

  setupMiddleware(app);

  return app;
}

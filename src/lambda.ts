import serverlessExpress from '@codegenie/serverless-express';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';
import cookieParser from 'cookie-parser';
import { RequestListener } from 'http';

import { AppModule } from './app.module';
import { setupMiddleware } from './app';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  setupMiddleware(app);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.init();

  const expressInstance = app.getHttpAdapter().getInstance() as RequestListener;
  const lambdaHandler: Handler = serverlessExpress({ app: expressInstance });
  return lambdaHandler;
}

// AWS Lambda handler function
export const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback,
): Promise<any> => {
  if (!server) {
    server = await bootstrap();
  }
  return await server(event, context, callback);
};

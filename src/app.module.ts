import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { loggerConfig } from './common/logger/logger.config';
import { RequestContextMiddleware } from './common/middleware/request-context.middleware';
import { ResponseTimeMiddleware } from './common/middleware/response-time.middleware';
import { mongooseConfig } from './configs/mongoose.config';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRoot(loggerConfig),
    MongooseModule.forRootAsync({
      useFactory: () => mongooseConfig,
    }),
    HealthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware, ResponseTimeMiddleware).forRoutes('*');
  }
}

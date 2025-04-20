import { DynamicModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { loggerConfig } from './common/logger/logger.config';
import { RequestContextMiddleware } from './common/middleware/request-context.middleware';
import { ResponseTimeMiddleware } from './common/middleware/response-time.middleware';
import { mongooseConfig } from './configs/mongoose.config';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { TripModule } from './modules/trip/trip.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRoot(loggerConfig),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        mongooseConfig(configService.get<string>('MONGODB_URI') || ''),
      inject: [ConfigService],
    }),
    HealthModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    TerminusModule,
    AuthModule,
    UserModule,
    TripModule,
  ] as DynamicModule[],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware, ResponseTimeMiddleware).forRoutes('*');
  }
}

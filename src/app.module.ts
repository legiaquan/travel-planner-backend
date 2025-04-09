import { DynamicModule, Module } from '@nestjs/common';
import { ConfigFactory, ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { appConfig } from '@configs/app.config';
import mongooseConfig from '@configs/mongoose.config';
import { HealthModule } from '@modules/health/health.module';

import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, mongooseConfig] as ConfigFactory[],
    }),

    MongooseModule.forRoot(process.env.MONGODB_URI),
    HealthModule,
  ] as DynamicModule[],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}

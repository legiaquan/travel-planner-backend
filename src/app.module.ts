import { Module } from '@nestjs/common';
import { ConfigModule, ConfigFactory } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DynamicModule } from '@nestjs/common';

import { appConfig } from '@configs/app.config';
import mongooseConfig from '@configs/mongoose.config';
import { HealthModule } from '@modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, mongooseConfig] as ConfigFactory[],
    }),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    MongooseModule.forRoot(process.env.MONGODB_URI),
    HealthModule,
  ] as DynamicModule[],
})
export class AppModule {}

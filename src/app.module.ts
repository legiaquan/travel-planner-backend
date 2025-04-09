import { appConfig } from '@configs/app.config';
import mongooseConfig from '@configs/mongoose.config';
import { HealthModule } from '@modules/health/health.module';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigFactory, ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, mongooseConfig] as ConfigFactory[],
    }),

    MongooseModule.forRoot(process.env.MONGODB_URI),
    HealthModule,
  ] as DynamicModule[],
})
export class AppModule {}

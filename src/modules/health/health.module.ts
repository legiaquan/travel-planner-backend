import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CommonModule } from '../../common/common.module';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [MongooseModule, CommonModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}

import { ActivityModel } from '@/models/activity.model';
import { TripModel } from '@/models/trip.model';
import { ActivityRepository } from '@/repositories/activity.repository';
import { TripRepository } from '@/repositories/trip.repository';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TripModel.modelName, schema: TripModel.schema },
      { name: ActivityModel.modelName, schema: ActivityModel.schema },
    ]),
  ],
  controllers: [TripController],
  providers: [TripService, TripRepository, ActivityRepository],
  exports: [TripService],
})
export class TripModule {}

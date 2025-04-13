import { ActivityModel } from '@/models/activity.model';
import { TripModel } from '@/models/trip.model';
import { ActivityRepository } from '@/repositories/activity.repository';
import { TripRepository } from '@/repositories/trip.repository';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TripPlanningController } from './trip-planning.controller';
import { TripPlanningService } from './trip-planning.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TripModel.modelName, schema: TripModel.schema },
      { name: ActivityModel.modelName, schema: ActivityModel.schema },
    ]),
  ],
  controllers: [TripPlanningController],
  providers: [TripPlanningService, TripRepository, ActivityRepository],
  exports: [TripPlanningService],
})
export class TripPlanningModule {}

import { PlanModel } from '@/models/plan.model';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TripPlanningController } from './trip-planning.controller';
import { TripPlanningService } from './trip-planning.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: PlanModel.name, schema: PlanModel.schema }])],
  controllers: [TripPlanningController],
  providers: [TripPlanningService],
  exports: [TripPlanningService],
})
export class TripPlanningModule {}

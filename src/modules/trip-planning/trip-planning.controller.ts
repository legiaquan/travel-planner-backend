import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateActivityDto } from './dto/create-activity.dto';
import { CreateTripDto } from './dto/create-trip.dto';
import { TripPlanningService } from './trip-planning.service';

@Controller('trips')
@UseGuards(JwtAuthGuard)
export class TripPlanningController {
  constructor(private readonly tripPlanningService: TripPlanningService) {}

  @Post()
  async createTrip(
    @CurrentUser('id') userId: Types.ObjectId,
    @Body() createTripDto: CreateTripDto,
  ) {
    return this.tripPlanningService.createTrip(userId, createTripDto);
  }

  @Get()
  async getTrips(
    @CurrentUser('id') userId: Types.ObjectId,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('sort') sort?: string,
  ) {
    return this.tripPlanningService.getTrips(userId, { page, limit, status, sort });
  }

  @Get(':id')
  async getTripById(@CurrentUser('id') userId: Types.ObjectId, @Param('id') tripId: string) {
    return this.tripPlanningService.getTripById(userId, tripId);
  }

  @Put(':id')
  async updateTrip(
    @CurrentUser('id') userId: Types.ObjectId,
    @Param('id') tripId: string,
    @Body() updateData: any,
  ) {
    return this.tripPlanningService.updateTrip(userId, tripId, updateData);
  }

  @Delete(':id')
  async deleteTrip(@CurrentUser('id') userId: Types.ObjectId, @Param('id') tripId: string) {
    return this.tripPlanningService.deleteTrip(userId, tripId);
  }

  @Post(':tripId/activities')
  async addActivity(
    @CurrentUser('id') userId: Types.ObjectId,
    @Param('tripId') tripId: string,
    @Body() createActivityDto: CreateActivityDto,
  ) {
    return this.tripPlanningService.addActivity(userId, tripId, createActivityDto);
  }

  @Put(':tripId/activities/:activityId')
  async updateActivity(
    @CurrentUser('id') userId: Types.ObjectId,
    @Param('tripId') tripId: string,
    @Param('activityId') activityId: string,
    @Body() updateData: any,
  ) {
    return this.tripPlanningService.updateActivity(userId, tripId, activityId, updateData);
  }

  @Delete(':tripId/activities/:activityId')
  async deleteActivity(
    @CurrentUser('id') userId: Types.ObjectId,
    @Param('tripId') tripId: string,
    @Param('activityId') activityId: string,
  ) {
    return this.tripPlanningService.deleteActivity(userId, tripId, activityId);
  }
}

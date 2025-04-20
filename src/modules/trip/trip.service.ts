import { CurrencyType, IActivity, IActivityChecklist } from '@/models/activity.model';
import { ITrip } from '@/models/trip.model';
import { ActivityRepository } from '@/repositories/activity.repository';
import { TripRepository } from '@/repositories/trip.repository';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateActivityDto } from './dto/create-activity.dto';
import { CreateTripDto } from './dto/create-trip.dto';

@Injectable()
export class TripService {
  constructor(
    private readonly tripRepository: TripRepository,
    private readonly activityRepository: ActivityRepository,
  ) {}

  async createTrip(userId: Types.ObjectId, createTripDto: CreateTripDto): Promise<ITrip> {
    const tripData: Partial<ITrip> = {
      userId,
      title: createTripDto.title,
      destination: createTripDto.destination,
      hasDates: createTripDto.hasDates || false,
      durationDays: createTripDto.durationDays,
      startDate: createTripDto.startDate ? new Date(createTripDto.startDate) : undefined,
      endDate: createTripDto.endDate ? new Date(createTripDto.endDate) : undefined,
      description: createTripDto.description || '',
      coverImage: createTripDto.coverImage,
      status: 'planning',
      budget: createTripDto.budget,
      countryCode: createTripDto.countryCode,
      cityId: createTripDto.cityId,
      locationDetails: createTripDto.locationDetails,
      activities: [],
    };

    return this.tripRepository.create(tripData);
  }

  async getTrips(
    userId: Types.ObjectId,
    query: {
      page?: number;
      limit?: number;
      status?: string;
      sort?: string;
    },
  ): Promise<{ trips: ITrip[]; total: number; page: number; limit: number; pages: number }> {
    return this.tripRepository.findAll(userId, query);
  }

  async getTripById(userId: Types.ObjectId, tripId: string): Promise<ITrip | null> {
    return this.tripRepository.findById(userId, tripId);
  }

  async updateTrip(
    userId: Types.ObjectId,
    tripId: string,
    updateData: Partial<ITrip>,
  ): Promise<ITrip | null> {
    return this.tripRepository.update(userId, tripId, updateData);
  }

  async deleteTrip(userId: Types.ObjectId, tripId: string): Promise<void> {
    // Delete all activities associated with the trip
    await this.activityRepository.deleteByTripId(tripId);
    // Delete the trip
    await this.tripRepository.delete(userId, tripId);
  }

  async addActivity(
    userId: Types.ObjectId,
    tripId: string,
    createActivityDto: CreateActivityDto,
  ): Promise<IActivity> {
    // Verify trip exists and belongs to user
    const trip = await this.tripRepository.findById(userId, tripId);
    if (!trip) {
      throw new Error('Trip not found');
    }

    const checklist: IActivityChecklist[] = (createActivityDto.checklist || []).map(item => ({
      id: item.id,
      text: item.text,
      checked: item.checked || false,
    }));

    const activityData: Partial<IActivity> = {
      tripId: new Types.ObjectId(tripId),
      title: createActivityDto.title,
      type: createActivityDto.type,
      startTime: createActivityDto.startTime ? new Date(createActivityDto.startTime) : undefined,
      endTime: createActivityDto.endTime ? new Date(createActivityDto.endTime) : undefined,
      location: createActivityDto.location,
      locationDetails: createActivityDto.locationDetails,
      notes: createActivityDto.notes,
      cost: createActivityDto.cost,
      currency: (createActivityDto.currency || 'USD') as CurrencyType,
      booked: createActivityDto.booked || false,
      checklist,
    };

    const savedActivity = await this.activityRepository.create(activityData);

    // Add activity to trip's activities array
    await this.tripRepository.addActivity(tripId, savedActivity._id);

    return savedActivity;
  }

  async updateActivity(
    userId: Types.ObjectId,
    tripId: string,
    activityId: string,
    updateData: Partial<IActivity>,
  ): Promise<IActivity | null> {
    // Verify trip exists and belongs to user
    const trip = await this.tripRepository.findById(userId, tripId);
    if (!trip) {
      throw new Error('Trip not found');
    }

    return this.activityRepository.update(activityId, updateData);
  }

  async deleteActivity(userId: Types.ObjectId, tripId: string, activityId: string): Promise<void> {
    // Verify trip exists and belongs to user
    const trip = await this.tripRepository.findById(userId, tripId);
    if (!trip) {
      throw new Error('Trip not found');
    }

    // Delete the activity
    await this.activityRepository.delete(activityId);

    // Remove activity from trip's activities array
    await this.tripRepository.removeActivity(tripId, activityId);
  }
}

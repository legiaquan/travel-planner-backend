import { ActivityModel, IActivity } from '@/models/activity.model';
import { ITrip, TripModel } from '@/models/trip.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder, Types } from 'mongoose';
import { CreateActivityDto } from './dto/create-activity.dto';
import { CreateTripDto } from './dto/create-trip.dto';

@Injectable()
export class TripPlanningService {
  constructor(
    @InjectModel(TripModel.name) private tripModel: Model<ITrip>,
    @InjectModel(ActivityModel.name) private activityModel: Model<IActivity>,
  ) {}

  async createTrip(userId: Types.ObjectId, createTripDto: CreateTripDto): Promise<ITrip> {
    const trip = new this.tripModel({
      userId,
      title: createTripDto.title,
      destination: createTripDto.destination,
      hasDates: createTripDto.hasDates || false,
      durationDays: createTripDto.durationDays,
      startDate: createTripDto.startDate,
      endDate: createTripDto.endDate,
      description: createTripDto.description || '',
      coverImage: createTripDto.coverImage,
      status: 'planning',
      budget: createTripDto.budget,
      countryCode: createTripDto.countryCode,
      cityId: createTripDto.cityId,
      locationDetails: createTripDto.locationDetails,
      activities: [],
    });

    return trip.save();
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
    const { page = 1, limit = 10, status, sort = 'startDate:asc' } = query;
    const skip = (page - 1) * limit;

    const filter: any = { userId };
    if (status) {
      filter.status = status;
    }

    const [sortField, sortOrder] = sort.split(':');
    const sortOptions: { [key: string]: SortOrder } = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

    const [trips, total] = await Promise.all([
      this.tripModel
        .find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('activities')
        .exec(),
      this.tripModel.countDocuments(filter),
    ]);

    return {
      trips,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async getTripById(userId: Types.ObjectId, tripId: string): Promise<ITrip> {
    return this.tripModel.findOne({ _id: tripId, userId }).populate('activities').exec();
  }

  async updateTrip(
    userId: Types.ObjectId,
    tripId: string,
    updateData: Partial<ITrip>,
  ): Promise<ITrip> {
    return this.tripModel
      .findOneAndUpdate({ _id: tripId, userId }, { $set: updateData }, { new: true })
      .populate('activities')
      .exec();
  }

  async deleteTrip(userId: Types.ObjectId, tripId: string): Promise<void> {
    // Delete all activities associated with the trip
    await this.activityModel.deleteMany({ tripId }).exec();
    // Delete the trip
    await this.tripModel.deleteOne({ _id: tripId, userId }).exec();
  }

  async addActivity(
    userId: Types.ObjectId,
    tripId: string,
    createActivityDto: CreateActivityDto,
  ): Promise<IActivity> {
    // Verify trip exists and belongs to user
    const trip = await this.tripModel.findOne({ _id: tripId, userId }).exec();
    if (!trip) {
      throw new Error('Trip not found');
    }

    const activity = new this.activityModel({
      tripId,
      title: createActivityDto.title,
      type: createActivityDto.type,
      startTime: createActivityDto.startTime,
      endTime: createActivityDto.endTime,
      location: createActivityDto.location,
      locationDetails: createActivityDto.locationDetails,
      notes: createActivityDto.notes,
      cost: createActivityDto.cost,
      currency: createActivityDto.currency || 'USD',
      booked: createActivityDto.booked || false,
      checklist: createActivityDto.checklist || [],
    });

    const savedActivity = await activity.save();

    // Add activity to trip's activities array
    await this.tripModel.updateOne({ _id: tripId }, { $push: { activities: savedActivity._id } });

    return savedActivity;
  }

  async updateActivity(
    userId: Types.ObjectId,
    tripId: string,
    activityId: string,
    updateData: Partial<IActivity>,
  ): Promise<IActivity> {
    // Verify trip exists and belongs to user
    const trip = await this.tripModel.findOne({ _id: tripId, userId }).exec();
    if (!trip) {
      throw new Error('Trip not found');
    }

    return this.activityModel
      .findOneAndUpdate({ _id: activityId, tripId }, { $set: updateData }, { new: true })
      .exec();
  }

  async deleteActivity(userId: Types.ObjectId, tripId: string, activityId: string): Promise<void> {
    // Verify trip exists and belongs to user
    const trip = await this.tripModel.findOne({ _id: tripId, userId }).exec();
    if (!trip) {
      throw new Error('Trip not found');
    }

    // Delete the activity
    await this.activityModel.deleteOne({ _id: activityId, tripId }).exec();

    // Remove activity from trip's activities array
    await this.tripModel.updateOne({ _id: tripId }, { $pull: { activities: activityId } });
  }
}

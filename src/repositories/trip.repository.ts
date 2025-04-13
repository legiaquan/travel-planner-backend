import { ITrip, TripModel } from '@/models/trip.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder, Types } from 'mongoose';

@Injectable()
export class TripRepository {
  constructor(@InjectModel(TripModel.modelName) private tripModel: Model<ITrip>) {}

  async create(tripData: Partial<ITrip>): Promise<ITrip> {
    const trip = new this.tripModel(tripData);
    return trip.save();
  }

  async findById(userId: Types.ObjectId, tripId: string): Promise<ITrip> {
    return this.tripModel.findOne({ _id: tripId, userId }).populate('activities').exec();
  }

  async findAll(
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

  async update(userId: Types.ObjectId, tripId: string, updateData: Partial<ITrip>): Promise<ITrip> {
    return this.tripModel
      .findOneAndUpdate({ _id: tripId, userId }, { $set: updateData }, { new: true })
      .populate('activities')
      .exec();
  }

  async delete(userId: Types.ObjectId, tripId: string): Promise<void> {
    await this.tripModel.deleteOne({ _id: tripId, userId }).exec();
  }

  async addActivity(tripId: string, activityId: Types.ObjectId): Promise<void> {
    await this.tripModel.updateOne({ _id: tripId }, { $push: { activities: activityId } });
  }

  async removeActivity(tripId: string, activityId: string): Promise<void> {
    await this.tripModel.updateOne({ _id: tripId }, { $pull: { activities: activityId } });
  }
}

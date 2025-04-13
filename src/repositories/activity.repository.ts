import { ActivityModel, IActivity } from '@/models/activity.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ActivityRepository {
  constructor(@InjectModel(ActivityModel.modelName) private activityModel: Model<IActivity>) {}

  async create(activityData: Partial<IActivity>): Promise<IActivity> {
    const activity = new this.activityModel(activityData);
    return activity.save();
  }

  async findById(activityId: string): Promise<IActivity> {
    return this.activityModel.findById(activityId).exec();
  }

  async findByTripId(tripId: string): Promise<IActivity[]> {
    return this.activityModel.find({ tripId }).exec();
  }

  async update(activityId: string, updateData: Partial<IActivity>): Promise<IActivity> {
    return this.activityModel
      .findByIdAndUpdate(activityId, { $set: updateData }, { new: true })
      .exec();
  }

  async delete(activityId: string): Promise<void> {
    await this.activityModel.deleteOne({ _id: activityId }).exec();
  }

  async deleteByTripId(tripId: string): Promise<void> {
    await this.activityModel.deleteMany({ tripId }).exec();
  }
}

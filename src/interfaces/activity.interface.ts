import { Document } from 'mongoose';
import { IActivity } from '@/types/activity.type';

export interface IActivityDocument extends Omit<IActivity, '_id'>, Document {
  // Add any activity-specific methods here
  isOverlapping(startTime: Date, endTime: Date): boolean;
  updateStatus(status: string): Promise<void>;
  addImage(imageUrl: string): Promise<void>;
  removeImage(imageUrl: string): Promise<void>;
}

import { Document } from 'mongoose';
import { IActivity } from '../types/activity.type';

export interface IActivityDocument extends IActivity, Document {
  // Add any activity-specific methods here
  isOverlapping(startTime: Date, endTime: Date): boolean;
  updateStatus(newStatus: string): Promise<void>;
  addImage(imageUrl: string): Promise<void>;
} 
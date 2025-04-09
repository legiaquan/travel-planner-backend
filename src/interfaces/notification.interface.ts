import { Document } from 'mongoose';

import { INotification } from '@/types/notification.type';

export interface INotificationDocument extends Omit<INotification, '_id'>, Document {
  // Add any notification-specific methods here
  markAsRead(): Promise<void>;
  markAsArchived(): Promise<void>;
  getNotificationData(): any;
}

import { Document } from 'mongoose';
import { INotification } from '../types/notification.type';

export interface INotificationDocument extends INotification, Document {
  // Add any notification-specific methods here
  markAsRead(): Promise<void>;
  markAsArchived(): Promise<void>;
  getNotificationData(): Record<string, any>;
} 
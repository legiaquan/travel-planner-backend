import { IBaseDocument } from '@/interfaces/base-document.interface';
import { NotificationStatus, NotificationType } from '../types/notification.type';
import { createBaseSchema } from './base.schema';

export type NotificationDocument = IBaseDocument & {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  data: Record<string, any>;
  readAt?: Date;
};

export const NotificationSchema = createBaseSchema<NotificationDocument>({
  userId: { type: String, required: true, ref: 'User' },
  type: { type: String, enum: NotificationType, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: NotificationStatus, default: NotificationStatus.UNREAD },
  data: { type: Object, default: {} },
  readAt: { type: Date },
});

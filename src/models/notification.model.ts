import { IBaseDocument } from '@/interfaces/base-document.interface';
import { Schema, Types } from 'mongoose';
import { createModel } from './base.model';

export const NOTIFICATION_MODEL_NAME = 'Notification';
export const NOTIFICATION_COLLECTION_NAME = 'notifications';

export interface INotification extends IBaseDocument {
  userId: Types.ObjectId;
  type: string;
  title: string;
  message: string;
  read: boolean;
  data?: any;
}

const schemaDefinition = {
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
    index: true,
  },
  type: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Schema.Types.Mixed,
  },
};

export const NotificationModel = createModel<INotification>(
  NOTIFICATION_MODEL_NAME,
  schemaDefinition,
  {
    collection: NOTIFICATION_COLLECTION_NAME,
  },
);

import { IBaseDocument } from '@/interfaces/base-document.interface';
import { Types } from 'mongoose';
import { createModel } from './base.model';

export const ACTIVITY_MODEL_NAME = 'Activity';
export const ACTIVITY_COLLECTION_NAME = 'activities';

export interface IActivity extends IBaseDocument {
  planId: Types.ObjectId;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  cost: number;
  currency: string;
  status: 'pending' | 'completed' | 'cancelled';
}

const schemaDefinition = {
  planId: {
    type: Types.ObjectId,
    required: true,
    ref: 'Plan',
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  },
};

export const ActivityModel = createModel<IActivity>(ACTIVITY_MODEL_NAME, schemaDefinition, {
  collection: ACTIVITY_COLLECTION_NAME,
});

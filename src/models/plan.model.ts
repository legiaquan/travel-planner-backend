import { IBaseDocument } from '@/common/interfaces/base-document.interface';
import { Types } from 'mongoose';
import { createModel } from './base.model';

export const PLAN_MODEL_NAME = 'Plan';
export const PLAN_COLLECTION_NAME = 'plans';

export interface IPlan extends IBaseDocument {
  userId: Types.ObjectId;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  destinations: Types.ObjectId[];
  activities: Types.ObjectId[];
  isPublic: boolean;
  status: 'draft' | 'published' | 'completed';
}

const schemaDefinition = {
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
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
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  destinations: [
    {
      type: Types.ObjectId,
      ref: 'Destination',
    },
  ],
  activities: [
    {
      type: Types.ObjectId,
      ref: 'Activity',
    },
  ],
  isPublic: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'completed'],
    default: 'draft',
  },
};

export const PlanModel = createModel<IPlan>(PLAN_MODEL_NAME, schemaDefinition, {
  collection: PLAN_COLLECTION_NAME,
});

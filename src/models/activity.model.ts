import { IBaseDocument } from '@/common/interfaces/base-document.interface';
import { Types } from 'mongoose';
import { createModel } from './base.model';

export const ACTIVITY_MODEL_NAME = 'Activity';
export const ACTIVITY_COLLECTION_NAME = 'activities';

export interface IActivityChecklist {
  id: string;
  text: string;
  checked: boolean;
}

export interface IActivityLocation {
  lat: number;
  lng: number;
  address: string;
  name: string;
}

export type ActivityType =
  | 'accommodation'
  | 'transportation'
  | 'attraction'
  | 'food'
  | 'coffee'
  | 'other';

export type CurrencyType = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' | 'VND';

export interface IActivity extends IBaseDocument {
  tripId: Types.ObjectId;
  title: string;
  type: ActivityType;
  startTime: Date;
  endTime: Date;
  location: string;
  locationDetails?: IActivityLocation;
  notes?: string;
  cost: number;
  currency: CurrencyType;
  booked: boolean;
  checklist: IActivityChecklist[];
}

const schemaDefinition = {
  tripId: {
    type: Types.ObjectId,
    required: true,
    ref: 'Trip',
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['accommodation', 'transportation', 'attraction', 'food', 'coffee', 'other'],
    default: 'other',
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
    trim: true,
  },
  locationDetails: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String },
    name: { type: String },
  },
  notes: {
    type: String,
  },
  cost: {
    type: Number,
    required: true,
    default: 0,
  },
  currency: {
    type: String,
    enum: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'VND'],
    default: 'USD',
  },
  booked: {
    type: Boolean,
    default: false,
  },
  checklist: [
    {
      id: { type: String, required: true },
      text: { type: String, required: true },
      checked: { type: Boolean, default: false },
    },
  ],
};

export const ActivityModel = createModel<IActivity>(ACTIVITY_MODEL_NAME, schemaDefinition, {
  collection: ACTIVITY_COLLECTION_NAME,
});

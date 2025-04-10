import { IBaseDocument } from '@/interfaces/base-document.interface';
import { EActivityStatus, EActivityType } from '../types/activity.type';
import { createBaseSchema } from './base.schema';

export type ActivityDocument = IBaseDocument & {
  userId: string;
  tripId: string;
  type: EActivityType;
  title: string;
  description: string;
  location: {
    name: string;
    address: string;
    coordinates: [number, number];
  };
  startTime: Date;
  endTime: Date;
  status: EActivityStatus;
  cost: number;
  currency: string;
  notes: string;
  attachments: string[];
  isPublic: boolean;
};

export const ActivitySchema = createBaseSchema<ActivityDocument>({
  userId: { type: String, required: true, ref: 'User' },
  tripId: { type: String, required: true, ref: 'Trip' },
  type: { type: String, enum: EActivityType, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: { type: [Number], required: true },
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: EActivityStatus, default: EActivityStatus.PLANNED },
  cost: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  notes: { type: String },
  attachments: { type: [String], default: [] },
  isPublic: { type: Boolean, default: false },
});

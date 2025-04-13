import { IBaseDocument } from '@/common/interfaces/base-document.interface';
import { Types } from 'mongoose';
import { createModel } from './base.model';

export const TRIP_MODEL_NAME = 'Trip';
export const TRIP_COLLECTION_NAME = 'trips';

export interface ITripLocation {
  lat: number;
  lng: number;
  address: string;
  name: string;
  country: string;
  city: string;
}

export type TripStatus = 'planning' | 'upcoming' | 'active' | 'completed';

export interface ITrip extends IBaseDocument {
  userId: Types.ObjectId;
  title: string;
  destination: string;
  hasDates: boolean;
  durationDays: number;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  coverImage?: string;
  status: TripStatus;
  budget?: number;
  activities: Types.ObjectId[];
  countryCode?: string;
  cityId?: string;
  locationDetails?: ITripLocation;
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
    index: true,
  },
  destination: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  hasDates: {
    type: Boolean,
    default: false,
  },
  durationDays: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    index: true,
  },
  endDate: {
    type: Date,
    index: true,
  },
  description: {
    type: String,
  },
  coverImage: {
    type: String,
  },
  status: {
    type: String,
    enum: ['planning', 'upcoming', 'active', 'completed'],
    default: 'planning',
    index: true,
  },
  budget: {
    type: Number,
  },
  activities: [
    {
      type: Types.ObjectId,
      ref: 'Activity',
    },
  ],
  countryCode: {
    type: String,
    index: true,
  },
  cityId: {
    type: String,
    index: true,
  },
  locationDetails: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String },
    name: { type: String },
    country: { type: String },
    city: { type: String },
  },
};

export const TripModel = createModel<ITrip>(TRIP_MODEL_NAME, schemaDefinition, {
  collection: TRIP_COLLECTION_NAME,
});

// Compound indexes
TripModel.schema.index({ userId: 1, status: 1 });
TripModel.schema.index({ userId: 1, startDate: 1 });
TripModel.schema.index({ userId: 1, endDate: 1 });
TripModel.schema.index({ userId: 1, destination: 1 });
TripModel.schema.index({ countryCode: 1, cityId: 1 });
TripModel.schema.index({ 'locationDetails.lat': 1, 'locationDetails.lng': 1 }, { sparse: true });

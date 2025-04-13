import { IBaseDocument } from '@/common/interfaces/base-document.interface';
import { Types } from 'mongoose';
import { ESubscriptionTier } from '../common/types';
import { createModel } from './base.model';

export const SUBSCRIPTION_MODEL_NAME = 'Subscription';
export const SUBSCRIPTION_COLLECTION_NAME = 'subscriptions';

export interface ISubscription extends IBaseDocument {
  userId: Types.ObjectId;
  tier: ESubscriptionTier;
  startDate: Date;
  endDate: Date | null;
  autoRenew: boolean;
  paymentMethod?: string;
  status: 'active' | 'cancelled' | 'expired';
}

const schemaDefinition = {
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
    index: true,
  },
  tier: {
    type: String,
    enum: Object.values(ESubscriptionTier),
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: null,
  },
  autoRenew: {
    type: Boolean,
    default: false,
  },
  paymentMethod: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active',
  },
};

export const SubscriptionModel = createModel<ISubscription>(
  SUBSCRIPTION_MODEL_NAME,
  schemaDefinition,
  {
    collection: SUBSCRIPTION_COLLECTION_NAME,
  },
);

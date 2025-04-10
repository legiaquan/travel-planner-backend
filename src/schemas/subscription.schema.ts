import { IBaseDocument } from '@/interfaces/base-document.interface';
import { SubscriptionPlan, SubscriptionStatus } from '../types/subscription.type';
import { createBaseSchema } from './base.schema';

export type SubscriptionDocument = IBaseDocument & {
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethodId?: string;
};

export const SubscriptionSchema = createBaseSchema<SubscriptionDocument>({
  userId: { type: String, required: true, ref: 'User' },
  plan: { type: String, enum: SubscriptionPlan, required: true },
  status: { type: String, enum: SubscriptionStatus, default: SubscriptionStatus.ACTIVE },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  autoRenew: { type: Boolean, default: true },
  paymentMethodId: { type: String },
});

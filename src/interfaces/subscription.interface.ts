import { Document } from 'mongoose';
import { ISubscription } from '@/types/subscription.type';

export interface ISubscriptionDocument extends Omit<ISubscription, '_id'>, Document {
  // Add any subscription-specific methods here
  isActive(): boolean;
  canUpgrade(newPlan: string): boolean;
  cancel(): Promise<void>;
}

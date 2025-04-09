import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { SubscriptionPlan, SubscriptionStatus } from '../types/subscription.type';

export type SubscriptionDocument = Subscription & Document;

@Schema({ timestamps: true })
export class Subscription {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({ type: String, enum: SubscriptionPlan, required: true })
  plan: SubscriptionPlan;

  @Prop({ type: String, enum: SubscriptionStatus, default: SubscriptionStatus.ACTIVE })
  status: SubscriptionStatus;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: true })
  autoRenew: boolean;

  @Prop({ default: null })
  paymentMethodId: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

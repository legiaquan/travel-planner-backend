import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EPaymentStatus, EPaymentMethod } from '@/types/payment.type';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({ ref: 'Subscription' })
  subscriptionId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, default: 'USD' })
  currency: string;

  @Prop({ type: String, enum: EPaymentStatus, default: EPaymentStatus.PENDING })
  status: EPaymentStatus;

  @Prop({ type: String, enum: EPaymentMethod, required: true })
  method: EPaymentMethod;

  @Prop()
  transactionId: string;

  @Prop()
  description: string;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @Prop()
  error: string;

  @Prop()
  completedAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

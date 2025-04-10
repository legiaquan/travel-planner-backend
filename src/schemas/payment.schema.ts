import { IBaseDocument } from '@/interfaces/base-document.interface';
import { EPaymentMethod, EPaymentStatus } from '@/types/payment.type';
import { createBaseSchema } from './base.schema';

export type PaymentDocument = IBaseDocument & {
  userId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  status: EPaymentStatus;
  method: EPaymentMethod;
  transactionId?: string;
  description?: string;
  metadata: Record<string, any>;
  error?: string;
  completedAt?: Date;
};

export const PaymentSchema = createBaseSchema<PaymentDocument>({
  userId: { type: String, required: true, ref: 'User' },
  subscriptionId: { type: String, ref: 'Subscription' },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'USD' },
  status: { type: String, enum: EPaymentStatus, default: EPaymentStatus.PENDING },
  method: { type: String, enum: EPaymentMethod, required: true },
  transactionId: { type: String },
  description: { type: String },
  metadata: { type: Object, default: {} },
  error: { type: String },
  completedAt: { type: Date },
});

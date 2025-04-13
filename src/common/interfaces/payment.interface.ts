import { Document } from 'mongoose';

import { IPayment } from '@/common/types/payment.type';

export interface IPaymentDocument extends Omit<IPayment, '_id'>, Document {
  // Add any payment-specific methods here
  completePayment(transactionId: string): Promise<void>;
  failPayment(error: string): Promise<void>;
  refund(): Promise<void>;
}

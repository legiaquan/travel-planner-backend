import { Document } from 'mongoose';
import { IPayment } from '../types/payment.type';

export interface IPaymentDocument extends IPayment, Document {
  // Add any payment-specific methods here
  completePayment(transactionId: string): Promise<void>;
  failPayment(error: string): Promise<void>;
  refund(): Promise<void>;
} 
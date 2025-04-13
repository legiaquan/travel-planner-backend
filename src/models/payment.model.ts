import { Types } from 'mongoose';
import { IBaseDocument } from '../common/interfaces/base-document.interface';
import { createModel } from './base.model';

export const PAYMENT_MODEL_NAME = 'Payment';
export const PAYMENT_COLLECTION_NAME = 'payments';

export interface IPayment extends IBaseDocument {
  userId: Types.ObjectId;
  subscriptionId: Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
}

const schemaDefinition = {
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
    index: true,
  },
  subscriptionId: {
    type: Types.ObjectId,
    required: true,
    ref: 'Subscription',
    index: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
};

export const PaymentModel = createModel<IPayment>(PAYMENT_MODEL_NAME, schemaDefinition, {
  collection: PAYMENT_COLLECTION_NAME,
});

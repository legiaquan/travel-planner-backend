export enum EPaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

export enum EPaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  PAYPAL = 'PAYPAL',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export interface IPayment {
  _id: string;
  userId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  status: EPaymentStatus;
  method: EPaymentMethod;
  transactionId?: string;
  description?: string;
  metadata?: Record<string, any>;
  error?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreatePayment {
  userId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  method: EPaymentMethod;
  description?: string;
  metadata?: Record<string, any>;
}

export interface IUpdatePayment {
  status?: EPaymentStatus;
  transactionId?: string;
  error?: string;
  completedAt?: Date;
}

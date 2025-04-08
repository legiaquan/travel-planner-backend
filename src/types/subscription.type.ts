export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum SubscriptionPlan {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE',
}

export interface ISubscription {
  _id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethodId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateSubscription {
  userId: string;
  plan: SubscriptionPlan;
  startDate: Date;
  endDate: Date;
  autoRenew?: boolean;
  paymentMethodId?: string;
}

export interface IUpdateSubscription {
  plan?: SubscriptionPlan;
  status?: SubscriptionStatus;
  autoRenew?: boolean;
  paymentMethodId?: string;
}

export enum EUserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  PREMIUM = 'PREMIUM',
}

export enum EUserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
}

export enum ESubscriptionTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE',
}

export interface IUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  avatar?: string;
  role: EUserRole;
  status: EUserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  preferences: {
    language: string;
    theme: string;
    currency: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      activityReminders: boolean;
      tripUpdates: boolean;
      marketingMessages: boolean;
      communityUpdates: boolean;
    };
  };
  subscription: {
    tier: ESubscriptionTier;
    startDate?: Date;
    endDate?: Date;
    autoRenew: boolean;
    paymentMethod?: string;
  };
  socialProfiles?: {
    google?: string;
    facebook?: string;
    twitter?: string;
  };
  stats: {
    tripsCreated: number;
    tripsCompleted: number;
    reviewsWritten: number;
    reviewsLiked: number;
    followers: number;
    following: number;
  };
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  emailVerificationToken?: string;
  emailVerified: boolean;
}

export interface ICreateUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface IUpdateUser {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isActive?: boolean;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IResetPassword {
  token: string;
  newPassword: string;
}

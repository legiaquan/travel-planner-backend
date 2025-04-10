import { IBaseDocument } from '@/interfaces/base-document.interface';
import { ESubscriptionTier, EUserRole, EUserStatus } from '@/types/user.type';
import { createBaseSchema } from './base.schema';

export type UserDocument = User & IBaseDocument;

export class User {
  email: string;
  password: string;
  name: string;
  avatar?: string;
  role: EUserRole;
  status: EUserStatus;
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

export const UserSchema = createBaseSchema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  avatar: { type: String },
  role: { type: String, enum: EUserRole, default: EUserRole.USER },
  status: { type: String, enum: EUserStatus, default: EUserStatus.ACTIVE },
  lastLogin: { type: Date },
  preferences: {
    type: {
      language: { type: String, default: 'en' },
      theme: { type: String, default: 'light' },
      currency: { type: String, default: 'USD' },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        activityReminders: { type: Boolean, default: true },
        tripUpdates: { type: Boolean, default: true },
        marketingMessages: { type: Boolean, default: false },
        communityUpdates: { type: Boolean, default: true },
      },
    },
    default: {
      language: 'en',
      theme: 'light',
      currency: 'USD',
      notifications: {
        email: true,
        push: true,
        sms: false,
        activityReminders: true,
        tripUpdates: true,
        marketingMessages: false,
        communityUpdates: true,
      },
    },
  },
  subscription: {
    type: {
      tier: { type: String, enum: ESubscriptionTier, default: ESubscriptionTier.FREE },
      startDate: { type: Date },
      endDate: { type: Date },
      autoRenew: { type: Boolean, default: false },
      paymentMethod: { type: String },
    },
    default: {
      tier: ESubscriptionTier.FREE,
      autoRenew: false,
    },
  },
  socialProfiles: {
    type: {
      google: { type: String },
      facebook: { type: String },
      twitter: { type: String },
    },
  },
  stats: {
    type: {
      tripsCreated: { type: Number, default: 0 },
      tripsCompleted: { type: Number, default: 0 },
      reviewsWritten: { type: Number, default: 0 },
      reviewsLiked: { type: Number, default: 0 },
      followers: { type: Number, default: 0 },
      following: { type: Number, default: 0 },
    },
    default: {
      tripsCreated: 0,
      tripsCompleted: 0,
      reviewsWritten: 0,
      reviewsLiked: 0,
      followers: 0,
      following: 0,
    },
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  emailVerificationToken: { type: String },
  emailVerified: { type: Boolean, default: false },
});

// Không lưu mật khẩu dưới dạng plain text trong response
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

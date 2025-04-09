import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { ESubscriptionTier, EUserRole, EUserStatus } from '@/types/user.type';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop()
  avatar: string;

  @Prop({ type: String, enum: EUserRole, default: EUserRole.USER })
  role: EUserRole;

  @Prop({ type: String, enum: EUserStatus, default: EUserStatus.ACTIVE })
  status: EUserStatus;

  @Prop()
  lastLogin: Date;

  @Prop({
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
  })
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

  @Prop({
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
  })
  subscription: {
    tier: ESubscriptionTier;
    startDate?: Date;
    endDate?: Date;
    autoRenew: boolean;
    paymentMethod?: string;
  };

  @Prop({
    type: {
      google: { type: String },
      facebook: { type: String },
      twitter: { type: String },
    },
  })
  socialProfiles: {
    google?: string;
    facebook?: string;
    twitter?: string;
  };

  @Prop({
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
  })
  stats: {
    tripsCreated: number;
    tripsCompleted: number;
    reviewsWritten: number;
    reviewsLiked: number;
    followers: number;
    following: number;
  };

  @Prop()
  resetPasswordToken: string;

  @Prop()
  resetPasswordExpires: Date;

  @Prop()
  emailVerificationToken: string;

  @Prop({ default: false })
  emailVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Không lưu mật khẩu dưới dạng plain text trong response
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

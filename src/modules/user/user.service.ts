import { hashPassword } from '@/utils/password.util';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import {
  EUserRole,
  EUserStatus,
  ICreateUser,
  IResetPassword,
  IUpdateUser,
} from '../../types/user.type';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findOne(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async create(createUserDto: ICreateUser): Promise<UserDocument> {
    const hashedPassword = await hashPassword(createUserDto.password);
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      name: `${createUserDto.firstName} ${createUserDto.lastName}`,
      role: EUserRole.USER,
      status: EUserStatus.ACTIVE,
      preferences: {
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
      subscription: {
        tier: 'FREE',
        autoRenew: false,
      },
      stats: {
        tripsCreated: 0,
        tripsCompleted: 0,
        reviewsWritten: 0,
        reviewsLiked: 0,
        followers: 0,
        following: 0,
      },
      emailVerified: false,
    });
    return user.save();
  }

  async update(id: string, updateUserDto: IUpdateUser): Promise<UserDocument | null> {
    const updateData: any = { ...updateUserDto };
    if (updateUserDto.firstName || updateUserDto.lastName) {
      updateData.name = `${updateUserDto.firstName || ''} ${updateUserDto.lastName || ''}`.trim();
    }
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async delete(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async resetPassword(resetPasswordDto: IResetPassword): Promise<UserDocument | null> {
    const user = await this.userModel
      .findOne({
        resetPasswordToken: resetPasswordDto.token,
        resetPasswordExpires: { $gt: new Date() },
      })
      .exec();

    if (!user) {
      return null;
    }

    const hashedPassword = await hashPassword(resetPasswordDto.newPassword);
    return this.userModel
      .findByIdAndUpdate(
        user._id,
        {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
        { new: true },
      )
      .exec();
  }

  async verifyEmail(token: string): Promise<UserDocument | null> {
    return this.userModel
      .findOneAndUpdate(
        { emailVerificationToken: token },
        {
          emailVerified: true,
          emailVerificationToken: null,
        },
        { new: true },
      )
      .exec();
  }

  async updatePreferences(
    id: string,
    preferences: Partial<User['preferences']>,
  ): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, { $set: { preferences } }, { new: true }).exec();
  }

  async updateSubscription(
    id: string,
    subscription: Partial<User['subscription']>,
  ): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, { $set: { subscription } }, { new: true }).exec();
  }

  async linkSocialProfile(
    id: string,
    provider: keyof User['socialProfiles'],
    profileId: string,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, { $set: { [`socialProfiles.${provider}`]: profileId } }, { new: true })
      .exec();
  }

  async unlinkSocialProfile(
    id: string,
    provider: keyof User['socialProfiles'],
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, { $unset: { [`socialProfiles.${provider}`]: 1 } }, { new: true })
      .exec();
  }

  async updateStats(
    id: string,
    field: keyof User['stats'],
    increment: number,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, { $inc: { [`stats.${field}`]: increment } }, { new: true })
      .exec();
  }

  async updatePassword(id: string, newPassword: string): Promise<UserDocument | null> {
    const hashedPassword = await hashPassword(newPassword);
    return this.userModel.findByIdAndUpdate(id, { password: hashedPassword }, { new: true }).exec();
  }
}

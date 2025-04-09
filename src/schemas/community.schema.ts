import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { CommunityRole, CommunityType } from '../types/community.type';

export type CommunityDocument = Community & Document;

@Schema({ timestamps: true })
export class Community {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: String, enum: CommunityType, default: CommunityType.PUBLIC })
  type: CommunityType;

  @Prop({ required: true, ref: 'User' })
  ownerId: string;

  @Prop({
    type: [
      {
        userId: { type: String, ref: 'User' },
        role: { type: String, enum: CommunityRole },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  members: Array<{
    userId: string;
    role: CommunityRole;
    joinedAt: Date;
  }>;

  @Prop()
  coverImage: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const CommunitySchema = SchemaFactory.createForClass(Community);

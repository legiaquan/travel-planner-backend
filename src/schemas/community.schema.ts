import { IBaseDocument } from '@/interfaces/base-document.interface';
import { CommunityRole, CommunityType } from '../types/community.type';
import { createBaseSchema } from './base.schema';

export type CommunityDocument = IBaseDocument & {
  name: string;
  description: string;
  type: CommunityType;
  ownerId: string;
  members: Array<{
    userId: string;
    role: CommunityRole;
    joinedAt: Date;
  }>;
  coverImage?: string;
  tags: string[];
  isActive: boolean;
};

export const CommunitySchema = createBaseSchema<CommunityDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: CommunityType, default: CommunityType.PUBLIC },
  ownerId: { type: String, required: true, ref: 'User' },
  members: {
    type: [
      {
        userId: { type: String, ref: 'User' },
        role: { type: String, enum: CommunityRole },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
  coverImage: { type: String },
  tags: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
});

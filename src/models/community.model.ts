import { IBaseDocument } from '@/common/interfaces/base-document.interface';
import { CommunityType } from '@/common/types/community.type';
import { Types } from 'mongoose';
import { createModel } from './base.model';

export const COMMUNITY_MODEL_NAME = 'Community';
export const COMMUNITY_COLLECTION_NAME = 'communities';

export interface ICommunity extends IBaseDocument {
  name: string;
  description: string;
  type: CommunityType;
  ownerId: Types.ObjectId;
  members: Types.ObjectId[];
  coverImage?: string;
  tags: string[];
  isActive: boolean;
}

const schemaDefinition = {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: CommunityType,
    default: CommunityType.PUBLIC,
  },
  ownerId: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
    index: true,
  },
  members: [
    {
      type: Types.ObjectId,
      ref: 'User',
    },
  ],
  coverImage: {
    type: String,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
};

export const CommunityModel = createModel<ICommunity>(COMMUNITY_MODEL_NAME, schemaDefinition, {
  collection: COMMUNITY_COLLECTION_NAME,
});

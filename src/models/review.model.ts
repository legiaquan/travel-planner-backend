import { IBaseDocument } from '@/common/interfaces/base-document.interface';
import { Types } from 'mongoose';
import { createModel } from './base.model';

export const REVIEW_MODEL_NAME = 'Review';
export const REVIEW_COLLECTION_NAME = 'reviews';

export interface IReview extends IBaseDocument {
  userId: Types.ObjectId;
  tripId: Types.ObjectId;
  rating: number;
  comment: string;
  likes: number;
  images?: string[];
}

const schemaDefinition = {
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
    index: true,
  },
  tripId: {
    type: Types.ObjectId,
    required: true,
    ref: 'Trip',
    index: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  images: [
    {
      type: String,
    },
  ],
};

export const ReviewModel = createModel<IReview>(REVIEW_MODEL_NAME, schemaDefinition, {
  collection: REVIEW_COLLECTION_NAME,
});

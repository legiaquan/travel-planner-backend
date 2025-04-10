import { IBaseDocument } from '@/interfaces/base-document.interface';
import { ReviewType } from '../types/review.type';
import { createBaseSchema } from './base.schema';

export type ReviewDocument = IBaseDocument & {
  userId: string;
  targetId: string;
  type: ReviewType;
  rating: number;
  content: string;
  images: string[];
  likes: string[];
};

export const ReviewSchema = createBaseSchema<ReviewDocument>({
  userId: { type: String, required: true, ref: 'User' },
  targetId: { type: String, required: true },
  type: { type: String, enum: ReviewType, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  content: { type: String, required: true },
  images: { type: [String], default: [] },
  likes: { type: [String], default: [] },
});

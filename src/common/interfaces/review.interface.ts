import { Document } from 'mongoose';

import { IReview } from '@/common/types/review.type';

export interface IReviewDocument extends Omit<IReview, '_id'>, Document {
  // Add any review-specific methods here
  isOwner(userId: string): boolean;
  toggleLike(userId: string): Promise<void>;
}

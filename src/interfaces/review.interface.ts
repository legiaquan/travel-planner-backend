import { Document } from 'mongoose';
import { IReview } from '../types/review.type';

export interface IReviewDocument extends IReview, Document {
  // Add any review-specific methods here
  isOwner(userId: string): boolean;
  toggleLike(userId: string): Promise<void>;
} 
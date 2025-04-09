import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { ReviewType } from '../types/review.type';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  targetId: string;

  @Prop({ type: String, enum: ReviewType, required: true })
  type: ReviewType;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [String], default: [] })
  likes: string[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

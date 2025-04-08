import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PlanStatus, PlanVisibility } from '../types/plan.type';

export type PlanDocument = Plan & Document;

@Schema({ timestamps: true })
export class Plan {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: String, enum: PlanStatus, default: PlanStatus.DRAFT })
  status: PlanStatus;

  @Prop({ type: String, enum: PlanVisibility, default: PlanVisibility.PRIVATE })
  visibility: PlanVisibility;

  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({ default: 0 })
  budget: number;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: null })
  coverImage: string;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);

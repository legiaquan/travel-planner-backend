import { IBaseDocument } from '@/interfaces/base-document.interface';
import { PlanStatus, PlanType } from '../types/plan.type';
import { createBaseSchema } from './base.schema';

export type PlanDocument = IBaseDocument & {
  userId: string;
  title: string;
  description: string;
  type: PlanType;
  status: PlanStatus;
  startDate: Date;
  endDate: Date;
  destination: string;
  budget: number;
  currency: string;
  tags: string[];
  isPublic: boolean;
};

export const PlanSchema = createBaseSchema<PlanDocument>({
  userId: { type: String, required: true, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: PlanType, required: true },
  status: { type: String, enum: PlanStatus, default: PlanStatus.DRAFT },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  destination: { type: String, required: true },
  budget: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  tags: { type: [String], default: [] },
  isPublic: { type: Boolean, default: false },
});

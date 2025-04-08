import { Document } from 'mongoose';
import { IPlan } from '../types/plan.type';

export interface IPlanDocument extends IPlan, Document {
  // Add any plan-specific methods here
  isOwner(userId: string): boolean;
  canView(userId: string): Promise<boolean>;
} 
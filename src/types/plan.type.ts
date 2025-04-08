export enum PlanStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PlanVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  FRIENDS = 'FRIENDS',
}

export interface IPlan {
  _id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: PlanStatus;
  visibility: PlanVisibility;
  userId: string;
  budget: number;
  currency: string;
  tags: string[];
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreatePlan {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status?: PlanStatus;
  visibility?: PlanVisibility;
  budget?: number;
  currency?: string;
  tags?: string[];
  coverImage?: string;
}

export interface IUpdatePlan {
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: PlanStatus;
  visibility?: PlanVisibility;
  budget?: number;
  currency?: string;
  tags?: string[];
  coverImage?: string;
} 
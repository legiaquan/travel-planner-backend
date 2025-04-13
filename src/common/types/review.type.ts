export enum ReviewType {
  PLAN = 'PLAN',
  LOCATION = 'LOCATION',
  ACTIVITY = 'ACTIVITY',
}

export interface IReview {
  _id: string;
  userId: string;
  targetId: string;
  type: ReviewType;
  rating: number;
  content: string;
  images?: string[];
  likes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateReview {
  targetId: string;
  type: ReviewType;
  rating: number;
  content: string;
  images?: string[];
}

export interface IUpdateReview {
  rating?: number;
  content?: string;
  images?: string[];
}

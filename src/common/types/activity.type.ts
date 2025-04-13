export enum EActivityType {
  TRANSPORTATION = 'TRANSPORTATION',
  ACCOMMODATION = 'ACCOMMODATION',
  FOOD = 'FOOD',
  ATTRACTION = 'ATTRACTION',
  SHOPPING = 'SHOPPING',
  OTHER = 'OTHER',
}

export enum EActivityStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface IActivity {
  _id: string;
  planId: string;
  type: EActivityType;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: {
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  status: EActivityStatus;
  cost?: number;
  currency?: string;
  notes?: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateActivity {
  planId: string;
  type: EActivityType;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: {
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  status?: EActivityStatus;
  cost?: number;
  currency?: string;
  notes?: string;
  images?: string[];
}

export interface IUpdateActivity {
  type?: EActivityType;
  title?: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
  location?: {
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  status?: EActivityStatus;
  cost?: number;
  currency?: string;
  notes?: string;
  images?: string[];
}

export enum NotificationType {
  PLAN_INVITATION = 'PLAN_INVITATION',
  PLAN_UPDATE = 'PLAN_UPDATE',
  ACTIVITY_REMINDER = 'ACTIVITY_REMINDER',
  REVIEW_REQUEST = 'REVIEW_REQUEST',
  SUBSCRIPTION = 'SUBSCRIPTION',
  SYSTEM = 'SYSTEM',
}

export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
  ARCHIVED = 'ARCHIVED',
}

export interface INotification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  data?: Record<string, any>;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateNotification {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
}

export interface IUpdateNotification {
  status?: NotificationStatus;
  readAt?: Date;
}

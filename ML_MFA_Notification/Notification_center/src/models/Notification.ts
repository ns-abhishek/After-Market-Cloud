export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
  DELETED = 'deleted'
}

export enum NotificationCategory {
  SYSTEM = 'system',
  SOCIAL = 'social',
  PROMOTIONAL = 'promotional',
  SECURITY = 'security',
  UPDATES = 'updates',
  REMINDERS = 'reminders',
  CUSTOM = 'custom'
}

export enum ActionType {
  LINK = 'link',
  BUTTON = 'button',
  FORM = 'form',
  APPROVE = 'approve',
  DECLINE = 'decline',
  SCHEDULE = 'schedule',
  CUSTOM = 'custom'
}

export interface NotificationAction {
  id: string;
  type: ActionType;
  label: string;
  value?: string;
  url?: string;
  completed: boolean;
  completedAt?: Date;
  metadata?: Record<string, any>;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  status: NotificationStatus;
  createdAt: Date;
  updatedAt: Date;
  readAt?: Date;
  archivedAt?: Date;
  deletedAt?: Date;
  expiresAt?: Date;
  actions: NotificationAction[];
  sourceApp?: string;
  sourceId?: string;
  metadata?: Record<string, any>;
  imageUrl?: string;
  iconUrl?: string;
  isStarred: boolean;
  tags: string[];
  relatedNotifications?: string[]; // IDs of related notifications
  interactionScore?: number; // ML-derived score for user interaction likelihood
  scheduledFor?: Date; // For scheduled notifications
  reminderTime?: Date; // For reminders
  isDraft: boolean;
  isAwaiting: boolean; // Awaiting user action
}

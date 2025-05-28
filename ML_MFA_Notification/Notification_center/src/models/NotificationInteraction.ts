export enum InteractionType {
  VIEWED = 'viewed',
  READ = 'read',
  CLICKED = 'clicked',
  DISMISSED = 'dismissed',
  SNOOZED = 'snoozed',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
  STARRED = 'starred',
  UNSTARRED = 'unstarred',
  ACTION_COMPLETED = 'action_completed',
  ACTION_FAILED = 'action_failed',
  SCHEDULED = 'scheduled',
  REMINDED = 'reminded',
  SHARED = 'shared',
  CUSTOM = 'custom'
}

export interface NotificationInteraction {
  id: string;
  userId: string;
  notificationId: string;
  type: InteractionType;
  timestamp: Date;
  deviceInfo?: {
    id: string;
    type: string;
    os?: string;
    browser?: string;
  };
  locationInfo?: {
    country?: string;
    region?: string;
    city?: string;
  };
  metadata?: Record<string, any>;
  duration?: number; // Time spent viewing/interacting with notification (in ms)
  actionId?: string; // If interaction is with a specific action
}

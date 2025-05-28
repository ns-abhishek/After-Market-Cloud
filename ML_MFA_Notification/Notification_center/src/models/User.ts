export interface UserPreferences {
  language: string;
  timezone: string;
  notificationDeliveryPreferences: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    sms: boolean;
  };
  categoryPreferences: Record<string, {
    enabled: boolean;
    priority: string;
    deliveryChannels: string[];
  }>;
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
    days: number[]; // 0-6, where 0 is Sunday
  };
  digestPreferences: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'custom';
    time?: string; // HH:MM format
    days?: number[]; // 0-6, where 0 is Sunday
  };
}

export interface UserBehavior {
  lastActive: Date;
  activeHours: Record<string, number>; // Hour of day (0-23) to activity score
  activeDays: Record<string, number>; // Day of week (0-6) to activity score
  notificationInteractions: {
    openRate: number;
    responseRate: number;
    averageResponseTime: number;
    dismissRate: number;
    categoryEngagement: Record<string, number>;
  };
  deviceUsage: Record<string, number>; // Device ID to usage percentage
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  behavior: UserBehavior;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  devices: {
    id: string;
    type: string;
    name: string;
    token?: string;
    lastActive?: Date;
  }[];
}

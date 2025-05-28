import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Notification, NotificationStatus } from '@/models/Notification';
import { RootState } from '../index';

interface NotificationsState {
  items: Notification[];
  filteredItems: Notification[];
  activeFilters: {
    status: NotificationStatus[];
    categories: string[];
    priority: string[];
    search: string;
    dateRange: {
      start: Date | null;
      end: Date | null;
    };
    isStarred: boolean | null;
    tags: string[];
  };
  loading: boolean;
  error: string | null;
  selectedNotification: Notification | null;
}

const initialState: NotificationsState = {
  items: [],
  filteredItems: [],
  activeFilters: {
    status: [],
    categories: [],
    priority: [],
    search: '',
    dateRange: {
      start: null,
      end: null,
    },
    isStarred: null,
    tags: [],
  },
  loading: false,
  error: null,
  selectedNotification: null,
};

// Mock API call - replace with actual API in production
const fetchNotifications = async () => {
  // Simulate API call
  return new Promise<Notification[]>((resolve) => {
    setTimeout(() => {
      resolve([]);
    }, 500);
  });
};

export const getNotifications = createAsyncThunk(
  'notifications/getNotifications',
  async () => {
    const response = await fetchNotifications();
    return response;
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setSelectedNotification: (state, action: PayloadAction<Notification | null>) => {
      state.selectedNotification = action.payload;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find(n => n.id === action.payload);
      if (notification) {
        notification.status = NotificationStatus.READ;
        notification.readAt = new Date();
      }
    },
    markAsUnread: (state, action: PayloadAction<string>) => {
      const notification = state.items.find(n => n.id === action.payload);
      if (notification) {
        notification.status = NotificationStatus.UNREAD;
        notification.readAt = undefined;
      }
    },
    archiveNotification: (state, action: PayloadAction<string>) => {
      const notification = state.items.find(n => n.id === action.payload);
      if (notification) {
        notification.status = NotificationStatus.ARCHIVED;
        notification.archivedAt = new Date();
      }
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      const notification = state.items.find(n => n.id === action.payload);
      if (notification) {
        notification.status = NotificationStatus.DELETED;
        notification.deletedAt = new Date();
      }
    },
    starNotification: (state, action: PayloadAction<string>) => {
      const notification = state.items.find(n => n.id === action.payload);
      if (notification) {
        notification.isStarred = true;
      }
    },
    unstarNotification: (state, action: PayloadAction<string>) => {
      const notification = state.items.find(n => n.id === action.payload);
      if (notification) {
        notification.isStarred = false;
      }
    },
    setFilters: (state, action: PayloadAction<Partial<NotificationsState['activeFilters']>>) => {
      state.activeFilters = { ...state.activeFilters, ...action.payload };
      state.filteredItems = applyFilters(state.items, state.activeFilters);
    },
    clearFilters: (state) => {
      state.activeFilters = initialState.activeFilters;
      state.filteredItems = state.items;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.filteredItems = applyFilters(action.payload, state.activeFilters);
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      });
  },
});

// Helper function to apply filters
const applyFilters = (
  notifications: Notification[],
  filters: NotificationsState['activeFilters']
): Notification[] => {
  return notifications.filter((notification) => {
    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(notification.status)) {
      return false;
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(notification.category)) {
      return false;
    }

    // Priority filter
    if (filters.priority.length > 0 && !filters.priority.includes(notification.priority)) {
      return false;
    }

    // Search filter
    if (filters.search && 
        !notification.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !notification.body.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Date range filter
    if (filters.dateRange.start && new Date(notification.createdAt) < filters.dateRange.start) {
      return false;
    }
    if (filters.dateRange.end && new Date(notification.createdAt) > filters.dateRange.end) {
      return false;
    }

    // Starred filter
    if (filters.isStarred !== null && notification.isStarred !== filters.isStarred) {
      return false;
    }

    // Tags filter
    if (filters.tags.length > 0 && !filters.tags.some(tag => notification.tags.includes(tag))) {
      return false;
    }

    return true;
  });
};

export const {
  setSelectedNotification,
  markAsRead,
  markAsUnread,
  archiveNotification,
  deleteNotification,
  starNotification,
  unstarNotification,
  setFilters,
  clearFilters,
} = notificationsSlice.actions;

export const selectNotifications = (state: RootState) => state.notifications.items;
export const selectFilteredNotifications = (state: RootState) => state.notifications.filteredItems;
export const selectNotificationsLoading = (state: RootState) => state.notifications.loading;
export const selectNotificationsError = (state: RootState) => state.notifications.error;
export const selectSelectedNotification = (state: RootState) => state.notifications.selectedNotification;
export const selectActiveFilters = (state: RootState) => state.notifications.activeFilters;
export const selectUnreadCount = (state: RootState) => 
  state.notifications.items.filter(n => n.status === NotificationStatus.UNREAD).length;

export default notificationsSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

interface UIState {
  sidebarOpen: boolean;
  notificationPanelOpen: boolean;
  preferencePanelOpen: boolean;
  currentView: 'list' | 'detail' | 'preferences' | 'analytics' | 'compose';
  theme: 'light' | 'dark' | 'system';
  compactView: boolean;
  groupByCategory: boolean;
  sortBy: 'date' | 'priority' | 'category' | 'status';
  sortDirection: 'asc' | 'desc';
}

const initialState: UIState = {
  sidebarOpen: true,
  notificationPanelOpen: false,
  preferencePanelOpen: false,
  currentView: 'list',
  theme: 'system',
  compactView: false,
  groupByCategory: false,
  sortBy: 'date',
  sortDirection: 'desc',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleNotificationPanel: (state) => {
      state.notificationPanelOpen = !state.notificationPanelOpen;
    },
    togglePreferencePanel: (state) => {
      state.preferencePanelOpen = !state.preferencePanelOpen;
    },
    setCurrentView: (state, action: PayloadAction<UIState['currentView']>) => {
      state.currentView = action.payload;
    },
    setTheme: (state, action: PayloadAction<UIState['theme']>) => {
      state.theme = action.payload;
    },
    toggleCompactView: (state) => {
      state.compactView = !state.compactView;
    },
    toggleGroupByCategory: (state) => {
      state.groupByCategory = !state.groupByCategory;
    },
    setSortBy: (state, action: PayloadAction<UIState['sortBy']>) => {
      state.sortBy = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<UIState['sortDirection']>) => {
      state.sortDirection = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  toggleNotificationPanel,
  togglePreferencePanel,
  setCurrentView,
  setTheme,
  toggleCompactView,
  toggleGroupByCategory,
  setSortBy,
  setSortDirection,
} = uiSlice.actions;

export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen;
export const selectNotificationPanelOpen = (state: RootState) => state.ui.notificationPanelOpen;
export const selectPreferencePanelOpen = (state: RootState) => state.ui.preferencePanelOpen;
export const selectCurrentView = (state: RootState) => state.ui.currentView;
export const selectTheme = (state: RootState) => state.ui.theme;
export const selectCompactView = (state: RootState) => state.ui.compactView;
export const selectGroupByCategory = (state: RootState) => state.ui.groupByCategory;
export const selectSortBy = (state: RootState) => state.ui.sortBy;
export const selectSortDirection = (state: RootState) => state.ui.sortDirection;

export default uiSlice.reducer;

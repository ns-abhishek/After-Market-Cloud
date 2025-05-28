import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserPreferences } from '@/models/User';
import { RootState } from '../index';

interface UserState {
  currentUser: User | null;
  preferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  preferences: null,
  loading: false,
  error: null,
};

// Mock API call - replace with actual API in production
const fetchUser = async () => {
  // Simulate API call
  return new Promise<User>((resolve) => {
    setTimeout(() => {
      resolve({} as User);
    }, 500);
  });
};

export const getCurrentUser = createAsyncThunk(
  'user/getCurrentUser',
  async () => {
    const response = await fetchUser();
    return response;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      if (state.preferences) {
        state.preferences = { ...state.preferences, ...action.payload };
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.preferences = action.payload.preferences;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.preferences = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.preferences = action.payload.preferences;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user';
      });
  },
});

export const { updatePreferences, setUser, clearUser } = userSlice.actions;

export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectUserPreferences = (state: RootState) => state.user.preferences;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;

export default userSlice.reducer;

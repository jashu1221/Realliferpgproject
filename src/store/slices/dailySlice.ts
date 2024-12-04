import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Daily } from '../../types/daily';

interface DailyState {
  dailies: Daily[];
  selectedDaily: Daily | null;
  loading: boolean;
  error: string | null;
}

const initialState: DailyState = {
  dailies: [],
  selectedDaily: null,
  loading: false,
  error: null,
};

const dailySlice = createSlice({
  name: 'dailies',
  initialState,
  reducers: {
    setDailies: (state, action: PayloadAction<Daily[]>) => {
      console.log('dailySlice: Setting dailies:', action.payload);
      state.dailies = action.payload;
      state.error = null;
    },
    setSelectedDaily: (state, action: PayloadAction<Daily>) => {
      console.log('dailySlice: Setting selected daily:', action.payload);
      state.selectedDaily = action.payload;
      state.error = null;
    },
    clearSelectedDaily: (state) => {
      console.log('dailySlice: Clearing selected daily');
      state.selectedDaily = null;
    },
    updateDailyStatus: (
      state,
      action: PayloadAction<{ id: string; status: Daily['status'] }>
    ) => {
      console.log('dailySlice: Updating daily status:', action.payload);
      const daily = state.dailies.find((d) => d.id === action.payload.id);
      if (daily) {
        daily.status = action.payload.status;
      }
    },
    deleteDailyAction: (state, action: PayloadAction<string>) => {
      console.log('dailySlice: Deleting daily:', action.payload);
      state.dailies = state.dailies.filter(
        (daily) => daily.id !== action.payload
      );
      // Clear selected daily if it was the one being deleted
      if (state.selectedDaily?.id === action.payload) {
        state.selectedDaily = null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      console.log('dailySlice: Setting loading:', action.payload);
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      console.log('dailySlice: Setting error:', action.payload);
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setDailies,
  setSelectedDaily,
  clearSelectedDaily,
  updateDailyStatus,
  deleteDailyAction,
  setLoading,
  setError,
} = dailySlice.actions;

export default dailySlice.reducer;

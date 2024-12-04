import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Habit } from '../../types';

interface HabitState {
  habits: Habit[];
  selectedHabit: Habit | null;
  loading: boolean;
  error: string | null;
}

const initialState: HabitState = {
  habits: [],
  selectedHabit: null,
  loading: false,
  error: null,
};

const habitSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    setHabits: (state, action: PayloadAction<Habit[]>) => {
      console.log('habitSlice: Setting habits:', action.payload);
      state.habits = action.payload;
      state.error = null;
    },

    setSelectedHabit: (state, action: PayloadAction<Habit>) => {
      console.log('habitSlice: Setting selected habit:', action.payload);
      state.selectedHabit = action.payload;
      state.error = null;
    },

    clearSelectedHabit: (state) => {
      console.log('habitSlice: Clearing selected habit');
      state.selectedHabit = null;
    },

    incrementHitLevel: (state, action: PayloadAction<string>) => {
      console.log(
        'habitSlice: Incrementing hit level for habit:',
        action.payload
      );
      const habit = state.habits.find((h) => h.id === action.payload);
      if (habit && habit.currentHits < (habit.maxHits || 4)) {
        habit.currentHits += 1;
        habit.totalHits += 1;

        // Update selected habit if it's the same one
        if (state.selectedHabit?.id === action.payload) {
          state.selectedHabit = { ...habit };
        }
      }
    },

    decrementHitLevel: (state, action: PayloadAction<string>) => {
      console.log(
        'habitSlice: Decrementing hit level for habit:',
        action.payload
      );
      const habit = state.habits.find((h) => h.id === action.payload);
      if (habit && habit.currentHits > 0) {
        habit.currentHits -= 1;
        habit.totalHits = Math.max(0, habit.totalHits - 1);

        // Update selected habit if it's the same one
        if (state.selectedHabit?.id === action.payload) {
          state.selectedHabit = { ...habit };
        }
      }
    },

    deleteHabitAction: (state, action: PayloadAction<string>) => {
      console.log('habitSlice: Deleting habit:', action.payload);
      state.habits = state.habits.filter(
        (habit) => habit.id !== action.payload
      );
      if (state.selectedHabit?.id === action.payload) {
        state.selectedHabit = null;
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      console.log('habitSlice: Setting loading:', action.payload);
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      console.log('habitSlice: Setting error:', action.payload);
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setHabits,
  setSelectedHabit,
  clearSelectedHabit,
  incrementHitLevel,
  decrementHitLevel,
  deleteHabitAction,
  setLoading,
  setError,
} = habitSlice.actions;

export default habitSlice.reducer;

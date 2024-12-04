import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Goal } from '../../types/goal';

interface GoalState {
  goals: Goal[];
  selectedGoal: Goal | null;
  loading: boolean;
  error: string | null;
}

const initialState: GoalState = {
  goals: [],
  selectedGoal: null,
  loading: false,
  error: null,
};

const goalSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    setGoals: (state, action: PayloadAction<Goal[]>) => {
      console.log('goalSlice: Setting goals:', action.payload);
      state.goals = action.payload;
      state.error = null;
    },
    setSelectedGoal: (state, action: PayloadAction<Goal>) => {
      console.log('goalSlice: Setting selected goal:', action.payload);
      state.selectedGoal = action.payload;
      state.error = null;
    },
    clearSelectedGoal: (state) => {
      console.log('goalSlice: Clearing selected goal');
      state.selectedGoal = null;
    },
    updateGoalStatus: (
      state,
      action: PayloadAction<{ id: string; status: Goal['status'] }>
    ) => {
      console.log('goalSlice: Updating goal status:', action.payload);
      const goal = state.goals.find((g) => g.id === action.payload.id);
      if (goal) {
        goal.status = action.payload.status;
      }
    },
    removeGoal: (state, action: PayloadAction<string>) => {
      console.log('goalSlice: Removing goal:', action.payload);
      state.goals = state.goals.filter((goal) => goal.id !== action.payload);
      if (state.selectedGoal?.id === action.payload) {
        state.selectedGoal = null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      console.log('goalSlice: Setting loading:', action.payload);
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      console.log('goalSlice: Setting error:', action.payload);
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setGoals,
  setSelectedGoal,
  clearSelectedGoal,
  updateGoalStatus,
  removeGoal,
  setLoading,
  setError,
} = goalSlice.actions;

export default goalSlice.reducer;

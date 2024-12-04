import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TimeBlock } from '../../types/timeblock';

interface TimeBlockState {
  blocks: TimeBlock[];
  selectedDate: string;
  loading: boolean;
  error: string | null;
}

const initialState: TimeBlockState = {
  blocks: [],
  selectedDate: new Date().toISOString().split('T')[0],
  loading: false,
  error: null
};

const timeBlockSlice = createSlice({
  name: 'timeBlocks',
  initialState,
  reducers: {
    setBlocks: (state, action: PayloadAction<TimeBlock[]>) => {
      state.blocks = action.payload;
      state.error = null;
    },
    addBlock: (state, action: PayloadAction<TimeBlock>) => {
      state.blocks.push(action.payload);
    },
    updateBlock: (state, action: PayloadAction<TimeBlock>) => {
      const index = state.blocks.findIndex(block => block.id === action.payload.id);
      if (index !== -1) {
        state.blocks[index] = action.payload;
      }
    },
    removeBlock: (state, action: PayloadAction<string>) => {
      state.blocks = state.blocks.filter(block => block.id !== action.payload);
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const {
  setBlocks,
  addBlock,
  updateBlock,
  removeBlock,
  setSelectedDate,
  setLoading,
  setError
} = timeBlockSlice.actions;

export default timeBlockSlice.reducer;
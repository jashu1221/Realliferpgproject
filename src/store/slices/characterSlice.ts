import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CharacterState {
  selectedCharacterIndex: number;
  loading: boolean;
  error: string | null;
}

const initialState: CharacterState = {
  selectedCharacterIndex: 0, // Default to first character
  loading: false,
  error: null,
};

const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    setSelectedCharacterIndex: (state, action: PayloadAction<number>) => {
      state.selectedCharacterIndex = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setSelectedCharacterIndex,
  setLoading,
  setError,
} = characterSlice.actions;

export default characterSlice.reducer;
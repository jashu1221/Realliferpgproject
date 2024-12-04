import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { MotivationState, MotivationMessage, MotivationSettings } from '../../types/motivation';

const initialState: MotivationState = {
  messages: [],
  settings: {
    character: 'Tyler Durden',
    style: 'intense',
    rudenessLevel: 8,
    flexibility: 3,
    systemInstructions: ''
  },
  loading: false,
  error: null
};

const motivationSlice = createSlice({
  name: 'motivation',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<MotivationMessage[]>) => {
      state.messages = action.payload.map(message => ({
        ...message,
        createdAt: typeof message.createdAt === 'string' 
          ? message.createdAt 
          : new Date().toISOString()
      }));
      state.error = null;
    },
    addMessage: (state, action: PayloadAction<MotivationMessage>) => {
      const message = {
        ...action.payload,
        createdAt: typeof action.payload.createdAt === 'string'
          ? action.payload.createdAt
          : new Date().toISOString()
      };
      state.messages.push(message);
    },
    updateSettings: (state, action: PayloadAction<Partial<MotivationSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.error = null;
    }
  }
});

export const {
  setMessages,
  addMessage,
  updateSettings,
  setLoading,
  setError,
  clearMessages
} = motivationSlice.actions;

export default motivationSlice.reducer;
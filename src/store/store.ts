import { configureStore } from '@reduxjs/toolkit';
import habitReducer from './slices/habitSlice';
import dailyReducer from './slices/dailySlice';
import todoReducer from './slices/todoSlice';
import profileReducer from './slices/profileSlice';
import motivationReducer from './slices/motivationSlice';
import characterReducer from './slices/characterSlice';
import timeBlockReducer from './slices/timeBlockSlice';
import coinsReducer from './slices/coinsSlice';

export const store = configureStore({
  reducer: {
    habits: habitReducer,
    dailies: dailyReducer,
    todos: todoReducer,
    profile: profileReducer,
    motivation: motivationReducer,
    character: characterReducer,
    timeBlocks: timeBlockReducer,
    coins: coinsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths in the state for serialization checks
        ignoredPaths: [
          'profile.profile.updatedAt',
          'motivation.messages',
          'character.character.updatedAt',
          'timeBlocks.blocks',
          'coins.userCoins.createdAt',
          'coins.userCoins.updatedAt',
          'coins.transactions',
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CoinTransaction, UserCoins } from '../../types/coins';

interface CoinsState {
  userCoins: UserCoins | null;
  transactions: CoinTransaction[];
  loading: boolean;
  error: string | null;
}

const initialState: CoinsState = {
  userCoins: null,
  transactions: [],
  loading: false,
  error: null
};

const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    setUserCoins: (state, action: PayloadAction<UserCoins>) => {
      state.userCoins = action.payload;
      state.error = null;
    },
    setTransactions: (state, action: PayloadAction<CoinTransaction[]>) => {
      state.transactions = action.payload;
      state.error = null;
    },
    addTransaction: (state, action: PayloadAction<CoinTransaction>) => {
      state.transactions.unshift(action.payload);
      if (state.userCoins) {
        state.userCoins.totalCoins += action.payload.amount;
      }
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
  setUserCoins,
  setTransactions,
  addTransaction,
  setLoading,
  setError
} = coinsSlice.actions;

export default coinsSlice.reducer;
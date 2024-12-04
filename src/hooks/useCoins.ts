import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { useAuth } from '../contexts/AuthContext';
import {
  getUserCoins,
  getCoinTransactions,
  addCoins,
} from '../lib/firebase/coins';
import {
  setUserCoins,
  setTransactions,
  setLoading,
  setError,
} from '../store/slices/coinsSlice';
import type { CoinTransaction } from '../types/coins';

export function useCoins() {
  const dispatch = useAppDispatch();
  const { currentUser } = useAuth();
  const { userCoins, transactions, loading, error } = useAppSelector(
    (state) => state.coins
  );

  const fetchUserCoins = useCallback(async () => {
    if (!currentUser) return;

    try {
      dispatch(setLoading(true));
      const coins = await getUserCoins(currentUser.uid);
      console.log(coins);
      if (coins) {
        dispatch(setUserCoins(coins));
      }
    } catch (error: any) {
      console.error('Error fetching user coins:', error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [currentUser, dispatch]);

  const fetchTransactions = useCallback(async () => {
    if (!currentUser) return;

    try {
      dispatch(setLoading(true));
      const history = await getCoinTransactions(currentUser.uid);
      dispatch(setTransactions(history));
    } catch (error: any) {
      console.error('Error fetching coin transactions:', error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [currentUser, dispatch]);

  const awardCoins = useCallback(
    async (
      type: CoinTransaction['type'],
      referenceId: string,
      difficulty: CoinTransaction['difficulty']
    ) => {
      if (!currentUser) return;

      try {
        dispatch(setLoading(true));
        await addCoins(currentUser.uid, type, referenceId, difficulty);
        await fetchUserCoins(); // Refresh coins after awarding
      } catch (error: any) {
        console.error('Error awarding coins:', error);
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [currentUser, dispatch, fetchUserCoins]
  );

  return {
    userCoins,
    transactions,
    loading,
    error,
    fetchUserCoins,
    fetchTransactions,
    awardCoins,
  };
}

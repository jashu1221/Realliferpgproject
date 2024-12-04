import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { useAuth } from '../contexts/AuthContext';
import {
  setDailies,
  setSelectedDaily,
  clearSelectedDaily,
  updateDailyStatus,
  setLoading,
  setError,
  deleteDailyAction,
} from '../store/slices/dailySlice';
import {
  createDaily as createDailyInDb,
  updateDaily as updateDailyInDb,
  completeDaily as completeDailyInDb,
  getUserDailies as getDailiesFromDb,
  snoozeDaily as snoozeDailyInDb,
  getDaily as getDailyFromDb,
  deleteDaily as deleteDailyInDb,
} from '../lib/firebase/dailies';
import type { Daily } from '../types/daily';

export function useDailies() {
  const dispatch = useAppDispatch();
  const { currentUser } = useAuth();
  const { dailies, selectedDaily, loading, error } = useAppSelector(
    (state) => state.dailies
  );

  // Fetch dailies when component mounts or user changes
  useEffect(() => {
    console.log('useDailies: Checking for user to fetch dailies');
    if (currentUser) {
      console.log('useDailies: User found, fetching dailies');
      fetchDailies();
    }
  }, [currentUser]);

  const fetchDailies = useCallback(async () => {
    if (!currentUser) {
      console.log('fetchDailies: No user found, skipping fetch');
      return;
    }

    try {
      dispatch(setLoading(true));
      console.log(
        'fetchDailies: Starting to fetch dailies for user',
        currentUser.uid
      );
      const fetchedDailies = await getDailiesFromDb(currentUser.uid);
      console.log(
        'fetchDailies: Successfully fetched dailies:',
        fetchedDailies
      );
      dispatch(setDailies(fetchedDailies));
    } catch (error: any) {
      console.error('fetchDailies: Error fetching dailies:', error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [currentUser, dispatch]);

  const getDaily = useCallback(
    async (dailyId: string) => {
      if (!currentUser) {
        console.log('getDaily: No user found, cannot fetch daily');
        return null;
      }

      try {
        dispatch(setLoading(true));
        const daily = await getDailyFromDb(currentUser.uid, dailyId);
        return daily;
      } catch (error: any) {
        console.error('getDaily: Error fetching daily:', error);
        dispatch(setError(error.message));
        return null;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [currentUser, dispatch]
  );

  const createDaily = useCallback(
    async (dailyData: Partial<Daily>) => {
      if (!currentUser) {
        console.log('createDaily: No user found, cannot create daily');
        return false;
      }

      try {
        dispatch(setLoading(true));
        console.log('createDaily: Starting to create daily:', dailyData);
        const newDaily = await createDailyInDb(currentUser.uid, dailyData);
        console.log('createDaily: Successfully created daily:', newDaily);
        await fetchDailies(); // Refresh dailies list
        return true;
      } catch (error: any) {
        console.error('createDaily: Error creating daily:', error);
        dispatch(setError(error.message));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [currentUser, dispatch, fetchDailies]
  );

  const updateDaily = useCallback(
    async (id: string, updates: Partial<Daily>) => {
      if (!currentUser) {
        console.log('updateDaily: No user found, cannot update daily');
        return false;
      }

      try {
        dispatch(setLoading(true));
        console.log('updateDaily: Starting to update daily:', id, updates);

        const updatedDaily = await updateDailyInDb(
          currentUser.uid,
          id,
          updates
        );
        console.log('updateDaily: Successfully updated daily:', updatedDaily);
        await fetchDailies(); // Refresh dailies list
        return true;
      } catch (error: any) {
        console.error('updateDaily: Error updating daily:', error);
        dispatch(setError(error.message));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [currentUser, dispatch, fetchDailies]
  );

  const completeDaily = useCallback(
    async (id: string) => {
      if (!currentUser) {
        console.log('completeDaily: No user found, cannot complete daily');
        return false;
      }

      try {
        dispatch(setLoading(true));
        console.log('completeDaily: Starting to complete daily:', id);
        const updatedDaily = await completeDailyInDb(currentUser.uid, id);
        dispatch(updateDailyStatus({ id, status: 'completed' }));
        console.log(
          'completeDaily: Successfully completed daily:',
          updatedDaily
        );
        await fetchDailies(); // Refresh dailies list
        return true;
      } catch (error: any) {
        console.error('completeDaily: Error completing daily:', error);
        dispatch(setError(error.message));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [currentUser, dispatch, fetchDailies]
  );

  const snoozeDaily = useCallback(
    async (id: string, snoozeUntil: string, snoozeReason?: string) => {
      if (!currentUser) {
        console.log('snoozeDaily: No user found, cannot snooze daily');
        return false;
      }

      try {
        dispatch(setLoading(true));
        console.log('snoozeDaily: Starting to snooze daily:', id);
        const updatedDaily = await snoozeDailyInDb(
          currentUser.uid,
          id,
          snoozeUntil,
          snoozeReason
        );
        dispatch(updateDailyStatus({ id, status: 'snoozed' }));
        console.log('snoozeDaily: Successfully snoozed daily:', updatedDaily);
        await fetchDailies(); // Refresh dailies list
        return true;
      } catch (error: any) {
        console.error('snoozeDaily: Error snoozing daily:', error);
        dispatch(setError(error.message));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [currentUser, dispatch, fetchDailies]
  );

  const selectDaily = useCallback(
    (daily: Daily) => {
      console.log('selectDaily: Selecting daily:', daily);
      dispatch(setSelectedDaily(daily));
    },
    [dispatch]
  );

  const clearDaily = useCallback(() => {
    console.log('clearDaily: Clearing selected daily');
    dispatch(clearSelectedDaily());
  }, [dispatch]);

  const deleteDaily = useCallback(
    async (id: string) => {
      if (!currentUser) {
        console.log('deleteDaily: No user found, cannot delete daily');
        return false;
      }

      try {
        dispatch(setLoading(true));
        console.log('deleteDaily: Starting to delete daily:', id);

        // Delete from Firebase
        await deleteDailyInDb(currentUser.uid, id);

        // Update Redux store
        dispatch(deleteDailyAction(id));

        console.log('deleteDaily: Successfully deleted daily:', id);
        return true;
      } catch (error: any) {
        console.error('deleteDaily: Error deleting daily:', error);
        dispatch(setError(error.message));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [currentUser, dispatch]
  );

  return {
    dailies,
    loading,
    error,
    selectedDaily,
    fetchDailies,
    getDaily,
    createDaily,
    updateDaily,
    completeDaily,
    snoozeDaily,
    selectDaily,
    clearDaily,
    deleteDaily,
  };
}

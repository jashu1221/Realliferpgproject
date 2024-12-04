import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { useAuth } from '../contexts/AuthContext';
import { 
  setGoals,
  setSelectedGoal,
  clearSelectedGoal,
  updateGoalStatus,
  setLoading,
  setError
} from '../store/slices/goalSlice';
import { 
  createGoal as createGoalInDb,
  updateGoal as updateGoalInDb,
  getUserGoals as getGoalsFromDb,
  getGoal as getGoalFromDb
} from '../lib/firebase/goals';
import type { Goal } from '../types/goal';

export function useGoals() {
  const dispatch = useAppDispatch();
  const { currentUser } = useAuth();
  const { goals, selectedGoal, loading, error } = useAppSelector((state) => state.goals);

  const fetchGoals = useCallback(async () => {
    if (!currentUser) {
      console.log('fetchGoals: No user found, skipping fetch');
      return;
    }
    
    try {
      dispatch(setLoading(true));
      console.log('fetchGoals: Starting to fetch goals for user', currentUser.uid);
      const fetchedGoals = await getGoalsFromDb(currentUser.uid);
      console.log('fetchGoals: Successfully fetched goals:', fetchedGoals);
      dispatch(setGoals(fetchedGoals));
    } catch (error: any) {
      console.error('fetchGoals: Error fetching goals:', error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [currentUser, dispatch]);

  // Fetch goals when component mounts or user changes
  useEffect(() => {
    let mounted = true;

    if (currentUser) {
      console.log('useGoals: User found, fetching goals');
      fetchGoals();
    }

    return () => {
      mounted = false;
    };
  }, [currentUser, fetchGoals]);

  const createGoal = useCallback(async (goalData: Partial<Goal>) => {
    if (!currentUser) {
      console.log('createGoal: No user found, cannot create goal');
      return false;
    }

    try {
      dispatch(setLoading(true));
      console.log('createGoal: Starting to create goal:', goalData);
      const newGoal = await createGoalInDb(currentUser.uid, goalData);
      console.log('createGoal: Successfully created goal:', newGoal);
      await fetchGoals(); // Refresh goals list
      return true;
    } catch (error: any) {
      console.error('createGoal: Error creating goal:', error);
      dispatch(setError(error.message));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [currentUser, dispatch, fetchGoals]);

  const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
    if (!currentUser) {
      console.log('updateGoal: No user found, cannot update goal');
      return false;
    }

    try {
      dispatch(setLoading(true));
      console.log('updateGoal: Starting to update goal:', id, updates);
      
      const updatedGoal = await updateGoalInDb(currentUser.uid, id, updates);
      console.log('updateGoal: Successfully updated goal:', updatedGoal);
      await fetchGoals(); // Refresh goals list
      return true;
    } catch (error: any) {
      console.error('updateGoal: Error updating goal:', error);
      dispatch(setError(error.message));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [currentUser, dispatch, fetchGoals]);

  return {
    goals,
    loading,
    error,
    selectedGoal,
    fetchGoals,
    createGoal,
    updateGoal,
  };
}
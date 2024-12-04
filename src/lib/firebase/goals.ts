import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Goal } from '../../types/goal';

// Helper function to convert Firestore timestamps
const convertTimestamps = (data: any) => {
  if (!data) return data;

  const result = { ...data };
  Object.entries(result).forEach(([key, value]) => {
    if (value instanceof Timestamp) {
      result[key] = value.toDate().toISOString();
    }
  });
  return result;
};

// Get user's goals collection reference
const getUserGoalsRef = (userId: string) =>
  collection(db, 'users', userId, 'goals');

// Default values for new goals
const defaultGoalValues = {
  priority: 'medium',
  status: 'active',
  progress: 0,
  linkedGoals: [],
  tags: [],
};

// Create a new goal
export const createGoal = async (userId: string, goalData: Partial<Goal>) => {
  try {
    console.log('Firebase createGoal: Starting to create goal:', goalData);
    const goalsRef = getUserGoalsRef(userId);

    const newGoal = {
      ...defaultGoalValues,
      ...goalData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(goalsRef, newGoal);
    console.log('Firebase createGoal: Successfully created goal');
    return { id: docRef.id, ...newGoal };
  } catch (error) {
    console.error('Firebase createGoal: Error creating goal:', error);
    throw error;
  }
};

// Get all goals for a user
export const getUserGoals = async (userId: string) => {
  try {
    console.log('Firebase getUserGoals: Fetching goals for user:', userId);
    const goalsRef = getUserGoalsRef(userId);
    const q = query(goalsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const goals = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...defaultGoalValues,
      ...convertTimestamps(doc.data()),
    }));
    console.log('Firebase getUserGoals: Successfully fetched goals:', goals);
    return goals;
  } catch (error) {
    console.error('Firebase getUserGoals: Error fetching goals:', error);
    throw error;
  }
};

// Get a single goal
export const getGoal = async (userId: string, goalId: string) => {
  try {
    console.log('Firebase getGoal: Fetching goal:', goalId);
    const goalRef = doc(db, 'users', userId, 'goals', goalId);
    const goalDoc = await getDoc(goalRef);

    if (!goalDoc.exists()) {
      throw new Error('Goal not found');
    }

    const goal = {
      id: goalDoc.id,
      ...defaultGoalValues,
      ...convertTimestamps(goalDoc.data()),
    };

    console.log('Firebase getGoal: Successfully fetched goal:', goal);
    return goal;
  } catch (error) {
    console.error('Firebase getGoal: Error fetching goal:', error);
    throw error;
  }
};

// Update a goal
export const updateGoal = async (
  userId: string,
  goalId: string,
  updates: Partial<Goal>
) => {
  try {
    console.log(
      'Firebase updateGoal: Starting to update goal:',
      goalId,
      updates
    );
    const goalRef = doc(db, 'users', userId, 'goals', goalId);

    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(goalRef, updateData);

    // Fetch the updated goal to return
    const updatedGoal = await getGoal(userId, goalId);
    console.log('Firebase updateGoal: Successfully updated goal:', updatedGoal);
    return updatedGoal;
  } catch (error) {
    console.error('Firebase updateGoal: Error updating goal:', error);
    throw error;
  }
};

// delete a goal
export const deleteGoal = async (userId: string, goalId: string) => {
  try {
    console.log('Firebase deleteGoal: Starting to delete goal:', goalId);
    const goalRef = doc(db, 'users', userId, 'goals', goalId);

    await deleteDoc(goalRef);
    console.log('Firebase deleteGoal: Successfully deleted goal:', goalId);
    return true;
  } catch (error) {
    console.error('Firebase deleteGoal: Error deleting goal:', error);
    throw error;
  }
};

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
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Habit } from '../../types';

// Helper function to convert Firestore timestamps to regular dates
const convertTimestamps = (data: any) => {
  if (!data) return data;

  const result = { ...data };
  Object.keys(result).forEach((key) => {
    if (result[key] instanceof Timestamp) {
      result[key] = result[key].toDate().toISOString();
    }
  });
  return result;
};

// Get user's habits collection reference
const getUserHabitsRef = (userId: string) =>
  collection(db, 'users', userId, 'habits');

// Default values for new habits
const defaultHabitValues = {
  type: 'habit',
  frequency: 'daily',
  priority: 'medium',
  difficulty: 'medium',
  maxHits: 4,
  status: 'active',
  currentStreak: 0,
  bestStreak: 0,
  totalHits: 0,
  currentHits: 0,
  tags: [],
  hitLevels: [
    { hits: 1, title: 'Show up', difficulty: 'Show Up' },
    { hits: 2, title: '30 minutes', difficulty: 'Easy' },
    { hits: 3, title: '1 hour', difficulty: 'Medium' },
    { hits: 4, title: '2 hours', difficulty: 'Hard' },
  ],
};

// Create a new habit
export const createHabit = async (
  userId: string,
  habitData: Partial<Habit>
) => {
  try {
    console.log('Firebase createHabit: Starting to create habit:', habitData);
    const habitsRef = getUserHabitsRef(userId);

    const newHabit = {
      ...defaultHabitValues,
      ...habitData,
      userId,
      currentHits: 0, // Always start with 0 hits
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(habitsRef, newHabit);
    console.log('Firebase createHabit: Successfully created habit');
    return { id: docRef.id, ...newHabit };
  } catch (error) {
    console.error('Firebase createHabit: Error creating habit:', error);
    throw error;
  }
};

// Get all habits for a user
export const getUserHabits = async (userId: string) => {
  try {
    console.log('Firebase getUserHabits: Fetching habits for user:', userId);
    const habitsRef = getUserHabitsRef(userId);
    const q = query(habitsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const habits = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...defaultHabitValues,
      ...convertTimestamps(doc.data()),
    }));
    console.log('Firebase getUserHabits: Successfully fetched habits:', habits);
    return habits;
  } catch (error) {
    console.error('Firebase getUserHabits: Error fetching habits:', error);
    throw error;
  }
};

// Get a single habit
export const getHabit = async (userId: string, habitId: string) => {
  try {
    console.log('Firebase getHabit: Fetching habit:', habitId);
    const habitRef = doc(db, 'users', userId, 'habits', habitId);
    const habitDoc = await getDoc(habitRef);

    if (!habitDoc.exists()) {
      throw new Error('Habit not found');
    }

    const habit = {
      id: habitDoc.id,
      ...defaultHabitValues,
      ...convertTimestamps(habitDoc.data()),
    };

    console.log('Firebase getHabit: Successfully fetched habit:', habit);
    return habit;
  } catch (error) {
    console.error('Firebase getHabit: Error fetching habit:', error);
    throw error;
  }
};

// Update a habit
export const updateHabit = async (
  userId: string,
  habitId: string,
  updates: Partial<Habit>
) => {
  try {
    console.log(
      'Firebase updateHabit: Starting to update habit:',
      habitId,
      updates
    );
    const habitRef = doc(db, 'users', userId, 'habits', habitId);

    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(habitRef, updateData);
    return await getHabit(userId, habitId);
  } catch (error) {
    console.error('Firebase updateHabit: Error updating habit:', error);
    throw error;
  }
};

// Increment hit level for a habit
export const incrementHitLevel = async (userId: string, habitId: string) => {
  try {
    console.log(
      'Firebase incrementHitLevel: Starting to increment hit level for habit:',
      habitId
    );
    const habitRef = doc(db, 'users', userId, 'habits', habitId);
    const habitDoc = await getDoc(habitRef);

    if (!habitDoc.exists()) {
      throw new Error('Habit not found');
    }

    const habitData = habitDoc.data() as Habit;
    const currentHits = habitData.currentHits || 0;

    // Check if we can increment
    if (currentHits >= (habitData.maxHits || 4)) {
      throw new Error('Already at maximum hit level');
    }

    const batch = writeBatch(db);

    // Update habit with new hit level
    batch.update(habitRef, {
      currentHits: currentHits + 1,
      totalHits: (habitData.totalHits || 0) + 1,
      lastCompleted: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Add hit level record
    const completionRef = doc(
      collection(db, 'users', userId, 'habits', habitId, 'completions')
    );
    batch.set(completionRef, {
      habitId,
      hitLevel: currentHits + 1,
      action: 'increment',
      completedAt: serverTimestamp(),
    });

    await batch.commit();
    console.log(
      'Firebase incrementHitLevel: Successfully incremented hit level'
    );

    return await getHabit(userId, habitId);
  } catch (error) {
    console.error(
      'Firebase incrementHitLevel: Error incrementing hit level:',
      error
    );
    throw error;
  }
};

// Decrement hit level for a habit
export const decrementHitLevel = async (userId: string, habitId: string) => {
  try {
    console.log(
      'Firebase decrementHitLevel: Starting to decrement hit level for habit:',
      habitId
    );
    const habitRef = doc(db, 'users', userId, 'habits', habitId);
    const habitDoc = await getDoc(habitRef);

    if (!habitDoc.exists()) {
      throw new Error('Habit not found');
    }

    const habitData = habitDoc.data() as Habit;
    const currentHits = habitData.currentHits || 0;

    // Check if we can decrement
    if (currentHits <= 0) {
      throw new Error('Already at minimum hit level');
    }

    const batch = writeBatch(db);

    // Update habit with new hit level
    batch.update(habitRef, {
      currentHits: currentHits - 1,
      totalHits: Math.max((habitData.totalHits || 0) - 1, 0), // Ensure totalHits doesn't go below 0
      updatedAt: serverTimestamp(),
    });

    // Add decrement record
    const completionRef = doc(
      collection(db, 'users', userId, 'habits', habitId, 'completions')
    );
    batch.set(completionRef, {
      habitId,
      hitLevel: currentHits - 1,
      action: 'decrement',
      completedAt: serverTimestamp(),
    });

    await batch.commit();
    console.log(
      'Firebase decrementHitLevel: Successfully decremented hit level'
    );

    return await getHabit(userId, habitId);
  } catch (error) {
    console.error(
      'Firebase decrementHitLevel: Error decrementing hit level:',
      error
    );
    throw error;
  }
};

// Snooze a habit
export const snoozeHabit = async (
  userId: string,
  habitId: string,
  snoozeUntil: string,
  snoozeReason?: string
) => {
  try {
    console.log('Firebase snoozeHabit: Starting to snooze habit:', habitId);
    const habitRef = doc(db, 'users', userId, 'habits', habitId);

    await updateDoc(habitRef, {
      status: 'snoozed',
      snoozeUntil,
      snoozeReason: snoozeReason || null,
      updatedAt: serverTimestamp(),
    });

    console.log('Firebase snoozeHabit: Successfully snoozed habit');
    return await getHabit(userId, habitId);
  } catch (error) {
    console.error('Firebase snoozeHabit: Error snoozing habit:', error);
    throw error;
  }
};

// Delete a habit and all its associated data
export const deleteHabit = async (userId: string, habitId: string) => {
  try {
    console.log('Firebase deleteHabit: Starting to delete habit:', habitId);
    const batch = writeBatch(db);

    // Get references
    const habitRef = doc(db, 'users', userId, 'habits', habitId);
    const completionsRef = collection(
      db,
      'users',
      userId,
      'habits',
      habitId,
      'completions'
    );

    // Delete all completion records
    const completionsSnapshot = await getDocs(completionsRef);
    completionsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete the habit document itself
    batch.delete(habitRef);

    await batch.commit();
    console.log(
      'Firebase deleteHabit: Successfully deleted habit and all associated data'
    );
    return { success: true, habitId };
  } catch (error) {
    console.error('Firebase deleteHabit: Error deleting habit:', error);
    throw error;
  }
};

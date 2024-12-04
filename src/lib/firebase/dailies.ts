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
import type { Daily } from '../../types/daily';

// Helper function to convert Firestore timestamps
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

// Get user's dailies collection reference
const getUserDailiesRef = (userId: string) =>
  collection(db, 'users', userId, 'dailies');

// Default values for new dailies
const defaultDailyValues = {
  priority: 'medium',
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  tags: [],
  status: 'active',
  checklist: [],
};

// Create a new daily
export const createDaily = async (
  userId: string,
  dailyData: Partial<Daily>
) => {
  try {
    console.log('Firebase createDaily: Starting to create daily:', dailyData);
    const dailiesRef = getUserDailiesRef(userId);

    const newDaily = {
      ...defaultDailyValues,
      ...dailyData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(dailiesRef, newDaily);
    console.log('Firebase createDaily: Successfully created daily');
    return { id: docRef.id, ...newDaily };
  } catch (error) {
    console.error('Firebase createDaily: Error creating daily:', error);
    throw error;
  }
};

// Get all dailies for a user
export const getUserDailies = async (userId: string) => {
  try {
    console.log('Firebase getUserDailies: Fetching dailies for user:', userId);
    const dailiesRef = getUserDailiesRef(userId);
    const q = query(dailiesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const dailies = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...defaultDailyValues,
      ...convertTimestamps(doc.data()),
    }));
    console.log(
      'Firebase getUserDailies: Successfully fetched dailies:',
      dailies
    );
    return dailies;
  } catch (error) {
    console.error('Firebase getUserDailies: Error fetching dailies:', error);
    throw error;
  }
};

// Get a single daily
export const getDaily = async (userId: string, dailyId: string) => {
  try {
    console.log('Firebase getDaily: Fetching daily:', dailyId);
    const dailyRef = doc(db, 'users', userId, 'dailies', dailyId);
    const dailyDoc = await getDoc(dailyRef);

    if (!dailyDoc.exists()) {
      throw new Error('Daily not found');
    }

    const daily = {
      id: dailyDoc.id,
      ...defaultDailyValues,
      ...convertTimestamps(dailyDoc.data()),
    };

    console.log('Firebase getDaily: Successfully fetched daily:', daily);
    return daily;
  } catch (error) {
    console.error('Firebase getDaily: Error fetching daily:', error);
    throw error;
  }
};

// Update a daily
export const updateDaily = async (
  userId: string,
  dailyId: string,
  updates: Partial<Daily>
) => {
  try {
    console.log(
      'Firebase updateDaily: Starting to update daily:',
      dailyId,
      updates
    );
    const dailyRef = doc(db, 'users', userId, 'dailies', dailyId);

    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    console.log('Firebase updateDaily: Prepared update data:', updateData);
    await updateDoc(dailyRef, updateData);

    // Fetch the updated daily to return
    const updatedDaily = await getDaily(userId, dailyId);
    console.log(
      'Firebase updateDaily: Successfully updated daily:',
      updatedDaily
    );
    return updatedDaily;
  } catch (error) {
    console.error('Firebase updateDaily: Error updating daily:', error);
    throw error;
  }
};

// Complete a daily
export const completeDaily = async (userId: string, dailyId: string) => {
  try {
    console.log('Firebase completeDaily: Starting to complete daily:', dailyId);
    const batch = writeBatch(db);

    // Get daily reference
    const dailyRef = doc(db, 'users', userId, 'dailies', dailyId);
    const dailyDoc = await getDoc(dailyRef);

    if (!dailyDoc.exists()) {
      throw new Error('Daily not found');
    }

    // Add completion record
    const completionRef = doc(
      collection(db, 'users', userId, 'dailies', dailyId, 'completions')
    );
    batch.set(completionRef, {
      dailyId,
      completedAt: serverTimestamp(),
    });

    // Update daily status
    batch.update(dailyRef, {
      status: 'completed',
      lastCompleted: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await batch.commit();
    console.log('Firebase completeDaily: Successfully completed daily');

    // Return updated daily
    return await getDaily(userId, dailyId);
  } catch (error) {
    console.error('Firebase completeDaily: Error completing daily:', error);
    throw error;
  }
};

// Snooze a daily
export const snoozeDaily = async (
  userId: string,
  dailyId: string,
  snoozeUntil: string,
  snoozeReason?: string
) => {
  try {
    console.log('Firebase snoozeDaily: Starting to snooze daily:', dailyId);
    const dailyRef = doc(db, 'users', userId, 'dailies', dailyId);

    await updateDoc(dailyRef, {
      status: 'snoozed',
      snoozeUntil,
      snoozeReason: snoozeReason || null,
      updatedAt: serverTimestamp(),
    });

    console.log('Firebase snoozeDaily: Successfully snoozed daily');
    return await getDaily(userId, dailyId);
  } catch (error) {
    console.error('Firebase snoozeDaily: Error snoozing daily:', error);
    throw error;
  }
};

export const deleteDaily = async (userId: string, dailyId: string) => {
  try {
    console.log('Firebase deleteDaily: Starting to delete daily:', dailyId);
    const batch = writeBatch(db);

    // Get references
    const dailyRef = doc(db, 'users', userId, 'dailies', dailyId);
    const completionsRef = collection(
      db,
      'users',
      userId,
      'dailies',
      dailyId,
      'completions'
    );

    // Delete all completion records first
    const completionsSnapshot = await getDocs(completionsRef);
    completionsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete the daily document itself
    batch.delete(dailyRef);

    // Commit all deletions in a batch
    await batch.commit();

    console.log(
      'Firebase deleteDaily: Successfully deleted daily and all associated data'
    );
    return { success: true, dailyId };
  } catch (error) {
    console.error('Firebase deleteDaily: Error deleting daily:', error);
    throw error;
  }
};

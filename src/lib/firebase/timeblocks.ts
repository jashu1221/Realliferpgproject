import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { sanitizeFirestoreData } from '../utils/firestore';
import type { TimeBlock, TimeBlockFormData } from '../../types/timeblock';

const getUserTimeBlocksRef = (userId: string) => 
  collection(db, 'users', userId, 'timeblocks');

export const createTimeBlock = async (userId: string, blockData: TimeBlockFormData) => {
  try {
    const timeBlocksRef = getUserTimeBlocksRef(userId);
    
    // Validate and format the data
    const newBlock = {
      ...blockData,
      userId,
      duration: calculateDuration(blockData.startTime, blockData.endTime),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Sanitize data before sending to Firestore
    const sanitizedData = sanitizeFirestoreData(newBlock);
    const docRef = await addDoc(timeBlocksRef, sanitizedData);
    
    return { 
      id: docRef.id,
      ...blockData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating time block:', error);
    throw error;
  }
};

export const getTimeBlocks = async (userId: string, date: string) => {
  try {
    const timeBlocksRef = getUserTimeBlocksRef(userId);
    const q = query(
      timeBlocksRef,
      where('date', '==', date),
      orderBy('startTime', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
    })) as TimeBlock[];
  } catch (error) {
    console.error('Error fetching time blocks:', error);
    throw error;
  }
};

export const updateTimeBlock = async (
  userId: string, 
  blockId: string, 
  updates: Partial<TimeBlock>
) => {
  try {
    const blockRef = doc(db, 'users', userId, 'timeblocks', blockId);
    
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };

    if (updates.startTime && updates.endTime) {
      updateData.duration = calculateDuration(updates.startTime, updates.endTime);
    }

    // Sanitize data before updating
    const sanitizedData = sanitizeFirestoreData(updateData);
    await updateDoc(blockRef, sanitizedData);

    return { 
      id: blockId,
      ...updates,
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error updating time block:', error);
    throw error;
  }
};

export const deleteTimeBlock = async (userId: string, blockId: string) => {
  try {
    const blockRef = doc(db, 'users', userId, 'timeblocks', blockId);
    await deleteDoc(blockRef);
  } catch (error) {
    console.error('Error deleting time block:', error);
    throw error;
  }
};

// Helper function to calculate duration in minutes
function calculateDuration(startTime: string, endTime: string): number {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  
  return endMinutes - startMinutes;
}
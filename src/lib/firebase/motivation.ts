import { 
  collection, 
  doc, 
  addDoc,
  updateDoc,
  getDoc,
  getDocs, 
  query, 
  orderBy, 
  limit as firestoreLimit,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import type { MotivationMessage, MotivationSettings } from '../../types/motivation';

// Helper function to convert Firestore timestamp to ISO string
const convertTimestamp = (timestamp: Timestamp | null): string => {
  if (!timestamp) return new Date().toISOString();
  return timestamp.toDate().toISOString();
};

// Get user's motivation messages collection reference
const getUserMotivationRef = (userId: string) => 
  collection(db, 'users', userId, 'motivation_messages');

export async function saveMotivationMessage(
  userId: string, 
  message: Omit<MotivationMessage, 'id' | 'createdAt'>
) {
  try {
    const motivationRef = getUserMotivationRef(userId);
    
    const newMessage = {
      ...message,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(motivationRef, newMessage);
    return { 
      id: docRef.id, 
      ...message,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error saving motivation message:', error);
    throw error;
  }
}

export async function getRecentMessages(userId: string, messageLimit = 50) {
  try {
    const motivationRef = getUserMotivationRef(userId);
    const q = query(
      motivationRef,
      orderBy('createdAt', 'desc'),
      firestoreLimit(messageLimit)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt as Timestamp)
      } as MotivationMessage;
    });
  } catch (error) {
    console.error('Error fetching motivation messages:', error);
    throw error;
  }
}

export async function getMotivationSettings(userId: string) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const data = userDoc.data();
    return data.motivationSettings as MotivationSettings;
  } catch (error) {
    console.error('Error fetching motivation settings:', error);
    throw error;
  }
}

export async function updateMotivationSettings(
  userId: string,
  settings: Partial<MotivationSettings>
) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'motivationSettings': settings,
      'updatedAt': serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating motivation settings:', error);
    throw error;
  }
}
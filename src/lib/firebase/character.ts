import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../../types';

// Get user document reference
const getUserRef = (userId: string) => doc(db, 'users', userId);

// Get user profile
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    console.log('Firebase getUserProfile: Fetching profile for user:', userId);
    const userRef = getUserRef(userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.log('Firebase getUserProfile: User profile not found');
      return null;
    }

    const userData = userDoc.data() as UserProfile;
    console.log('Firebase getUserProfile: Successfully fetched profile:', userData);
    return userData;
  } catch (error) {
    console.error('Firebase getUserProfile: Error fetching user profile:', error);
    throw error;
  }
};

// Update character index
export const updateCharacterIndex = async (userId: string, newIndex: number) => {
  try {
    console.log('Firebase updateCharacterIndex: Starting to update character index:', userId, newIndex);
    const userRef = getUserRef(userId);

    const updateData = {
      characterIndex: newIndex,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(userRef, updateData);
    console.log('Firebase updateCharacterIndex: Successfully updated character index');

    // Fetch and return the updated profile
    return await getUserProfile(userId);
  } catch (error) {
    console.error('Firebase updateCharacterIndex: Error updating character index:', error);
    throw error;
  }
};
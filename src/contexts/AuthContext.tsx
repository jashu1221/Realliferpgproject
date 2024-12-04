import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { convertFirestoreData } from '../lib/firebase/utils';
import type { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateUserPassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const createUserProfile = async (
    user: User,
    additionalData?: Partial<UserProfile>
  ) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const newProfile: UserProfile = {
        id: user.uid,
        name: user.displayName || additionalData?.name || '',
        email: user.email || '',
        level: 1,
        experience: 0,
        rank: 'E',
        characterIndex: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        settings: {
          notifications: true,
          dailyCheckins: true,
          intenseMode: false,
          motivationStyle: 'balanced',
          rudenessLevel: 5,
          flexibility: 5,
          theme: 'dark',
          soundEffects: true,
          showStreak: true,
        },
        motivationSettings: {
          character: 'Tyler Durden',
          style: 'intense',
          rudenessLevel: 8,
          flexibility: 3,
          systemInstructions: '',
        },
      };

      await setDoc(userRef, newProfile);
      return newProfile;
    }

    return convertFirestoreData(userSnap.data() as UserProfile);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const profile = await createUserProfile(user);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(user, { displayName: name });
    await createUserProfile(user, { name });
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const { user } = await signInWithPopup(auth, googleProvider);
    await createUserProfile(user);
  };

  const signOut = () => firebaseSignOut(auth);

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) throw new Error('No user logged in');

    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });

    if (data.name) {
      await updateProfile(currentUser, { displayName: data.name });
    }

    const updatedDoc = await getDoc(userRef);
    const updatedProfile = convertFirestoreData(
      updatedDoc.data() as UserProfile
    );
    setUserProfile(updatedProfile);
  };

  const updateUserPassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    if (!currentUser || !currentUser.email)
      throw new Error('No user logged in');

    const credential = EmailAuthProvider.credential(
      currentUser.email,
      currentPassword
    );

    await reauthenticateWithCredential(currentUser, credential);
    await updatePassword(currentUser, newPassword);
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    signUp,
    login,
    loginWithGoogle,
    signOut,
    updateUserProfile,
    updateUserPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

import {
  collection,
  doc,
  getDoc,
  setDoc,
  increment,
  serverTimestamp,
  runTransaction,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  CoinTransaction,
  UserCoins,
  COIN_REWARDS,
  COINS_PER_LEVEL,
} from '../../types/coins';

// Helper function to convert Firestore timestamps to ISO strings
const convertTimestamps = (data: any) => {
  const result = { ...data };
  Object.entries(result).forEach(([key, value]) => {
    if (value instanceof Timestamp) {
      result[key] = value.toDate().toISOString();
    }
  });
  return result;
};

// Get user's coins collection reference
const getUserCoinsRef = (userId: string) =>
  doc(db, 'users', userId, 'stats', 'coins');

// Get user's coin transactions collection reference
const getUserTransactionsRef = (userId: string) =>
  collection(db, 'users', userId, 'coinTransactions');

// Initialize user coins document
export async function initializeUserCoins(userId: string): Promise<UserCoins> {
  const coinsRef = getUserCoinsRef(userId);
  const now = new Date().toISOString();

  const initialData: Omit<UserCoins, 'id'> = {
    userId,
    totalCoins: 0,
    level: 1,
    coinsToNextLevel: COINS_PER_LEVEL,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(coinsRef, {
    ...initialData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { ...initialData, id: coinsRef.id };
}

// Get user's coin stats
export async function getUserCoins(userId: string): Promise<UserCoins | null> {
  try {
    const coinsRef = getUserCoinsRef(userId);
    const coinsDoc = await getDoc(coinsRef);

    if (!coinsDoc.exists()) {
      return await initializeUserCoins(userId);
    }

    const data = convertTimestamps(coinsDoc.data());
    return { id: coinsDoc.id, ...data } as UserCoins;
  } catch (error) {
    console.error('Error getting user coins:', error);
    throw error;
  }
}

// Add coins for completing a task
export async function addCoins(
  userId: string,
  type: CoinTransaction['type'],
  referenceId: string,
  difficulty: CoinTransaction['difficulty']
): Promise<void> {
  try {
    const amount =
      COIN_REWARDS[type][
        difficulty === 'low'
          ? 'easy'
          : difficulty === 'high'
          ? 'hard'
          : difficulty
      ];
    await runTransaction(db, async (transaction) => {
      const coinsRef = getUserCoinsRef(userId);
      const coinsDoc = await transaction.get(coinsRef);

      if (!coinsDoc.exists()) {
        await initializeUserCoins(userId);
        return;
      }

      const currentCoins = coinsDoc.data().totalCoins + amount;
      const currentLevel = coinsDoc.data().level;
      const newLevel = Math.floor(currentCoins / COINS_PER_LEVEL) + 1;
      const coinsToNextLevel =
        COINS_PER_LEVEL - (currentCoins % COINS_PER_LEVEL);

      // Update user's coin stats
      transaction.update(coinsRef, {
        totalCoins: increment(amount),
        level: newLevel,
        coinsToNextLevel,
        updatedAt: serverTimestamp(),
      });

      // Record the transaction
      const transactionRef = doc(
        collection(db, 'users', userId, 'coinTransactions')
      );
      transaction.set(transactionRef, {
        userId,
        amount,
        type,
        referenceId,
        difficulty,
        createdAt: serverTimestamp(),
      });

      // If level increased, update user profile
      if (newLevel > currentLevel) {
        const userRef = doc(db, 'users', userId);
        transaction.update(userRef, {
          level: newLevel,
          updatedAt: serverTimestamp(),
        });
      }
    });
  } catch (error) {
    console.error('Error adding coins:', error);
    throw error;
  }
}

// Get coin transaction history
export async function getCoinTransactions(
  userId: string
): Promise<CoinTransaction[]> {
  try {
    const transactionsRef = getUserTransactionsRef(userId);
    const snapshot = await getDocs(transactionsRef);

    return snapshot.docs.map((doc) => {
      const data = convertTimestamps(doc.data());
      return {
        id: doc.id,
        ...data,
      } as CoinTransaction;
    });
  } catch (error) {
    console.error('Error getting coin transactions:', error);
    throw error;
  }
}

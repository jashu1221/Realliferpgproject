export interface CoinTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'habit' | 'daily' | 'todo';
  referenceId: string; // ID of the habit/daily/todo
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
}

export interface UserCoins {
  id: string;
  userId: string;
  totalCoins: number;
  level: number;
  coinsToNextLevel: number;
  createdAt: string;
  updatedAt: string;
}

export const COIN_REWARDS = {
  habit: {
    easy: 5,
    medium: 10,
    hard: 15,
  },
  daily: {
    easy: 20, // maps to easy
    medium: 30,
    hard: 40, // maps to hard
  },
  todo: {
    easy: 10,
    medium: 15,
    hard: 20,
  },
} as const;

export const COINS_PER_LEVEL = 1000;

// types.ts
export interface HitLevel {
  hits: number;
  title: string;
  difficulty: string;
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  type: 'habit';
  frequency: 'daily' | 'weekly' | 'custom';
  priority: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  maxHits: number;
  currentHits: number;
  totalHits: number;
  status: 'active' | 'snoozed' | 'archived';
  currentStreak: number;
  bestStreak: number;
  tags: string[];
  hitLevels: HitLevel[];
  snoozeUntil?: string;
  snoozeReason?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface Daily {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  days: string[];
  duration?: string;
  tags: string[];
  note?: string;
  checklist?: { id: string; text: string; completed: boolean; }[];
  status: 'active' | 'snoozed' | 'completed';
  snoozeUntil?: string;
  snoozeReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyStats {
  totalCompletions: number;
  currentStreak: number;
  bestStreak: number;
  completionRate: number;
  lastCompleted?: string;
}
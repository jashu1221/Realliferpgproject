export interface Quest {
  id: string;
  title: string;
  description: string;
  experience: number;
  difficulty: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  completed: boolean;
  isNew?: boolean;
  deadline: string;
}

export interface Habit {
  id: string;
  title: string;
  streak: number;
  completed: boolean;
  type: 'daily' | 'weekly';
  impact: 'mental' | 'physical' | 'skill';
}

export interface TimeBlock {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: string;
}

export interface UserStats {
  level: number;
  experience: number;
  requiredExperience: number;
  rank: string;
  achievements: number;
  streak: number;
  ranking: number;
  totalPlayers: number;
}

export interface UserSettings {
  notifications: boolean;
  dailyCheckins: boolean;
  intenseMode: boolean;
  motivationStyle: string;
  rudenessLevel: number;
  flexibility: number;
  theme: string;
  soundEffects: boolean;
  showStreak: boolean;
}

export interface MotivationSettings {
  character: string;
  style: string;
  rudenessLevel: number;
  flexibility: number;
  systemInstructions: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  level: number;
  experience: number;
  rank: string;
  characterIndex: number;
  createdAt: string;
  updatedAt: string;
  settings: UserSettings;
  motivationSettings: MotivationSettings;
}

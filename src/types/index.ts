export interface UserProfile {
  id: string;
  name: string;
  email: string;
  level: number;
  experience: number;
  rank: string;
  createdAt: string;
  updatedAt: string;
  avatar_url?: string;
  character_type?: string;
  alter_ego?: string;
  settings?: {
    notifications: boolean;
    dailyCheckins: boolean;
    intenseMode: boolean;
    motivationStyle: string;
    rudenessLevel: number;
    flexibility: number;
    theme: string;
    soundEffects: boolean;
    showStreak: boolean;
  };
}

export * from './auth';
export * from './habit';
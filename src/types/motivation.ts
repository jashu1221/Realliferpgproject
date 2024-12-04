export interface MotivationMessage {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  category?: 'insight' | 'recommendation';
  createdAt: string;
  context?: {
    goals?: string[];
    achievements?: string[];
    currentStreak?: number;
  };
}

export interface MotivationSettings {
  character: string;
  style: 'intense' | 'balanced' | 'supportive';
  rudenessLevel: number;
  flexibility: number;
  systemInstructions?: string;
}

export interface MotivationState {
  messages: MotivationMessage[];
  settings: MotivationSettings;
  loading: boolean;
  error: string | null;
}
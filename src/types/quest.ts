export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: 'S' | 'A' | 'B' | 'C' | 'D' | 'E';
  xp: number;
  daysLeft: number;
  type: 'daily' | 'habit';
  status: 'active' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}
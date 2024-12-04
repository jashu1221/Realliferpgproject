export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  timeframe?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  progress: number;
  linkedGoals: LinkedGoal[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LinkedGoal {
  id: string;
  title: string;
  progress: number;
  type: 'milestone' | 'subgoal';
  status: 'active' | 'completed' | 'paused';
}

export interface GoalStats {
  totalGoals: number;
  completedGoals: number;
  activeGoals: number;
  completionRate: number;
}
export interface Todo {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  timeEstimate?: string;
  tags: string[];
  checklist?: { id: string; text: string; completed: boolean; }[];
  status: 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface TodoStats {
  totalTodos: number;
  completedTodos: number;
  activeTodos: number;
  completionRate: number;
}
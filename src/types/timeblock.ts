export interface TimeBlock {
  id: string;
  userId: string;
  title: string;
  date: string;
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
  duration: number; // Duration in minutes
  type: 'habit' | 'daily' | 'todo' | 'custom';
  referenceId?: string; // ID of the linked habit/daily/todo
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeBlockFormData {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: TimeBlock['type'];
  referenceId?: string;
  color?: string;
}

export interface TimeRange {
  startTime: string;
  endTime: string;
}
export interface TimeBlock {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: 'habit' | 'daily' | 'todo' | 'custom';
  duration: number;
}

export interface TimeOption {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
}
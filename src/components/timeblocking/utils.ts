import { TimeOption } from './types';

export function formatTime(time: string | TimeOption): string {
  if (typeof time === 'string') {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour = hours % 12 || 12;
    return `${hour}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
  
  return `${time.hour}:${time.minute.toString().padStart(2, '0')} ${time.period}`;
}

export function to24Hour(time: TimeOption): number {
  let hour = time.hour;
  if (time.period === 'PM' && hour !== 12) hour += 12;
  if (time.period === 'AM' && hour === 12) hour = 0;
  return hour;
}

export function calculateDuration(start: TimeOption, end: TimeOption): number {
  const startMinutes = to24Hour(start) * 60 + start.minute;
  const endMinutes = to24Hour(end) * 60 + end.minute;
  return endMinutes - startMinutes;
}

export function validateTimeBlock(
  startTime: TimeOption,
  endTime: TimeOption,
  existingBlocks: { startTime: string; endTime: string; }[]
): { isValid: boolean; error?: string } {
  const start = to24Hour(startTime) * 60 + startTime.minute;
  const end = to24Hour(endTime) * 60 + endTime.minute;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (end <= start) {
    return { isValid: false, error: 'End time must be after start time' };
  }

  if (start < currentMinutes) {
    return { isValid: false, error: 'Cannot create time blocks in the past' };
  }

  // Check for overlapping blocks
  const overlapping = existingBlocks.some(block => {
    const blockStart = parseInt(block.startTime) * 60;
    const blockEnd = parseInt(block.endTime) * 60;
    return (start < blockEnd && end > blockStart);
  });

  if (overlapping) {
    return { isValid: false, error: 'Time block overlaps with existing block' };
  }

  return { isValid: true };
}
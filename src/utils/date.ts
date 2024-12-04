import { format, formatDistance, formatRelative, isToday, isYesterday } from 'date-fns';

export const formatDate = (date: string | Date) => {
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d, yyyy');
};

export const formatTime = (date: string | Date) => {
  return format(new Date(date), 'h:mm a');
};

export const formatDateTime = (date: string | Date) => {
  return format(new Date(date), 'MMM d, yyyy h:mm a');
};

export const formatRelativeTime = (date: string | Date) => {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
};

export const formatRelativeDate = (date: string | Date) => {
  return formatRelative(new Date(date), new Date());
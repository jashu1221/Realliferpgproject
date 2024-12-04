import { Timestamp } from 'firebase/firestore';

export function convertTimestampToString(timestamp: Timestamp | null | undefined): string {
  if (!timestamp) return new Date().toISOString();
  return timestamp.toDate().toISOString();
}

export function convertFirestoreData<T extends Record<string, any>>(data: T): T {
  const converted = { ...data };
  
  Object.entries(converted).forEach(([key, value]) => {
    if (value instanceof Timestamp) {
      converted[key] = convertTimestampToString(value);
    } else if (value && typeof value === 'object') {
      converted[key] = convertFirestoreData(value);
    }
  });

  return converted;
}
import { Timestamp } from 'firebase/firestore';

type FirestoreData = Record<string, any>;

export function sanitizeFirestoreData(data: FirestoreData): FirestoreData {
  const sanitized: FirestoreData = {};

  for (const [key, value] of Object.entries(data)) {
    // Skip undefined values
    if (value === undefined) continue;

    // Convert Date objects to Firestore Timestamps
    if (value instanceof Date) {
      sanitized[key] = Timestamp.fromDate(value);
    }
    // Handle nested objects
    else if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeFirestoreData(value);
    }
    // Handle arrays
    else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        item && typeof item === 'object' 
          ? sanitizeFirestoreData(item)
          : item
      );
    }
    // Handle null values
    else if (value === null) {
      sanitized[key] = null;
    }
    // Handle all other values
    else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export function convertTimestamps<T extends Record<string, any>>(data: T): T {
  const converted = { ...data };
  
  Object.entries(converted).forEach(([key, value]) => {
    if (value instanceof Timestamp) {
      converted[key] = value.toDate().toISOString();
    } else if (value && typeof value === 'object') {
      converted[key] = convertTimestamps(value);
    }
  });

  return converted;
}
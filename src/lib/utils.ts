import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFirestoreTime(timestamp: any): number {
  if (!timestamp) return Date.now();
  if (typeof timestamp === 'number') return timestamp;
  if ('toMillis' in timestamp) return timestamp.toMillis();
  if ('seconds' in timestamp) return timestamp.seconds * 1000;
  return Date.now();
}

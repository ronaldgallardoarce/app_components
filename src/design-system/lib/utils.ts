import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Joins class names and resolves Tailwind conflicts (last class wins). From RNR's Uniwind template. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

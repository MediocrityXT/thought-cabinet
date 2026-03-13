import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(value?: string) {
  if (!value) {
    return 'just now';
  }

  const date = new Date(value);
  const diffMinutes = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));

  if (diffMinutes < 1) {
    return 'just now';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }
  if (diffMinutes < 1440) {
    return `${Math.round(diffMinutes / 60)}h ago`;
  }
  return `${Math.round(diffMinutes / 1440)}d ago`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

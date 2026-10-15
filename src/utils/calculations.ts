import { ExerciseSet } from '../types/workout';

/**
 * Calculates estimated One-Rep Max (1RM) using Epley formula:
 * 1RM = weight * (1 + reps / 30)
 */
export function calculate1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

/**
 * Calculates total volume in kg for a group of completed sets
 */
export function calculateVolume(sets: ExerciseSet[]): number {
  return sets
    .filter((s) => s.isCompleted)
    .reduce((total, s) => total + (s.weight || 0) * (s.reps || 0), 0);
}

/**
 * Formats seconds into mm:ss or hh:mm:ss
 */
export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins.toString().padStart(2, '0')}m`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format ISO date string into Polish date format (e.g., "15 października 2026, 10:30")
 */
export function formatWorkoutDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

/**
 * Format relative date (e.g. "Dzisiaj", "Wczoraj", "3 dni temu")
 */
export function formatRelativeDate(isoString: string): string {
  try {
    const now = new Date();
    const date = new Date(isoString);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Dzisiaj, ${date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (diffDays === 1) {
      return `Wczoraj, ${date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (diffDays < 7) {
      return `${diffDays} dni temu`;
    }
    return date.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

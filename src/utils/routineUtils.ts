import { WorkoutRoutine, Exercise } from '../types/workout';
import { getExercises } from '../db/storage';

/**
 * Returns a bullet-separated string of exercise names for a given routine.
 */
export function getRoutineExerciseNames(
  routine: WorkoutRoutine,
  exercises?: Exercise[]
): string {
  const allExercises = exercises ?? getExercises();
  const names = routine.exerciseIds
    .map((id) => allExercises.find((e) => e.id === id)?.name)
    .filter((n): n is string => Boolean(n));

  return names.length > 0 ? names.join(' • ') : 'No exercises configured';
}

/**
 * Calculates the total planned sets for a routine.
 * Defaults to 3 sets per exercise if not explicitly set.
 */
export function getTotalRoutineSets(routine: WorkoutRoutine): number {
  if (routine.targetSets) {
    return routine.exerciseIds.reduce(
      (sum, id) => sum + (routine.targetSets?.[id] ?? 3),
      0
    );
  }
  return routine.exerciseIds.length * 3;
}

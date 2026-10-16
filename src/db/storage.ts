import {
  Exercise,
  WorkoutSession,
  ExerciseStats,
  ExerciseHistoryEntry,
  SetType,
  WorkoutExerciseWithDetails,
  WorkoutRoutine,
} from '../types/workout';
import { DEFAULT_EXERCISES } from '../constants/defaultExercises';
import { calculate1RM, calculateVolume } from '../utils/calculations';

const STORAGE_KEYS = {
  EXERCISES: 'gym_exercises_v2',
  WORKOUTS: 'gym_workouts_v1',
  ACTIVE_WORKOUT: 'gym_active_workout_v1',
  ROUTINES: 'gym_routines_v1',
};

// Initialize default exercises if not present, preserving any existing custom exercises
function initializeStorage(): void {
  try {
    const storedExercises = localStorage.getItem(STORAGE_KEYS.EXERCISES);
    if (!storedExercises) {
      // Check if previous v1 storage exists to preserve custom exercises
      const oldV1Raw = localStorage.getItem('gym_exercises_v1');
      let customExercises: Exercise[] = [];
      if (oldV1Raw) {
        try {
          const oldList: Exercise[] = JSON.parse(oldV1Raw);
          customExercises = oldList.filter((e) => e.isCustom);
        } catch {
          // ignore parsing error
        }
      }

      const initialExercises: Exercise[] = DEFAULT_EXERCISES.map((ex, idx) => ({
        id: idx + 1,
        name: ex.name,
        category: ex.category,
        equipment: ex.equipment,
        isCustom: false,
        notes: null,
      }));

      // Append custom exercises if any existed
      customExercises.forEach((ce) => {
        const nextId = initialExercises.reduce((max, e) => Math.max(max, e.id), 0) + 1;
        initialExercises.push({ ...ce, id: nextId });
      });

      localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(initialExercises));
    }
  } catch (e) {
    console.error('Storage initialization failed:', e);
  }
}

// Ensure storage is initialized on module load
initializeStorage();

export function getExercises(filter?: { search?: string; category?: string }): Exercise[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXERCISES);
    let list: Exercise[] = raw ? JSON.parse(raw) : [];

    if (filter?.category && filter.category !== 'All' && filter.category !== 'Wszystkie') {
      list = list.filter((e) => e.category === filter.category);
    }

    if (filter?.search && filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter((e) => e.name.toLowerCase().includes(q));
    }

    return list.sort((a, b) => {
      if (a.isCustom !== b.isCustom) return a.isCustom ? -1 : 1;
      return a.name.localeCompare(b.name, 'en');
    });
  } catch {
    return [];
  }
}

export function getExerciseById(id: number): Exercise | undefined {
  const all = getExercises();
  return all.find((e) => e.id === id);
}

export function addCustomExercise(data: {
  name: string;
  category: string;
  equipment: string;
  notes?: string;
}): Exercise {
  const all = getExercises();
  const newId = all.reduce((max, e) => Math.max(max, e.id), 0) + 1;

  const newExercise: Exercise = {
    id: newId,
    name: data.name.trim(),
    category: data.category,
    equipment: data.equipment,
    isCustom: true,
    notes: data.notes?.trim() || null,
  };

  all.push(newExercise);
  localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(all));
  return newExercise;
}

export function deleteCustomExercise(id: number): void {
  const all = getExercises().filter((e) => !(e.id === id && e.isCustom));
  localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(all));
}

export function getCompletedWorkouts(): WorkoutSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    const workouts: WorkoutSession[] = raw ? JSON.parse(raw) : [];
    return workouts.sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  } catch {
    return [];
  }
}

export function getWorkoutById(id: number): WorkoutSession | undefined {
  const all = getCompletedWorkouts();
  return all.find((w) => w.id === id);
}

export function deleteWorkout(id: number): void {
  const all = getCompletedWorkouts().filter((w) => w.id !== id);
  localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(all));
}

export function getLastPerformance(
  exerciseId: number
): { date: string; sets: { weight: number; reps: number; setType: SetType }[] } | null {
  const workouts = getCompletedWorkouts();
  for (const w of workouts) {
    const ex = w.exercises?.find((e) => e.exerciseId === exerciseId);
    if (ex && ex.sets.some((s) => s.isCompleted)) {
      return {
        date: w.startTime,
        sets: ex.sets
          .filter((s) => s.isCompleted)
          .map((s) => ({
            weight: s.weight,
            reps: s.reps,
            setType: s.setType,
          })),
      };
    }
  }
  return null;
}

export function getExerciseStats(exerciseId: number): ExerciseStats {
  const workouts = getCompletedWorkouts();
  let personalRecord = 0;
  let estimated1RMMax = 0;
  let totalSets = 0;
  const history: ExerciseHistoryEntry[] = [];

  for (const w of workouts) {
    const ex = w.exercises?.find((e) => e.exerciseId === exerciseId);
    if (!ex) continue;

    const completed = ex.sets.filter((s) => s.isCompleted);
    if (completed.length === 0) continue;

    totalSets += completed.length;
    let sessionMax = 0;
    let session1RM = 0;
    let sessionVolume = 0;

    for (const s of completed) {
      if (s.weight > personalRecord) personalRecord = s.weight;
      if (s.weight > sessionMax) sessionMax = s.weight;

      const e1rm = calculate1RM(s.weight, s.reps);
      if (e1rm > estimated1RMMax) estimated1RMMax = e1rm;
      if (e1rm > session1RM) session1RM = e1rm;

      sessionVolume += s.weight * s.reps;
    }

    history.push({
      workoutId: w.id,
      workoutTitle: w.title,
      date: w.startTime,
      maxWeight: sessionMax,
      estimated1RM: session1RM,
      totalVolume: sessionVolume,
      sets: completed.map((s) => ({
        setNumber: s.setNumber,
        weight: s.weight,
        reps: s.reps,
        setType: s.setType,
      })),
    });
  }

  return {
    personalRecord,
    estimated1RMMax,
    totalWorkouts: history.length,
    totalSets,
    history,
  };
}

export function getDashboardStats(): {
  totalWorkouts: number;
  totalVolumeKg: number;
  workoutsThisMonth: number;
} {
  const workouts = getCompletedWorkouts();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  let totalVolumeKg = 0;
  let workoutsThisMonth = 0;

  for (const w of workouts) {
    if (w.exercises) {
      for (const ex of w.exercises) {
        totalVolumeKg += calculateVolume(ex.sets);
      }
    }
    if (new Date(w.startTime) >= startOfMonth) {
      workoutsThisMonth += 1;
    }
  }

  return {
    totalWorkouts: workouts.length,
    totalVolumeKg: Math.round(totalVolumeKg),
    workoutsThisMonth,
  };
}

export function getActiveWorkout(): WorkoutSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveActiveWorkout(workout: WorkoutSession | null): void {
  try {
    if (workout) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(workout));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
    }
  } catch (e) {
    console.error('Failed to save active workout:', e);
  }
}

export function finishActiveWorkout(notes?: string): WorkoutSession | null {
  const active = getActiveWorkout();
  if (!active) return null;

  const completedExercises = active.exercises?.map((we) => ({
    ...we,
    sets: we.sets.map((s) => ({
      ...s,
      isCompleted: s.isCompleted || s.reps > 0,
    })),
  }));

  const completed: WorkoutSession = {
    ...active,
    exercises: completedExercises,
    status: 'completed',
    endTime: new Date().toISOString(),
    notes: notes?.trim() || null,
  };

  const workouts = getCompletedWorkouts();
  workouts.unshift(completed);
  localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
  saveActiveWorkout(null);

  return completed;
}

export function cancelActiveWorkout(): void {
  saveActiveWorkout(null);
}

export function createNewWorkout(title?: string, routineId?: string): WorkoutSession {
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const workout: WorkoutSession = {
    id: Date.now(),
    title: title?.trim() || `Workout - ${dateStr}`,
    routineId,
    startTime: new Date().toISOString(),
    status: 'in_progress',
    exercises: [],
  };

  saveActiveWorkout(workout);
  return workout;
}

export const DEFAULT_ROUTINES_SPEC: {
  id: string;
  title: string;
  description: string;
  exerciseNames: string[];
}[] = [
  {
    id: 'routine-push',
    title: 'Push (Chest + Shoulders + Triceps)',
    description: 'Chest pressing, shoulder overhead work, and triceps isolation.',
    exerciseNames: [
      'Flat Barbell Bench Press',
      'Incline Dumbbell Press',
      'Overhead Press (OHP)',
      'Dumbbell Lateral Raises',
      'Triceps Rope Pushdown',
    ],
  },
  {
    id: 'routine-pull',
    title: 'Pull (Back + Rear Delts + Biceps)',
    description: 'Heavy back compound pulls, rowing, and arm curling.',
    exerciseNames: [
      'Conventional Deadlift',
      'Pull-ups (Overhand)',
      'Bent-Over Barbell Row',
      'Lat Pulldown',
      'Barbell Biceps Curl',
    ],
  },
  {
    id: 'routine-legs',
    title: 'Legs (Quads + Hamstrings + Calves)',
    description: 'Squat pattern, posterior chain hinge, and calf extensions.',
    exerciseNames: [
      'Barbell Back Squat',
      'Romanian Deadlift (RDL)',
      'Leg Press',
      'Lying Leg Curls',
      'Standing Calf Raises',
    ],
  },
  {
    id: 'routine-fbw',
    title: 'Full Body Workout (FBW)',
    description: 'Comprehensive total-body workout hitting all major muscle groups.',
    exerciseNames: [
      'Barbell Back Squat',
      'Flat Barbell Bench Press',
      'Bent-Over Barbell Row',
      'Overhead Press (OHP)',
      'Plank',
    ],
  },
];

export function getDefaultRoutines(): WorkoutRoutine[] {
  const allExercises = getExercises();
  return DEFAULT_ROUTINES_SPEC.map((spec) => {
    const ids: number[] = [];
    spec.exerciseNames.forEach((name) => {
      const match = allExercises.find((e) => e.name.toLowerCase() === name.toLowerCase());
      if (match) ids.push(match.id);
    });
    return {
      id: spec.id,
      title: spec.title,
      description: spec.description,
      exerciseIds: ids,
      isCustom: false,
    };
  });
}

export function getCustomRoutines(): WorkoutRoutine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROUTINES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getRoutines(): WorkoutRoutine[] {
  const custom = getCustomRoutines();
  const customIds = new Set(custom.map((r) => r.id));
  const defaults = getDefaultRoutines().filter((d) => !customIds.has(d.id));
  return [...custom, ...defaults];
}

export function getRoutineById(id: string): WorkoutRoutine | undefined {
  return getRoutines().find((r) => r.id === id);
}

export function saveCustomRoutine(data: {
  id?: string;
  title: string;
  description?: string;
  exerciseIds: number[];
  targetSets?: Record<number, number>;
}): WorkoutRoutine {
  const customList = getCustomRoutines();
  const now = new Date().toISOString();

  if (data.id && customList.some((r) => r.id === data.id)) {
    // Update existing custom routine
    const updated = customList.map((r) => {
      if (r.id === data.id) {
        return {
          ...r,
          title: data.title.trim(),
          description: data.description?.trim() || undefined,
          exerciseIds: data.exerciseIds,
          targetSets: data.targetSets,
        };
      }
      return r;
    });
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(updated));
    return updated.find((r) => r.id === data.id)!;
  } else if (data.id) {
    // Save routine (e.g. customized preset) under the provided ID
    const newRoutine: WorkoutRoutine = {
      id: data.id,
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      exerciseIds: data.exerciseIds,
      targetSets: data.targetSets,
      isCustom: true,
      createdAt: now,
    };
    customList.unshift(newRoutine);
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(customList));
    return newRoutine;
  }

  // Create new custom routine
  const newRoutine: WorkoutRoutine = {
    id: `custom-routine-${Date.now()}`,
    title: data.title.trim(),
    description: data.description?.trim() || undefined,
    exerciseIds: data.exerciseIds,
    targetSets: data.targetSets,
    isCustom: true,
    createdAt: now,
  };

  customList.unshift(newRoutine);
  localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(customList));
  return newRoutine;
}

export function addExerciseToRoutine(
  routineId: string,
  exerciseId: number,
  targetSetsCount?: number
): WorkoutRoutine | null {
  const routine = getRoutineById(routineId);
  if (!routine) return null;

  const exerciseIds = routine.exerciseIds.includes(exerciseId)
    ? routine.exerciseIds
    : [...routine.exerciseIds, exerciseId];

  const targetSets = {
    ...(routine.targetSets || {}),
    [exerciseId]: targetSetsCount || routine.targetSets?.[exerciseId] || 3,
  };

  return saveCustomRoutine({
    id: routine.id,
    title: routine.title,
    description: routine.description,
    exerciseIds,
    targetSets,
  });
}

export function updateRoutineExerciseSets(
  routineId: string,
  exerciseId: number,
  targetSetsCount: number
): WorkoutRoutine | null {
  const routine = getRoutineById(routineId);
  if (!routine) return null;

  const targetSets = {
    ...(routine.targetSets || {}),
    [exerciseId]: targetSetsCount,
  };

  return saveCustomRoutine({
    id: routine.id,
    title: routine.title,
    description: routine.description,
    exerciseIds: routine.exerciseIds,
    targetSets,
  });
}

export function deleteCustomRoutine(id: string): void {
  const customList = getCustomRoutines().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(customList));
}

export function exportBackupJSON(): string {
  const data = {
    exercises: getExercises(),
    workouts: getCompletedWorkouts(),
    routines: getCustomRoutines(),
    version: '1.1',
    exportDate: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

export function importBackupJSON(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed.exercises)) {
      localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(parsed.exercises));
    }
    if (Array.isArray(parsed.workouts)) {
      localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(parsed.workouts));
    }
    if (Array.isArray(parsed.routines)) {
      localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(parsed.routines));
    }
    return true;
  } catch {
    return false;
  }
}

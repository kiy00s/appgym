export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Legs'
  | 'Shoulders'
  | 'Arms'
  | 'Core'
  | 'Full Body'
  | 'Other'
  | string;

export type EquipmentType =
  | 'Barbell'
  | 'Dumbbell'
  | 'Machine'
  | 'Cable'
  | 'Bodyweight'
  | 'Other'
  | string;

export type SetType = 'normal' | 'warmup' | 'drop' | 'failure';

export interface Exercise {
  id: number;
  name: string;
  category: MuscleGroup | string;
  equipment: EquipmentType | string;
  isCustom: boolean;
  notes?: string | null;
}

export interface ExerciseSet {
  id?: number;
  workoutExerciseId?: number;
  setNumber: number;
  setType: SetType;
  weight: number;
  reps: number;
  isCompleted: boolean;
  rpe?: number | null;
}

export interface WorkoutExerciseWithDetails {
  id: number;
  workoutId: number;
  exerciseId: number;
  orderIndex: number;
  exercise: Exercise;
  sets: ExerciseSet[];
  lastPerformance?: {
    date: string;
    sets: { weight: number; reps: number; setType: SetType }[];
  } | null;
}

export interface WorkoutSession {
  id: number;
  title: string;
  startTime: string;
  endTime?: string | null;
  status: 'in_progress' | 'completed' | 'cancelled';
  notes?: string | null;
  exercises?: WorkoutExerciseWithDetails[];
}

export interface ExerciseHistoryEntry {
  workoutId: number;
  workoutTitle: string;
  date: string;
  maxWeight: number;
  estimated1RM: number;
  totalVolume: number;
  sets: {
    setNumber: number;
    weight: number;
    reps: number;
    setType: SetType;
  }[];
}

export interface ExerciseStats {
  personalRecord: number;
  estimated1RMMax: number;
  totalWorkouts: number;
  totalSets: number;
  history: ExerciseHistoryEntry[];
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  description?: string;
  exerciseIds: number[];
  targetSets?: Record<number, number>;
  isCustom: boolean;
  createdAt?: string;
}


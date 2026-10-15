import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  WorkoutSession,
  WorkoutExerciseWithDetails,
  ExerciseSet,
} from '../types/workout';
import {
  getActiveWorkout,
  saveActiveWorkout,
  createNewWorkout,
  finishActiveWorkout,
  cancelActiveWorkout,
  getLastPerformance,
  getExerciseById,
} from '../db/storage';

interface WorkoutContextType {
  activeWorkout: WorkoutSession | null;
  startWorkout: (title?: string) => WorkoutSession;
  finishWorkout: (notes?: string) => WorkoutSession | null;
  cancelWorkout: () => void;
  updateTitle: (title: string) => void;
  addExercise: (exerciseId: number) => void;
  removeExercise: (workoutExerciseId: number) => void;
  addSet: (workoutExerciseId: number) => void;
  updateSet: (workoutExerciseId: number, setId: number, updates: Partial<ExerciseSet>) => void;
  removeSet: (workoutExerciseId: number, setId: number) => void;
  toggleSetCompleted: (workoutExerciseId: number, setId: number) => void;
  refreshState: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(getActiveWorkout());

  const refreshState = useCallback(() => {
    setActiveWorkout(getActiveWorkout());
  }, []);

  const startWorkout = (title?: string): WorkoutSession => {
    const session = createNewWorkout(title);
    setActiveWorkout(session);
    return session;
  };

  const finishWorkout = (notes?: string): WorkoutSession | null => {
    const completed = finishActiveWorkout(notes);
    setActiveWorkout(null);
    return completed;
  };

  const cancelWorkout = (): void => {
    cancelActiveWorkout();
    setActiveWorkout(null);
  };

  const updateTitle = (title: string): void => {
    if (!activeWorkout) return;
    const updated: WorkoutSession = { ...activeWorkout, title: title.trim() };
    saveActiveWorkout(updated);
    setActiveWorkout(updated);
  };

  const addExercise = (exerciseId: number): void => {
    if (!activeWorkout) return;
    const exData = getExerciseById(exerciseId);
    if (!exData) return;

    const existingExercises = activeWorkout.exercises || [];
    const weId = Date.now();
    const lastPerf = getLastPerformance(exerciseId);

    const initialWeight = lastPerf?.sets[0]?.weight ?? 20;
    const initialReps = lastPerf?.sets[0]?.reps ?? 10;

    const newExercise: WorkoutExerciseWithDetails = {
      id: weId,
      workoutId: activeWorkout.id,
      exerciseId,
      orderIndex: existingExercises.length,
      exercise: exData,
      lastPerformance: lastPerf,
      sets: [
        {
          id: Date.now() + 1,
          workoutExerciseId: weId,
          setNumber: 1,
          setType: 'normal',
          weight: initialWeight,
          reps: initialReps,
          isCompleted: false,
        },
      ],
    };

    const updated: WorkoutSession = {
      ...activeWorkout,
      exercises: [...existingExercises, newExercise],
    };

    saveActiveWorkout(updated);
    setActiveWorkout(updated);
  };

  const removeExercise = (workoutExerciseId: number): void => {
    if (!activeWorkout) return;
    const updated: WorkoutSession = {
      ...activeWorkout,
      exercises: (activeWorkout.exercises || []).filter((e) => e.id !== workoutExerciseId),
    };
    saveActiveWorkout(updated);
    setActiveWorkout(updated);
  };

  const addSet = (workoutExerciseId: number): void => {
    if (!activeWorkout) return;
    const updatedExercises = (activeWorkout.exercises || []).map((ex) => {
      if (ex.id !== workoutExerciseId) return ex;

      const lastSet = ex.sets[ex.sets.length - 1];
      const newSetNumber = ex.sets.length + 1;
      const newSet: ExerciseSet = {
        id: Date.now(),
        workoutExerciseId,
        setNumber: newSetNumber,
        setType: 'normal',
        weight: lastSet ? lastSet.weight : 20,
        reps: lastSet ? lastSet.reps : 10,
        isCompleted: false,
      };

      return {
        ...ex,
        sets: [...ex.sets, newSet],
      };
    });

    const updated: WorkoutSession = {
      ...activeWorkout,
      exercises: updatedExercises,
    };
    saveActiveWorkout(updated);
    setActiveWorkout(updated);
  };

  const updateSet = (
    workoutExerciseId: number,
    setId: number,
    updates: Partial<ExerciseSet>
  ): void => {
    if (!activeWorkout) return;
    const updatedExercises = (activeWorkout.exercises || []).map((ex) => {
      if (ex.id !== workoutExerciseId) return ex;

      return {
        ...ex,
        sets: ex.sets.map((s) => (s.id === setId ? { ...s, ...updates } : s)),
      };
    });

    const updated: WorkoutSession = {
      ...activeWorkout,
      exercises: updatedExercises,
    };
    saveActiveWorkout(updated);
    setActiveWorkout(updated);
  };

  const removeSet = (workoutExerciseId: number, setId: number): void => {
    if (!activeWorkout) return;
    const updatedExercises = (activeWorkout.exercises || []).map((ex) => {
      if (ex.id !== workoutExerciseId) return ex;

      const remainingSets = ex.sets
        .filter((s) => s.id !== setId)
        .map((s, idx) => ({ ...s, setNumber: idx + 1 }));

      return {
        ...ex,
        sets: remainingSets,
      };
    });

    const updated: WorkoutSession = {
      ...activeWorkout,
      exercises: updatedExercises,
    };
    saveActiveWorkout(updated);
    setActiveWorkout(updated);
  };

  const toggleSetCompleted = (workoutExerciseId: number, setId: number): void => {
    if (!activeWorkout) return;
    const ex = activeWorkout.exercises?.find((e) => e.id === workoutExerciseId);
    const targetSet = ex?.sets.find((s) => s.id === setId);
    if (!targetSet) return;

    updateSet(workoutExerciseId, setId, { isCompleted: !targetSet.isCompleted });
  };

  return (
    <WorkoutContext.Provider
      value={{
        activeWorkout,
        startWorkout,
        finishWorkout,
        cancelWorkout,
        updateTitle,
        addExercise,
        removeExercise,
        addSet,
        updateSet,
        removeSet,
        toggleSetCompleted,
        refreshState,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

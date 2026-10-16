import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  WorkoutSession,
  WorkoutExerciseWithDetails,
  ExerciseSet,
  WorkoutRoutine,
} from '../types/workout';
import {
  getActiveWorkout,
  saveActiveWorkout,
  createNewWorkout,
  finishActiveWorkout,
  cancelActiveWorkout,
  getLastPerformance,
  getExerciseById,
  addExerciseToRoutine,
  updateRoutineExerciseSets,
} from '../db/storage';
import { getGitHubSyncConfig, syncToGitHubGist } from '../utils/githubSync';

interface WorkoutContextType {
  activeWorkout: WorkoutSession | null;
  startWorkout: (title?: string) => WorkoutSession;
  startWorkoutWithRoutine: (routine: WorkoutRoutine) => WorkoutSession;
  finishWorkout: (notes?: string) => WorkoutSession | null;
  cancelWorkout: () => void;
  updateTitle: (title: string) => void;
  addExercise: (exerciseId: number) => void;
  removeExercise: (workoutExerciseId: number) => void;
  addSet: (workoutExerciseId: number) => void;
  updateSet: (workoutExerciseId: number, setId: number, updates: Partial<ExerciseSet>) => void;
  removeSet: (workoutExerciseId: number, setId: number) => void;
  toggleSetCompleted: (workoutExerciseId: number, setId: number) => void;
  syncActiveWorkoutWithRoutine: (routine: WorkoutRoutine) => void;
  applyRoutineToActiveWorkout: (routine: WorkoutRoutine) => void;
  addExerciseToActiveRoutine: (exerciseId: number, targetSetsCount?: number) => void;
  updateActiveRoutineExerciseSets: (exerciseId: number, targetSetsCount: number) => void;
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

  const startWorkoutWithRoutine = (routine: WorkoutRoutine): WorkoutSession => {
    const session = createNewWorkout(routine.title, routine.id);
    const exercises: WorkoutExerciseWithDetails[] = [];

    routine.exerciseIds.forEach((exId, idx) => {
      const exData = getExerciseById(exId);
      if (!exData) return;
      const lastPerf = getLastPerformance(exId);
      const initialWeight = lastPerf?.sets[0]?.weight ?? 20;
      const initialReps = lastPerf?.sets[0]?.reps ?? 10;
      const weId = Date.now() + idx * 10;

      const setsCount = routine.targetSets?.[exId] ?? (lastPerf?.sets.length ? Math.min(lastPerf.sets.length, 3) : 3);
      const sets: ExerciseSet[] = [];
      for (let s = 1; s <= setsCount; s++) {
        const prevSet = lastPerf?.sets[s - 1];
        sets.push({
          id: weId * 100 + s,
          workoutExerciseId: weId,
          setNumber: s,
          setType: prevSet?.setType ?? 'normal',
          weight: prevSet?.weight ?? initialWeight,
          reps: prevSet?.reps ?? initialReps,
          isCompleted: false,
        });
      }

      exercises.push({
        id: weId,
        workoutId: session.id,
        exerciseId: exId,
        orderIndex: idx,
        exercise: exData,
        lastPerformance: lastPerf,
        sets,
      });
    });

    session.exercises = exercises;
    saveActiveWorkout(session);
    setActiveWorkout(session);
    return session;
  };

  const finishWorkout = (notes?: string): WorkoutSession | null => {
    const completed = finishActiveWorkout(notes);
    setActiveWorkout(null);
    if (completed) {
      try {
        const { autoSync, token } = getGitHubSyncConfig();
        if (autoSync && token) {
          syncToGitHubGist().catch((err) => console.log('Background GitHub sync failed:', err));
        }
      } catch (e) {
        console.log('Background auto-sync check error:', e);
      }
    }
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

  const syncActiveWorkoutWithRoutine = useCallback((routine: WorkoutRoutine) => {
    setActiveWorkout((currentWorkout) => {
      if (!currentWorkout || currentWorkout.routineId !== routine.id) {
        return currentWorkout;
      }

      const existingExercises = currentWorkout.exercises || [];
      const updatedExercises: WorkoutExerciseWithDetails[] = [];
      const exerciseMap = new Map<number, WorkoutExerciseWithDetails>();
      existingExercises.forEach((we) => exerciseMap.set(we.exerciseId, we));

      routine.exerciseIds.forEach((exId, idx) => {
        const existing = exerciseMap.get(exId);
        const plannedSetsCount = routine.targetSets?.[exId] ?? 3;

        if (existing) {
          // Adjust sets if plannedSetsCount changed, keeping completed sets safe
          const sets = [...existing.sets];
          const completedCount = sets.filter((s) => s.isCompleted).length;

          if (sets.length < plannedSetsCount) {
            const lastSet = sets[sets.length - 1];
            const lastPerf = getLastPerformance(exId);
            const weight = lastSet?.weight ?? lastPerf?.sets[0]?.weight ?? 20;
            const reps = lastSet?.reps ?? lastPerf?.sets[0]?.reps ?? 10;
            for (let s = sets.length + 1; s <= plannedSetsCount; s++) {
              sets.push({
                id: existing.id * 100 + s,
                workoutExerciseId: existing.id,
                setNumber: s,
                setType: 'normal',
                weight,
                reps,
                isCompleted: false,
              });
            }
          } else if (sets.length > plannedSetsCount) {
            while (
              sets.length > plannedSetsCount &&
              sets.length > completedCount &&
              !sets[sets.length - 1].isCompleted
            ) {
              sets.pop();
            }
            sets.forEach((s, i) => {
              s.setNumber = i + 1;
            });
          }

          updatedExercises.push({
            ...existing,
            orderIndex: idx,
            sets,
          });
          exerciseMap.delete(exId);
        } else {
          // New exercise added to routine: instantiate for this active workout
          const exData = getExerciseById(exId);
          if (exData) {
            const lastPerf = getLastPerformance(exId);
            const initialWeight = lastPerf?.sets[0]?.weight ?? 20;
            const initialReps = lastPerf?.sets[0]?.reps ?? 10;
            const weId = Date.now() + idx * 10;
            const sets: ExerciseSet[] = [];
            for (let s = 1; s <= plannedSetsCount; s++) {
              const prevSet = lastPerf?.sets[s - 1];
              sets.push({
                id: weId * 100 + s,
                workoutExerciseId: weId,
                setNumber: s,
                setType: prevSet?.setType ?? 'normal',
                weight: prevSet?.weight ?? initialWeight,
                reps: prevSet?.reps ?? initialReps,
                isCompleted: false,
              });
            }
            updatedExercises.push({
              id: weId,
              workoutId: currentWorkout.id,
              exerciseId: exId,
              orderIndex: idx,
              exercise: exData,
              lastPerformance: lastPerf,
              sets,
            });
          }
        }
      });

      // Preserve any exercise not in routine that has at least one completed set
      exerciseMap.forEach((we) => {
        if (we.sets.some((s) => s.isCompleted)) {
          updatedExercises.push({
            ...we,
            orderIndex: updatedExercises.length,
          });
        }
      });

      const updatedSession: WorkoutSession = {
        ...currentWorkout,
        exercises: updatedExercises,
      };
      saveActiveWorkout(updatedSession);
      return updatedSession;
    });
  }, []);

  const applyRoutineToActiveWorkout = useCallback((routine: WorkoutRoutine) => {
    setActiveWorkout((currentWorkout) => {
      if (!currentWorkout) return null;

      const exercises: WorkoutExerciseWithDetails[] = [];
      routine.exerciseIds.forEach((exId, idx) => {
        const exData = getExerciseById(exId);
        if (!exData) return;
        const lastPerf = getLastPerformance(exId);
        const initialWeight = lastPerf?.sets[0]?.weight ?? 20;
        const initialReps = lastPerf?.sets[0]?.reps ?? 10;
        const weId = Date.now() + idx * 10;

        const setsCount = routine.targetSets?.[exId] ?? (lastPerf?.sets.length ? Math.min(lastPerf.sets.length, 3) : 3);
        const sets: ExerciseSet[] = [];
        for (let s = 1; s <= setsCount; s++) {
          const prevSet = lastPerf?.sets[s - 1];
          sets.push({
            id: weId * 100 + s,
            workoutExerciseId: weId,
            setNumber: s,
            setType: prevSet?.setType ?? 'normal',
            weight: prevSet?.weight ?? initialWeight,
            reps: prevSet?.reps ?? initialReps,
            isCompleted: false,
          });
        }

        exercises.push({
          id: weId,
          workoutId: currentWorkout.id,
          exerciseId: exId,
          orderIndex: idx,
          exercise: exData,
          lastPerformance: lastPerf,
          sets,
        });
      });

      // Preserve any previous exercises that already have completed sets
      const existingCompleted = (currentWorkout.exercises || []).filter(
        (e) => e.sets.some((s) => s.isCompleted) && !routine.exerciseIds.includes(e.exerciseId)
      );
      const allExercisesList = [...exercises, ...existingCompleted];

      const updated: WorkoutSession = {
        ...currentWorkout,
        title: routine.title,
        routineId: routine.id,
        exercises: allExercisesList,
      };
      saveActiveWorkout(updated);
      return updated;
    });
  }, []);

  const addExerciseToActiveRoutine = useCallback(
    (exerciseId: number, targetSetsCount?: number) => {
      if (!activeWorkout?.routineId) return;
      const updated = addExerciseToRoutine(activeWorkout.routineId, exerciseId, targetSetsCount);
      if (updated) {
        refreshState();
      }
    },
    [activeWorkout, refreshState]
  );

  const updateActiveRoutineExerciseSets = useCallback(
    (exerciseId: number, targetSetsCount: number) => {
      if (!activeWorkout?.routineId) return;
      const updated = updateRoutineExerciseSets(activeWorkout.routineId, exerciseId, targetSetsCount);
      if (updated) {
        refreshState();
      }
    },
    [activeWorkout, refreshState]
  );

  return (
    <WorkoutContext.Provider
      value={{
        activeWorkout,
        startWorkout,
        startWorkoutWithRoutine,
        finishWorkout,
        cancelWorkout,
        updateTitle,
        addExercise,
        removeExercise,
        addSet,
        updateSet,
        removeSet,
        toggleSetCompleted,
        syncActiveWorkoutWithRoutine,
        applyRoutineToActiveWorkout,
        addExerciseToActiveRoutine,
        updateActiveRoutineExerciseSets,
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

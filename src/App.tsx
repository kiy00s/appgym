import React, { useState, useEffect } from 'react';
import { useWorkout } from './context/WorkoutContext';
import {
  getExercises,
  getRoutineById,
  deleteCustomRoutine,
} from './db/storage';
import { WorkoutRoutine } from './types/workout';
import { checkAndClearUpdateFlag } from './utils/pwa';

// Structural & Navigation Components
import { AppHeader } from './components/AppHeader';
import { BottomNav, AppTab } from './components/BottomNav';
import { Toast } from './components/Toast';

// Tab Views
import { WorkoutTab } from './components/tabs/WorkoutTab';
import { RoutinesTab } from './components/tabs/RoutinesTab';
import { ExercisesTab } from './components/tabs/ExercisesTab';
import { HistoryTab } from './components/tabs/HistoryTab';

// Modals
import { ActiveWorkoutModal } from './components/ActiveWorkoutModal';
import { ExercisePickerModal } from './components/ExercisePickerModal';
import { NewExerciseModal } from './components/NewExerciseModal';
import { ExerciseDetailModal } from './components/ExerciseDetailModal';
import { WorkoutDetailModal } from './components/WorkoutDetailModal';
import { CreateRoutineModal } from './components/CreateRoutineModal';
import { AddToRoutineModal, AddToRoutinePromptData } from './components/AddToRoutineModal';
import { GitHubSyncModal } from './components/GitHubSyncModal';

export const App: React.FC = () => {
  const {
    activeWorkout,
    startWorkout,
    startWorkoutWithRoutine,
    addExercise,
    syncActiveWorkoutWithRoutine,
    addExerciseToActiveRoutine,
    updateActiveRoutineExerciseSets,
    refreshState,
  } = useWorkout();

  // Active Tab
  const [activeTab, setActiveTab] = useState<AppTab>('workout');

  // Modals state
  const [isActiveModalOpen, setIsActiveModalOpen] = useState(false);
  const [isExercisePickerOpen, setIsExercisePickerOpen] = useState(false);
  const [isNewExerciseOpen, setIsNewExerciseOpen] = useState(false);
  const [isCreateRoutineOpen, setIsCreateRoutineOpen] = useState(false);
  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(null);
  const [pendingRoutinePrompt, setPendingRoutinePrompt] = useState<AddToRoutinePromptData | null>(null);
  const [isGitHubSyncOpen, setIsGitHubSyncOpen] = useState(false);
  const [showUpdateToast, setShowUpdateToast] = useState(false);

  // Check if app was just refreshed via Update App
  useEffect(() => {
    if (checkAndClearUpdateFlag()) {
      setShowUpdateToast(true);
    }
  }, []);

  // Workout Action Handlers
  const handleStartWorkout = (title?: string) => {
    if (activeWorkout) {
      setIsActiveModalOpen(true);
      return;
    }
    startWorkout(title);
    setIsActiveModalOpen(true);
  };

  const handleStartRoutine = (routine: WorkoutRoutine) => {
    if (activeWorkout) {
      setIsActiveModalOpen(true);
      return;
    }
    startWorkoutWithRoutine(routine);
    setIsActiveModalOpen(true);
  };

  const handleStartWithExercise = (exerciseId: number) => {
    startWorkout();
    addExercise(exerciseId);
    setIsActiveModalOpen(true);
  };

  const handleAddExerciseFromPicker = (exerciseId: number) => {
    addExercise(exerciseId);
    if (activeWorkout?.routineId) {
      const routine = getRoutineById(activeWorkout.routineId);
      const exData = getExercises().find((e) => e.id === exerciseId);
      if (routine && exData) {
        setPendingRoutinePrompt({
          exerciseId,
          exerciseName: exData.name,
          routineId: routine.id,
          routineTitle: routine.title,
          isAlreadyInRoutine: routine.exerciseIds.includes(exerciseId),
          initialSets: routine.targetSets?.[exerciseId] ?? 3,
        });
      }
    }
  };

  // Routine Management Handlers
  const handleOpenNewRoutine = () => {
    setEditingRoutineId(null);
    setIsCreateRoutineOpen(true);
  };

  const handleOpenEditRoutine = (id: string) => {
    setEditingRoutineId(id);
    setIsCreateRoutineOpen(true);
  };

  const handleDeleteRoutine = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete routine "${title}"?`)) {
      deleteCustomRoutine(id);
      refreshState();
    }
  };

  return (
    <div className="app-viewport">
      {/* Top Header with Title and Settings */}
      <AppHeader
        onDataRestored={refreshState}
        onOpenGitHubSync={() => setIsGitHubSyncOpen(true)}
      />

      {/* Main Tab Content */}
      <main style={{ padding: '16px', flex: 1 }}>
        {activeTab === 'workout' && (
          <WorkoutTab
            activeWorkout={activeWorkout}
            onResumeWorkout={() => setIsActiveModalOpen(true)}
            onStartEmptyWorkout={() => handleStartWorkout()}
            onStartRoutine={handleStartRoutine}
            onNavigateToRoutines={() => setActiveTab('routines')}
            onSelectWorkout={(id) => setSelectedWorkoutId(id)}
          />
        )}

        {activeTab === 'routines' && (
          <RoutinesTab
            onOpenNewRoutine={handleOpenNewRoutine}
            onOpenEditRoutine={handleOpenEditRoutine}
            onDeleteRoutine={handleDeleteRoutine}
            onStartRoutine={handleStartRoutine}
          />
        )}

        {activeTab === 'exercises' && (
          <ExercisesTab
            onSelectExercise={(id) => setSelectedExerciseId(id)}
            onOpenCreateExercise={() => setIsNewExerciseOpen(true)}
          />
        )}

        {activeTab === 'history' && (
          <HistoryTab
            onSelectWorkout={(id) => setSelectedWorkoutId(id)}
            onStartWorkout={() => handleStartWorkout()}
          />
        )}
      </main>

      {/* Bottom Tabs Bar */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Modals & Dialogs */}
      <ActiveWorkoutModal
        key={activeWorkout ? `workout-${activeWorkout.id}` : 'no-active-workout'}
        isOpen={isActiveModalOpen}
        onClose={() => setIsActiveModalOpen(false)}
        onOpenExercisePicker={() => setIsExercisePickerOpen(true)}
        onSelectExercise={(id) => setSelectedExerciseId(id)}
      />

      <ExercisePickerModal
        isOpen={isExercisePickerOpen}
        onClose={() => setIsExercisePickerOpen(false)}
        onSelectExercise={handleAddExerciseFromPicker}
        onOpenCreateNew={() => setIsNewExerciseOpen(true)}
      />

      <NewExerciseModal
        isOpen={isNewExerciseOpen}
        onClose={() => setIsNewExerciseOpen(false)}
        onCreated={(id) => {
          if (activeWorkout) {
            addExercise(id);
            if (activeWorkout.routineId) {
              const routine = getRoutineById(activeWorkout.routineId);
              const exData = getExercises().find((e) => e.id === id);
              if (routine && exData) {
                setPendingRoutinePrompt({
                  exerciseId: id,
                  exerciseName: exData.name,
                  routineId: routine.id,
                  routineTitle: routine.title,
                  isAlreadyInRoutine: routine.exerciseIds.includes(id),
                  initialSets: routine.targetSets?.[id] ?? 3,
                });
              }
            }
          }
          refreshState();
        }}
      />

      <CreateRoutineModal
        isOpen={isCreateRoutineOpen}
        routineId={editingRoutineId}
        onClose={() => setIsCreateRoutineOpen(false)}
        onSaved={(savedRoutine) => {
          syncActiveWorkoutWithRoutine(savedRoutine);
          refreshState();
        }}
      />

      <ExerciseDetailModal
        exerciseId={selectedExerciseId}
        onClose={() => setSelectedExerciseId(null)}
        onStartWorkoutWithExercise={handleStartWithExercise}
        onDeleted={() => refreshState()}
      />

      <WorkoutDetailModal
        workoutId={selectedWorkoutId}
        onClose={() => setSelectedWorkoutId(null)}
        onDeleted={() => refreshState()}
        onSelectExercise={(id) => setSelectedExerciseId(id)}
      />

      <AddToRoutineModal
        isOpen={Boolean(pendingRoutinePrompt)}
        data={pendingRoutinePrompt}
        onClose={() => setPendingRoutinePrompt(null)}
        onConfirm={({ addToRoutine, targetSetsCount }) => {
          if (addToRoutine && pendingRoutinePrompt) {
            if (pendingRoutinePrompt.isAlreadyInRoutine) {
              updateActiveRoutineExerciseSets(pendingRoutinePrompt.exerciseId, targetSetsCount);
            } else {
              addExerciseToActiveRoutine(pendingRoutinePrompt.exerciseId, targetSetsCount);
            }
          }
          setPendingRoutinePrompt(null);
        }}
      />

      <GitHubSyncModal
        isOpen={isGitHubSyncOpen}
        onClose={() => setIsGitHubSyncOpen(false)}
        onDataRestored={refreshState}
      />

      <Toast
        isOpen={showUpdateToast}
        title="App Updated!"
        message="Successfully refreshed to the latest version."
        onClose={() => setShowUpdateToast(false)}
      />
    </div>
  );
};

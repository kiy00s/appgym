import React, { useState } from 'react';
import { Plus, Trash2, Check, BookmarkPlus } from 'lucide-react';
import { WorkoutExerciseWithDetails } from '../types/workout';
import { SetRow } from './SetRow';
import { useWorkout } from '../context/WorkoutContext';
import { getRoutineById } from '../db/storage';

interface WorkoutExerciseCardProps {
  item: WorkoutExerciseWithDetails;
  onSelectExercise: (exerciseId: number) => void;
}

export const WorkoutExerciseCard: React.FC<WorkoutExerciseCardProps> = ({
  item,
  onSelectExercise,
}) => {
  const {
    activeWorkout,
    removeExercise,
    addSet,
    updateSet,
    removeSet,
    toggleSetCompleted,
    updateActiveRoutineExerciseSets,
    addExerciseToActiveRoutine,
  } = useWorkout();

  const [savedFeedback, setSavedFeedback] = useState(false);

  const routine = activeWorkout?.routineId ? getRoutineById(activeWorkout.routineId) : null;
  const isExerciseInRoutine = routine ? routine.exerciseIds.includes(item.exercise.id) : false;
  const plannedSets = isExerciseInRoutine && routine ? (routine.targetSets?.[item.exercise.id] ?? 3) : null;
  const currentSets = item.sets.length;

  const handleSyncSets = (setsCount: number) => {
    if (isExerciseInRoutine) {
      updateActiveRoutineExerciseSets(item.exercise.id, setsCount);
    } else {
      addExerciseToActiveRoutine(item.exercise.id, setsCount);
    }
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  return (
    <div
      style={{
        backgroundColor: '#191C24',
        border: '1px solid #282C37',
        borderRadius: '14px',
        padding: '16px',
        marginBottom: '14px',
      }}
    >
      {/* Exercise Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '14px',
        }}
      >
        <div
          onClick={() => onSelectExercise(item.exercise.id)}
          style={{ cursor: 'pointer', flex: 1, marginRight: '10px' }}
        >
          <div
            style={{
              fontSize: '17px',
              fontWeight: 800,
              color: '#F3F4F6',
              marginBottom: '4px',
            }}
          >
            {item.exercise.name}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
            <span className="badge-pill">{item.exercise.category}</span>
            <span className="badge-pill">{item.exercise.equipment}</span>

            {/* Routine Plan sync indicator / button */}
            {routine && (
              <>
                {savedFeedback ? (
                  <span
                    style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid #10B981',
                      borderRadius: '6px',
                      padding: '2px 8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#10B981',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Check size={12} /> Plan updated to {currentSets} sets!
                  </span>
                ) : isExerciseInRoutine && plannedSets !== null && plannedSets !== currentSets ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSyncSets(currentSets);
                    }}
                    style={{
                      background: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '6px',
                      padding: '2px 8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#10B981',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                    title={`Click to update plan "${routine.title}" to ${currentSets} sets`}
                  >
                    <BookmarkPlus size={12} /> Plan: {plannedSets}s • Set to {currentSets}s
                  </button>
                ) : isExerciseInRoutine && plannedSets !== null ? (
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#6B7280',
                      fontWeight: 600,
                    }}
                  >
                    Plan: {plannedSets} sets
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSyncSets(currentSets);
                    }}
                    style={{
                      background: 'rgba(6, 182, 212, 0.12)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      borderRadius: '6px',
                      padding: '2px 8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#06B6D4',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                    title={`Add ${item.exercise.name} to plan "${routine.title}"`}
                  >
                    <BookmarkPlus size={12} /> + Add to plan ({currentSets}s)
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (confirm(`Are you sure you want to remove "${item.exercise.name}" from this workout?`)) {
              removeExercise(item.id);
            }
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#EF4444',
            cursor: 'pointer',
            padding: '6px',
          }}
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Table Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '6px 4px',
          borderBottom: '1px solid #232733',
          marginBottom: '6px',
          fontSize: '11px',
          fontWeight: 800,
          color: '#6B7280',
          letterSpacing: '0.5px',
        }}
      >
        <div style={{ width: '32px', textAlign: 'center' }}>SET</div>
        <div style={{ flex: 1.3, textAlign: 'center' }}>PREVIOUS</div>
        <div style={{ flex: 1.1, textAlign: 'center' }}>KG</div>
        <div style={{ flex: 1.1, textAlign: 'center' }}>REPS</div>
        <div style={{ width: '34px', textAlign: 'center', marginLeft: '4px' }}>DONE</div>
        <div style={{ width: '28px' }}></div>
      </div>

      {/* Sets */}
      {item.sets.map((set, idx) => {
        const lastPerfSet = item.lastPerformance?.sets[idx];
        const prevText = lastPerfSet
          ? `${lastPerfSet.weight}kg × ${lastPerfSet.reps}`
          : undefined;

        return (
          <SetRow
            key={set.id ?? idx}
            set={set}
            previousPerformanceText={prevText}
            onUpdate={(fields) => set.id && updateSet(item.id, set.id, fields)}
            onDelete={() => set.id && removeSet(item.id, set.id)}
            onToggleComplete={() => set.id && toggleSetCompleted(item.id, set.id)}
          />
        );
      })}

      {/* Add Set Button */}
      <button
        type="button"
        onClick={() => addSet(item.id)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          backgroundColor: '#20242D',
          color: '#10B981',
          border: '1px solid #232733',
          borderRadius: '10px',
          padding: '10px',
          marginTop: '10px',
          fontWeight: 700,
          fontSize: '13px',
          cursor: 'pointer',
        }}
      >
        <Plus size={16} /> Add Set
      </button>
    </div>
  );
};

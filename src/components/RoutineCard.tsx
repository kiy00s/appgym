import React from 'react';
import { Play, ChevronRight, Trash2 } from 'lucide-react';
import { WorkoutRoutine, Exercise } from '../types/workout';
import { getRoutineExerciseNames, getTotalRoutineSets } from '../utils/routineUtils';

interface RoutineCardProps {
  routine: WorkoutRoutine;
  exercises?: Exercise[];
  onStart: (routine: WorkoutRoutine) => void;
  onEdit?: (routineId: string) => void;
  onDelete?: (routineId: string, title: string) => void;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({
  routine,
  exercises,
  onStart,
  onEdit,
  onDelete,
}) => {
  const isCustom = routine.isCustom;
  const plannedSets = getTotalRoutineSets(routine);
  const exerciseNames = getRoutineExerciseNames(routine, exercises);

  return (
    <div
      className="card"
      onClick={() => {
        if (isCustom && onEdit) {
          onEdit(routine.id);
        }
      }}
      style={{
        margin: 0,
        padding: '16px',
        cursor: isCustom && onEdit ? 'pointer' : 'default',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '6px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#F3F4F6' }}>
              {routine.title}
            </h4>
            <span
              className="badge-pill"
              style={{
                backgroundColor: isCustom ? 'rgba(16, 185, 129, 0.15)' : '#20242D',
                color: isCustom ? '#10B981' : '#9CA3AF',
                fontSize: '10px',
              }}
            >
              {isCustom ? 'Custom' : 'Preset'}
            </span>
          </div>
          {routine.description && (
            <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '3px' }}>
              {routine.description}
            </p>
          )}
        </div>

        {isCustom && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {onEdit && (
              <span
                style={{
                  fontSize: '11px',
                  color: '#10B981',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                }}
              >
                Edit <ChevronRight size={13} />
              </span>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(routine.id, routine.title);
                }}
                style={{
                  background: 'none',
                  border: '1px solid #232733',
                  borderRadius: '8px',
                  padding: '6px',
                  color: '#EF4444',
                  cursor: 'pointer',
                }}
                title="Delete Routine"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Exercises list preview */}
      <div
        style={{
          fontSize: '12px',
          color: '#6B7280',
          lineHeight: '1.4',
          margin: '10px 0 14px',
          backgroundColor: '#16181F',
          padding: '8px 10px',
          borderRadius: '8px',
        }}
      >
        <strong>
          {routine.exerciseIds.length} exercises • {plannedSets} planned sets:
        </strong>{' '}
        {exerciseNames}
      </div>

      <button
        type="button"
        className={isCustom ? 'btn-primary' : 'btn-secondary'}
        onClick={(e) => {
          e.stopPropagation();
          onStart(routine);
        }}
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '14px',
          ...(isCustom ? {} : { color: '#10B981', borderColor: '#232733' }),
        }}
      >
        <Play size={16} fill={isCustom ? '#0D0E12' : 'none'} />
        <span>{isCustom ? 'Start Workout with this Plan' : 'Start Routine'}</span>
      </button>
    </div>
  );
};

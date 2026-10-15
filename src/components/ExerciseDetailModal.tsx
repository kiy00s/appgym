import React from 'react';
import { X, Trash2, Dumbbell } from 'lucide-react';
import { getExerciseById, getExerciseStats, deleteCustomExercise } from '../db/storage';
import { formatWorkoutDate } from '../utils/calculations';
import { useWorkout } from '../context/WorkoutContext';

interface ExerciseDetailModalProps {
  exerciseId: number | null;
  onClose: () => void;
  onStartWorkoutWithExercise: (exerciseId: number) => void;
  onDeleted?: () => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exerciseId,
  onClose,
  onStartWorkoutWithExercise,
  onDeleted,
}) => {
  const { activeWorkout, addExercise } = useWorkout();

  if (exerciseId === null) return null;

  const exercise = getExerciseById(exerciseId);
  if (!exercise) return null;

  const stats = getExerciseStats(exerciseId);

  const handleDelete = () => {
    if (!exercise.isCustom) return;
    if (confirm(`Are you sure you want to delete exercise "${exercise.name}"?`)) {
      deleteCustomExercise(exercise.id);
      if (onDeleted) onDeleted();
      onClose();
    }
  };

  const handleAction = () => {
    if (activeWorkout) {
      addExercise(exercise.id);
      onClose();
    } else {
      onStartWorkoutWithExercise(exercise.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-header">
        <button
          type="button"
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#F3F4F6', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>
        <h2 style={{ fontSize: '17px', fontWeight: 800 }}>Exercise Details</h2>
        {exercise.isCustom ? (
          <button
            type="button"
            onClick={handleDelete}
            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
          >
            <Trash2 size={20} />
          </button>
        ) : (
          <div style={{ width: '24px' }}></div>
        )}
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Header Card */}
        <div className="card">
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#F3F4F6', marginBottom: '8px' }}>
            {exercise.name}
          </div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
            <span className="badge-pill">{exercise.category}</span>
            <span className="badge-pill">{exercise.equipment}</span>
            {exercise.isCustom && (
              <span
                className="badge-pill"
                style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}
              >
                Custom
              </span>
            )}
          </div>

          {exercise.notes && (
            <div
              style={{
                fontSize: '13px',
                color: '#9CA3AF',
                backgroundColor: '#16181F',
                padding: '10px 12px',
                borderRadius: '8px',
                marginBottom: '16px',
              }}
            >
              💡 {exercise.notes}
            </div>
          )}

          {/* Stats Grid */}
          <div
            style={{
              display: 'flex',
              backgroundColor: '#16181F',
              borderRadius: '10px',
              padding: '12px 6px',
              marginBottom: '16px',
            }}
          >
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#F3F4F6' }}>
                {stats.personalRecord > 0 ? `${stats.personalRecord} kg` : '—'}
              </div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#6B7280', marginTop: '4px', letterSpacing: '0.5px' }}>
                RECORD (PR)
              </div>
            </div>

            <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid #232733', borderRight: '1px solid #232733' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#10B981' }}>
                {stats.estimated1RMMax > 0 ? `${stats.estimated1RMMax} kg` : '—'}
              </div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#6B7280', marginTop: '4px', letterSpacing: '0.5px' }}>
                EST. 1RM
              </div>
            </div>

            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#F3F4F6' }}>
                {stats.totalWorkouts}
              </div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#6B7280', marginTop: '4px', letterSpacing: '0.5px' }}>
                SESSIONS
              </div>
            </div>
          </div>

          {/* Action button */}
          <button type="button" className="btn-primary" onClick={handleAction} style={{ width: '100%' }}>
            <Dumbbell size={18} />
            {activeWorkout ? 'Add to Active Workout' : 'Start Workout with this Exercise'}
          </button>
        </div>

        {/* History Timeline */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '12px' }}>
            Exercise History
          </h3>

          {stats.history.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {stats.history.map((entry, idx) => (
                <div key={idx} className="card" style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#F3F4F6' }}>
                        {formatWorkoutDate(entry.date)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                        {entry.workoutTitle}
                      </div>
                    </div>
                    <span
                      style={{
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        color: '#10B981',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 800,
                      }}
                    >
                      Max: {entry.maxWeight} kg
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '8px 0' }}>
                    {entry.sets.map((s, sIdx) => (
                      <span
                        key={sIdx}
                        style={{
                          backgroundColor: '#16181F',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: '#F3F4F6',
                        }}
                      >
                        {s.weight}kg × {s.reps}
                      </span>
                    ))}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #232733',
                      paddingTop: '8px',
                      fontSize: '11px',
                      color: '#6B7280',
                      fontWeight: 600,
                    }}
                  >
                    <span>1RM: ~{entry.estimated1RM} kg</span>
                    <span>Volume: {entry.totalVolume} kg</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px 20px', color: '#6B7280' }}>
              <Dumbbell size={36} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#F3F4F6', marginBottom: '4px' }}>
                No logged sets
              </p>
              <p style={{ fontSize: '13px' }}>
                Perform this exercise in an upcoming workout to track your history and records here!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

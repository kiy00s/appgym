import React from 'react';
import { X, Trash2, Clock, Dumbbell, Layers } from 'lucide-react';
import { getWorkoutById, deleteWorkout } from '../db/storage';
import { formatWorkoutDate, formatDuration, calculateVolume, calculate1RM } from '../utils/calculations';

interface WorkoutDetailModalProps {
  workoutId: number | null;
  onClose: () => void;
  onDeleted?: () => void;
  onSelectExercise: (exerciseId: number) => void;
}

export const WorkoutDetailModal: React.FC<WorkoutDetailModalProps> = ({
  workoutId,
  onClose,
  onDeleted,
  onSelectExercise,
}) => {
  if (workoutId === null) return null;

  const workout = getWorkoutById(workoutId);
  if (!workout) return null;

  const allSets = workout.exercises?.flatMap((e) => e.sets) ?? [];
  const completedSets = allSets.filter((s) => s.isCompleted);
  const totalVolume = calculateVolume(allSets);

  const durationSec = workout.endTime
    ? Math.max(
        0,
        Math.floor(
          (new Date(workout.endTime).getTime() - new Date(workout.startTime).getTime()) / 1000
        )
      )
    : 0;

  const handleDelete = () => {
    if (confirm('Czy na pewno chcesz trwale usunąć ten trening z historii?')) {
      deleteWorkout(workout.id);
      if (onDeleted) onDeleted();
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
        <h2 style={{ fontSize: '17px', fontWeight: 800 }}>Szczegóły treningu</h2>
        <button
          type="button"
          onClick={handleDelete}
          style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Header Summary Card */}
        <div className="card">
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#F3F4F6', marginBottom: '4px' }}>
            {workout.title}
          </div>
          <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px' }}>
            {formatWorkoutDate(workout.startTime)}
          </div>

          <div
            style={{
              display: 'flex',
              backgroundColor: '#16181F',
              borderRadius: '10px',
              padding: '12px 6px',
            }}
          >
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '16px', fontWeight: 800, color: '#F3F4F6' }}>
                <Clock size={16} color="#9CA3AF" />
                {durationSec > 0 ? formatDuration(durationSec) : '< 1m'}
              </div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#6B7280', marginTop: '4px' }}>
                CZAS
              </div>
            </div>

            <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid #232733', borderRight: '1px solid #232733' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '16px', fontWeight: 800, color: '#10B981' }}>
                <Dumbbell size={16} color="#10B981" />
                {totalVolume} kg
              </div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#6B7280', marginTop: '4px' }}>
                TONAŻ
              </div>
            </div>

            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '16px', fontWeight: 800, color: '#06B6D4' }}>
                <Layers size={16} color="#06B6D4" />
                {completedSets.length}
              </div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#6B7280', marginTop: '4px' }}>
                SERII
              </div>
            </div>
          </div>

          {workout.notes && (
            <div
              style={{
                marginTop: '14px',
                paddingTop: '12px',
                borderTop: '1px solid #232733',
                fontSize: '13px',
                color: '#9CA3AF',
              }}
            >
              <strong style={{ color: '#F3F4F6' }}>Notatki:</strong> {workout.notes}
            </div>
          )}
        </div>

        {/* Exercises */}
        <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Wykonane ćwiczenia</h3>

        {workout.exercises && workout.exercises.length > 0 ? (
          workout.exercises.map((item, idx) => (
            <div key={item.id ?? idx} className="card" style={{ padding: '14px' }}>
              <div
                onClick={() => onSelectExercise(item.exercise.id)}
                style={{ cursor: 'pointer', marginBottom: '10px' }}
              >
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#F3F4F6' }}>
                  {item.exercise.name}
                </div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                  {item.exercise.category} • {item.exercise.equipment}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#16181F',
                  borderRadius: '8px',
                  padding: '8px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    borderBottom: '1px solid #232733',
                    paddingBottom: '6px',
                    marginBottom: '6px',
                    fontSize: '10px',
                    fontWeight: 800,
                    color: '#6B7280',
                  }}
                >
                  <div style={{ width: '40px', textAlign: 'center' }}>SERIA</div>
                  <div style={{ flex: 1, textAlign: 'center' }}>CIĘŻAR</div>
                  <div style={{ flex: 1, textAlign: 'center' }}>POWT</div>
                  <div style={{ flex: 1, textAlign: 'center' }}>1RM</div>
                </div>

                {item.sets.map((s) => {
                  const e1rm = calculate1RM(s.weight, s.reps);
                  return (
                    <div
                      key={s.id}
                      style={{
                        display: 'flex',
                        padding: '4px 0',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#F3F4F6',
                      }}
                    >
                      <div style={{ width: '40px', textAlign: 'center', color: '#9CA3AF' }}>
                        {s.setType !== 'normal'
                          ? s.setType === 'warmup'
                            ? 'W'
                            : s.setType === 'drop'
                            ? 'D'
                            : 'F'
                          : s.setNumber}
                      </div>
                      <div style={{ flex: 1, textAlign: 'center' }}>{s.weight} kg</div>
                      <div style={{ flex: 1, textAlign: 'center' }}>{s.reps}</div>
                      <div style={{ flex: 1, textAlign: 'center', color: '#10B981' }}>
                        {e1rm > 0 ? `${e1rm} kg` : '—'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', color: '#6B7280', padding: '20px' }}>
            Brak zarejestrowanych ćwiczeń
          </div>
        )}
      </div>
    </div>
  );
};

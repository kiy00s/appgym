import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { getCompletedWorkouts } from '../../db/storage';
import { formatWorkoutDate } from '../../utils/calculations';

interface HistoryTabProps {
  onSelectWorkout: (workoutId: number) => void;
  onStartWorkout: () => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  onSelectWorkout,
  onStartWorkout,
}) => {
  const completedWorkouts = getCompletedWorkouts();

  return (
    <div>
      <h2
        style={{
          fontSize: '15px',
          fontWeight: 800,
          color: '#9CA3AF',
          marginBottom: '12px',
        }}
      >
        WORKOUT HISTORY ({completedWorkouts.length})
      </h2>

      {completedWorkouts.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {completedWorkouts.map((w) => {
            const allSets = w.exercises?.flatMap((e) => e.sets) || [];
            const completedSets = allSets.filter((s) => s.isCompleted);
            const totalVolume = allSets.reduce(
              (sum, s) => sum + (s.isCompleted ? (s.weight || 0) * (s.reps || 0) : 0),
              0
            );

            return (
              <div
                key={w.id}
                className="card"
                onClick={() => onSelectWorkout(w.id)}
                style={{ cursor: 'pointer', margin: 0 }}
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
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#F3F4F6' }}>
                      {w.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                      {formatWorkoutDate(w.startTime)}
                    </div>
                  </div>
                  <ChevronRight size={18} color="#6B7280" />
                </div>

                {/* Stat badges */}
                <div style={{ display: 'flex', gap: '8px', margin: '10px 0' }}>
                  <span
                    className="badge-pill"
                    style={{
                      color: '#10B981',
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    }}
                  >
                    🏋️ {Math.round(totalVolume)} kg
                  </span>
                  <span
                    className="badge-pill"
                    style={{
                      color: '#06B6D4',
                      backgroundColor: 'rgba(6, 182, 212, 0.15)',
                    }}
                  >
                    📊 {completedSets.length} sets
                  </span>
                </div>

                {/* Exercises names */}
                {w.exercises && w.exercises.length > 0 && (
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#9CA3AF',
                      lineHeight: '1.4',
                      borderTop: '1px solid #232733',
                      paddingTop: '8px',
                    }}
                  >
                    {w.exercises.map((e) => e.exercise.name).join(' • ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: '#6B7280' }}>
          <Calendar size={48} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <p
            style={{
              fontSize: '17px',
              fontWeight: 800,
              color: '#F3F4F6',
              marginBottom: '6px',
            }}
          >
            No workouts recorded
          </p>
          <p style={{ fontSize: '13px', marginBottom: '16px' }}>
            Once you complete your first workout, your full history and stats will appear
            here.
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={onStartWorkout}
            style={{ margin: '0 auto' }}
          >
            Start First Workout
          </button>
        </div>
      )}
    </div>
  );
};

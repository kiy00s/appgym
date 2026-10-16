import React from 'react';
import {
  Play,
  Trophy,
  Activity,
  Calendar,
  Layers,
  Plus,
  ChevronRight,
} from 'lucide-react';
import { WorkoutSession, WorkoutRoutine } from '../../types/workout';
import { getDashboardStats, getCompletedWorkouts, getRoutines } from '../../db/storage';
import { formatRelativeDate } from '../../utils/calculations';

interface WorkoutTabProps {
  activeWorkout: WorkoutSession | null;
  onResumeWorkout: () => void;
  onStartEmptyWorkout: () => void;
  onStartRoutine: (routine: WorkoutRoutine) => void;
  onNavigateToRoutines: () => void;
  onSelectWorkout: (workoutId: number) => void;
}

export const WorkoutTab: React.FC<WorkoutTabProps> = ({
  activeWorkout,
  onResumeWorkout,
  onStartEmptyWorkout,
  onStartRoutine,
  onNavigateToRoutines,
  onSelectWorkout,
}) => {
  const stats = getDashboardStats();
  const completedWorkouts = getCompletedWorkouts();
  const lastWorkout = completedWorkouts[0];
  const quickRoutines = getRoutines().slice(0, 4);

  return (
    <div>
      {/* Active workout banner */}
      {activeWorkout && (
        <div className="active-banner" onClick={onResumeWorkout}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="pulsing-dot" />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#10B981',
                  letterSpacing: '0.8px',
                }}
              >
                WORKOUT IN PROGRESS
              </span>
            </div>
          </div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#F3F4F6',
              marginBottom: '2px',
            }}
          >
            {activeWorkout.title}
          </div>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
            {activeWorkout.exercises?.length ?? 0} exercises in session • Tap to resume
          </div>
        </div>
      )}

      {/* Quick Start Action */}
      <div style={{ marginBottom: '20px' }}>
        <h2
          style={{
            fontSize: '15px',
            fontWeight: 800,
            color: '#9CA3AF',
            marginBottom: '10px',
          }}
        >
          QUICK START
        </h2>
        <button
          type="button"
          className="btn-primary"
          onClick={onStartEmptyWorkout}
          style={{ width: '100%', padding: '16px' }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '6px',
            }}
          >
            <Play size={20} fill="#0D0E12" />
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: '16px', fontWeight: 800 }}>Start Empty Workout</div>
            <div style={{ fontSize: '12px', opacity: 0.8, fontWeight: 500 }}>
              Add exercises and log sets on the fly
            </div>
          </div>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Summary Stats */}
      <div style={{ marginBottom: '20px' }}>
        <h2
          style={{
            fontSize: '15px',
            fontWeight: 800,
            color: '#9CA3AF',
            marginBottom: '10px',
          }}
        >
          SUMMARY
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <div className="card" style={{ padding: '14px 10px', textAlign: 'center', margin: 0 }}>
            <Trophy size={20} color="#10B981" style={{ margin: '0 auto 6px' }} />
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#F3F4F6' }}>
              {stats.totalWorkouts}
            </div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#6B7280', marginTop: '2px' }}>
              Workouts
            </div>
          </div>

          <div className="card" style={{ padding: '14px 10px', textAlign: 'center', margin: 0 }}>
            <Activity size={20} color="#06B6D4" style={{ margin: '0 auto 6px' }} />
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#F3F4F6' }}>
              {stats.totalVolumeKg >= 1000
                ? `${(stats.totalVolumeKg / 1000).toFixed(1)} t`
                : `${stats.totalVolumeKg} kg`}
            </div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#6B7280', marginTop: '2px' }}>
              Volume
            </div>
          </div>

          <div className="card" style={{ padding: '14px 10px', textAlign: 'center', margin: 0 }}>
            <Calendar size={20} color="#EC4899" style={{ margin: '0 auto 6px' }} />
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#F3F4F6' }}>
              {stats.workoutsThisMonth}
            </div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#6B7280', marginTop: '2px' }}>
              This Month
            </div>
          </div>
        </div>
      </div>

      {/* Quick Routines Section */}
      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#9CA3AF' }}>
            WORKOUT ROUTINES
          </h2>
          <button
            type="button"
            onClick={onNavigateToRoutines}
            style={{
              background: 'none',
              border: 'none',
              color: '#10B981',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Manage Plans →
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {quickRoutines.map((routine) => (
            <div
              key={routine.id}
              className="card"
              onClick={() => onStartRoutine(routine)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px',
                cursor: 'pointer',
                margin: 0,
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#20242D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px',
                  flexShrink: 0,
                  color: routine.isCustom ? '#10B981' : '#06B6D4',
                }}
              >
                <Layers size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 800,
                      color: '#F3F4F6',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {routine.title}
                  </div>
                  {routine.isCustom && (
                    <span
                      className="badge-pill"
                      style={{
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        color: '#10B981',
                        fontSize: '9px',
                        padding: '2px 6px',
                      }}
                    >
                      Custom
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#6B7280',
                    marginTop: '2px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {routine.exerciseIds.length} exercises • Tap to start
                </div>
              </div>
              <Plus size={20} color="#10B981" />
            </div>
          ))}
        </div>
      </div>

      {/* Last workout preview */}
      {lastWorkout && (
        <div>
          <h2
            style={{
              fontSize: '15px',
              fontWeight: 800,
              color: '#9CA3AF',
              marginBottom: '10px',
            }}
          >
            RECENT WORKOUT
          </h2>
          <div
            className="card"
            onClick={() => onSelectWorkout(lastWorkout.id)}
            style={{ cursor: 'pointer' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#F3F4F6' }}>
                {lastWorkout.title}
              </div>
              <ChevronRight size={18} color="#6B7280" />
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '10px' }}>
              {formatRelativeDate(lastWorkout.startTime)}
            </div>

            <div
              style={{
                display: 'flex',
                backgroundColor: '#16181F',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#F3F4F6',
              }}
            >
              <div style={{ flex: 1, textAlign: 'center' }}>
                {lastWorkout.exercises?.length ?? 0} exercises
              </div>
              <div style={{ width: '1px', backgroundColor: '#232733' }} />
              <div style={{ flex: 1, textAlign: 'center' }}>
                {lastWorkout.exercises?.flatMap((e) => e.sets).filter((s) => s.isCompleted)
                  .length ?? 0}{' '}
                sets completed
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

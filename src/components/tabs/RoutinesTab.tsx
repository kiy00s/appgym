import React from 'react';
import { Plus, Layers } from 'lucide-react';
import { WorkoutRoutine } from '../../types/workout';
import { getCustomRoutines, getDefaultRoutines, getExercises } from '../../db/storage';
import { RoutineCard } from '../RoutineCard';

interface RoutinesTabProps {
  onOpenNewRoutine: () => void;
  onOpenEditRoutine: (routineId: string) => void;
  onDeleteRoutine: (routineId: string, title: string) => void;
  onStartRoutine: (routine: WorkoutRoutine) => void;
}

export const RoutinesTab: React.FC<RoutinesTabProps> = ({
  onOpenNewRoutine,
  onOpenEditRoutine,
  onDeleteRoutine,
  onStartRoutine,
}) => {
  const customRoutines = getCustomRoutines();
  const defaultRoutines = getDefaultRoutines();
  const allExercises = getExercises();

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#F3F4F6' }}>
            Workout Plans
          </h2>
          <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
            Create custom routines or pick standard routines
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenNewRoutine}
          className="btn-primary"
          style={{ padding: '8px 14px', fontSize: '13px', borderRadius: '10px' }}
        >
          <Plus size={16} /> New Plan
        </button>
      </div>

      {/* Custom Routines Section */}
      <div style={{ marginBottom: '24px' }}>
        <h3
          style={{
            fontSize: '13px',
            fontWeight: 800,
            color: '#9CA3AF',
            letterSpacing: '0.5px',
            marginBottom: '10px',
          }}
        >
          MY CUSTOM PLANS ({customRoutines.length})
        </h3>

        {customRoutines.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {customRoutines.map((routine) => (
              <RoutineCard
                key={routine.id}
                routine={routine}
                exercises={allExercises}
                onStart={onStartRoutine}
                onEdit={onOpenEditRoutine}
                onDelete={onDeleteRoutine}
              />
            ))}
          </div>
        ) : (
          <div
            onClick={onOpenNewRoutine}
            style={{
              border: '1.5px dashed #282C37',
              borderRadius: '14px',
              padding: '24px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: 'rgba(22, 24, 31, 0.4)',
            }}
          >
            <Layers
              size={32}
              style={{ margin: '0 auto 8px', color: '#10B981', opacity: 0.8 }}
            />
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#F3F4F6' }}>
              Create Your First Workout Plan
            </div>
            <div
              style={{
                fontSize: '12px',
                color: '#9CA3AF',
                marginTop: '4px',
                marginBottom: '12px',
              }}
            >
              Build custom routines with your favorite exercises and target order.
            </div>
            <button
              type="button"
              className="btn-secondary"
              style={{ margin: '0 auto', fontSize: '12px' }}
              onClick={(e) => {
                e.stopPropagation();
                onOpenNewRoutine();
              }}
            >
              <Plus size={15} color="#10B981" /> Create Plan
            </button>
          </div>
        )}
      </div>

      {/* Default Routines Section */}
      <div>
        <h3
          style={{
            fontSize: '13px',
            fontWeight: 800,
            color: '#9CA3AF',
            letterSpacing: '0.5px',
            marginBottom: '10px',
          }}
        >
          STANDARD PRESETS ({defaultRoutines.length})
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {defaultRoutines.map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              exercises={allExercises}
              onStart={onStartRoutine}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

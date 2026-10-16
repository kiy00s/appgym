import React, { useState } from 'react';
import { X, Layers, Search, Play, Dumbbell } from 'lucide-react';
import { WorkoutRoutine } from '../types/workout';
import { getRoutines, getExercises } from '../db/storage';
import { getRoutineExerciseNames, getTotalRoutineSets } from '../utils/routineUtils';

interface RoutinePickerModalProps {
  isOpen: boolean;
  currentRoutineId?: string;
  onClose: () => void;
  onSelectRoutine: (routine: WorkoutRoutine) => void;
}

export const RoutinePickerModal: React.FC<RoutinePickerModalProps> = ({
  isOpen,
  currentRoutineId,
  onClose,
  onSelectRoutine,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const allRoutines = getRoutines();
  const allExercises = getExercises();

  const filteredRoutines = allRoutines.filter((r) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    const titleMatch = r.title.toLowerCase().includes(query);
    const descMatch = r.description?.toLowerCase().includes(query) ?? false;
    const exMatch = r.exerciseIds.some((id) =>
      allExercises.find((e) => e.id === id)?.name.toLowerCase().includes(query)
    );
    return titleMatch || descMatch || exMatch;
  });

  return (
    <div className="modal-overlay" style={{ zIndex: 140 }}>
      {/* Header */}
      <div className="modal-header">
        <button
          type="button"
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#F3F4F6', cursor: 'pointer', padding: '4px' }}
        >
          <X size={24} />
        </button>
        <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#F3F4F6' }}>Select Workout Plan</h2>
        <div style={{ width: '32px' }} />
      </div>

      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Search Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#16181F',
            border: '1px solid #232733',
            borderRadius: '10px',
            padding: '10px 14px',
            gap: '8px',
            marginBottom: '16px',
          }}
        >
          <Search size={18} color="#6B7280" />
          <input
            type="text"
            placeholder="Search plans or exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              color: '#F3F4F6',
              fontSize: '14px',
              outline: 'none',
              width: '100%',
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Routines List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
          {filteredRoutines.length > 0 ? (
            filteredRoutines.map((routine) => {
              const isCurrent = routine.id === currentRoutineId;
              return (
                <div
                  key={routine.id}
                  className="card"
                  onClick={() => {
                    onSelectRoutine(routine);
                    onClose();
                  }}
                  style={{
                    margin: 0,
                    padding: '16px',
                    cursor: 'pointer',
                    border: isCurrent ? '1.5px solid #10B981' : '1px solid #282C37',
                    backgroundColor: isCurrent ? 'rgba(16, 185, 129, 0.05)' : '#191C24',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#F3F4F6' }}>
                          {routine.title}
                        </h4>
                        <span
                          className="badge-pill"
                          style={{
                            backgroundColor: routine.isCustom ? 'rgba(16, 185, 129, 0.15)' : '#20242D',
                            color: routine.isCustom ? '#10B981' : '#9CA3AF',
                            fontSize: '10px',
                          }}
                        >
                          {routine.isCustom ? 'Custom' : 'Preset'}
                        </span>
                        {isCurrent && (
                          <span
                            className="badge-pill"
                            style={{ backgroundColor: '#10B981', color: '#0D0E12', fontSize: '10px' }}
                          >
                            Active
                          </span>
                        )}
                      </div>
                      {routine.description && (
                        <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '3px' }}>
                          {routine.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Exercises list preview */}
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#6B7280',
                      lineHeight: '1.4',
                      margin: '10px 0 12px',
                      backgroundColor: '#16181F',
                      padding: '8px 10px',
                      borderRadius: '8px',
                    }}
                  >
                    <strong>{routine.exerciseIds.length} exercises • {getTotalRoutineSets(routine)} sets:</strong>{' '}
                    {getRoutineExerciseNames(routine)}
                  </div>

                  <button
                    type="button"
                    className="btn-primary"
                    style={{ width: '100%', padding: '9px', fontSize: '13px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRoutine(routine);
                      onClose();
                    }}
                  >
                    <Play size={15} fill="#0D0E12" /> Apply this Plan to Workout
                  </button>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6B7280' }}>
              <Layers size={40} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#F3F4F6' }}>
                No matching plans found
              </div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>
                Try searching with a different term.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

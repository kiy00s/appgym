import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ArrowUp, ArrowDown, Dumbbell } from 'lucide-react';
import { WorkoutRoutine } from '../types/workout';
import { getExercises, getRoutineById, saveCustomRoutine } from '../db/storage';
import { ExercisePickerModal } from './ExercisePickerModal';

interface CreateRoutineModalProps {
  isOpen: boolean;
  routineId?: string | null;
  onClose: () => void;
  onSaved: (routine: WorkoutRoutine) => void;
  onOpenCreateExercise?: () => void;
}

export const CreateRoutineModal: React.FC<CreateRoutineModalProps> = ({
  isOpen,
  routineId,
  onClose,
  onSaved,
  onOpenCreateExercise,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [exerciseIds, setExerciseIds] = useState<number[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  useEffect(() => {
    if (routineId) {
      const routine = getRoutineById(routineId);
      if (routine) {
        setTitle(routine.title);
        setDescription(routine.description || '');
        setExerciseIds(routine.exerciseIds || []);
        return;
      }
    }
    // New routine default
    setTitle('');
    setDescription('');
    setExerciseIds([]);
  }, [routineId, isOpen]);

  if (!isOpen) return null;

  const allExercises = getExercises();
  const selectedExercises = exerciseIds
    .map((id) => allExercises.find((e) => e.id === id))
    .filter((e): e is NonNullable<typeof e> => !!e);

  const handleAddExercise = (exerciseId: number) => {
    if (!exerciseIds.includes(exerciseId)) {
      setExerciseIds([...exerciseIds, exerciseId]);
    }
  };

  const handleRemoveExercise = (exerciseId: number) => {
    setExerciseIds(exerciseIds.filter((id) => id !== exerciseId));
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const next = [...exerciseIds];
    const temp = next[index];
    next[index] = next[index - 1];
    next[index - 1] = temp;
    setExerciseIds(next);
  };

  const handleMoveDown = (index: number) => {
    if (index >= exerciseIds.length - 1) return;
    const next = [...exerciseIds];
    const temp = next[index];
    next[index] = next[index + 1];
    next[index + 1] = temp;
    setExerciseIds(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a routine name');
      return;
    }
    if (exerciseIds.length === 0) {
      alert('Please add at least one exercise to the routine');
      return;
    }

    const saved = saveCustomRoutine({
      id: routineId || undefined,
      title: title.trim(),
      description: description.trim() || undefined,
      exerciseIds,
    });

    onSaved(saved);
    onClose();
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-header">
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#F3F4F6', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
          <h2 style={{ fontSize: '17px', fontWeight: 800 }}>
            {routineId ? 'Edit Routine' : 'New Routine'}
          </h2>
          <div style={{ width: '24px' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
          {/* Routine Name */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#9CA3AF', marginBottom: '8px' }}>
              Routine Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Upper Body Power, Chest & Arms..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#16181F',
                border: '1px solid #232733',
                borderRadius: '10px',
                padding: '12px 14px',
                fontSize: '15px',
                color: '#F3F4F6',
                outline: 'none',
              }}
            />
          </div>

          {/* Routine Description */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#9CA3AF', marginBottom: '8px' }}>
              Description / Notes (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 4x a week split, focused on progressive overload"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#16181F',
                border: '1px solid #232733',
                borderRadius: '10px',
                padding: '12px 14px',
                fontSize: '14px',
                color: '#F3F4F6',
                outline: 'none',
              }}
            />
          </div>

          {/* Exercise List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label style={{ fontSize: '14px', fontWeight: 800, color: '#F3F4F6' }}>
                Exercises ({exerciseIds.length})
              </label>
              <button
                type="button"
                onClick={() => setIsPickerOpen(true)}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                <Plus size={15} color="#10B981" /> Add Exercises
              </button>
            </div>

            {selectedExercises.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedExercises.map((ex, idx) => (
                  <div
                    key={ex.id}
                    className="card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      margin: 0,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          backgroundColor: '#20242D',
                          color: '#9CA3AF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        {idx + 1}
                      </span>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#F3F4F6' }}>
                          {ex.name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                          {ex.category} • {ex.equipment}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveUp(idx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: idx === 0 ? '#374151' : '#9CA3AF',
                          padding: '4px',
                          cursor: idx === 0 ? 'default' : 'pointer',
                        }}
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === selectedExercises.length - 1}
                        onClick={() => handleMoveDown(idx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: idx === selectedExercises.length - 1 ? '#374151' : '#9CA3AF',
                          padding: '4px',
                          cursor: idx === selectedExercises.length - 1 ? 'default' : 'pointer',
                        }}
                      >
                        <ArrowDown size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(ex.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#EF4444',
                          padding: '4px',
                          cursor: 'pointer',
                          marginLeft: '4px',
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                onClick={() => setIsPickerOpen(true)}
                style={{
                  border: '1.5px dashed #282C37',
                  borderRadius: '12px',
                  padding: '30px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(22, 24, 31, 0.4)',
                }}
              >
                <Dumbbell size={32} style={{ margin: '0 auto 8px', color: '#6B7280', opacity: 0.5 }} />
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#F3F4F6' }}>
                  No exercises added yet
                </div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                  Tap here to select exercises for this routine
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Save Routine
            </button>
          </div>
        </form>
      </div>

      <ExercisePickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelectExercise={(id) => handleAddExercise(id)}
        onOpenCreateNew={() => {
          setIsPickerOpen(false);
          if (onOpenCreateExercise) onOpenCreateExercise();
        }}
      />
    </>
  );
};

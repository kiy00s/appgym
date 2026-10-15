import React, { useState } from 'react';
import { ChevronDown, Plus, Edit2, Check, Dumbbell, Trophy } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { WorkoutExerciseCard } from './WorkoutExerciseCard';
import { calculateVolume } from '../utils/calculations';

interface ActiveWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenExercisePicker: () => void;
  onSelectExercise: (exerciseId: number) => void;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({
  isOpen,
  onClose,
  onOpenExercisePicker,
  onSelectExercise,
}) => {
  const { activeWorkout, updateTitle, finishWorkout, cancelWorkout } = useWorkout();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(activeWorkout?.title ?? 'Workout');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState('');

  if (!isOpen || !activeWorkout) return null;

  const allSets = activeWorkout.exercises?.flatMap((e) => e.sets) ?? [];
  const completedSets = allSets.filter((s) => s.isCompleted);
  const currentVolume = calculateVolume(allSets);

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      updateTitle(editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleFinishPrompt = () => {
    if (completedSets.length === 0) {
      if (!confirm('No sets completed. Are you sure you want to finish the workout?')) {
        return;
      }
    }
    setShowNotesModal(true);
  };

  const handleConfirmFinish = () => {
    setShowNotesModal(false);
    finishWorkout(notes);
    onClose();
  };

  const handleCancelPrompt = () => {
    if (confirm('Are you sure you want to cancel and delete this workout?')) {
      cancelWorkout();
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      {/* Top Header */}
      <div className="modal-header">
        <button
          type="button"
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#F3F4F6', cursor: 'pointer', padding: '4px' }}
        >
          <ChevronDown size={28} />
        </button>

        <div style={{ flex: 1, textAlign: 'center', margin: '0 8px' }}>
          {isEditingTitle ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <input
                type="text"
                autoFocus
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                style={{
                  backgroundColor: '#20242D',
                  color: '#F3F4F6',
                  border: '1px solid #10B981',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '15px',
                  fontWeight: 700,
                  textAlign: 'center',
                }}
              />
              <button
                type="button"
                onClick={handleSaveTitle}
                style={{ background: 'none', border: 'none', color: '#10B981', cursor: 'pointer' }}
              >
                <Check size={20} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => {
                setEditedTitle(activeWorkout.title);
                setIsEditingTitle(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#F3F4F6' }}>
                {activeWorkout.title}
              </span>
              <Edit2 size={13} color="#6B7280" />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={handleCancelPrompt}
            title="Cancel Workout"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: '#EF4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '7px 11px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleFinishPrompt}
            style={{
              backgroundColor: '#10B981',
              color: '#0D0E12',
              border: 'none',
              borderRadius: '8px',
              padding: '7px 13px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Finish
          </button>
        </div>
      </div>

      {/* Live Summary Bar (Volume & Sets) */}
      <div
        style={{
          display: 'flex',
          backgroundColor: '#16181F',
          padding: '12px 16px',
          borderBottom: '1px solid #232733',
        }}
      >
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '17px', fontWeight: 800, color: '#F3F4F6' }}>
            {currentVolume} kg
          </div>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#6B7280', marginTop: '2px', letterSpacing: '0.5px' }}>
            TOTAL VOLUME
          </div>
        </div>

        <div style={{ width: '1px', backgroundColor: '#232733' }} />

        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '17px', fontWeight: 800, color: '#10B981' }}>
            {completedSets.length}/{allSets.length}
          </div>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#6B7280', marginTop: '2px', letterSpacing: '0.5px' }}>
            SETS COMPLETED
          </div>
        </div>
      </div>

      {/* Exercises List */}
      <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
        {activeWorkout.exercises && activeWorkout.exercises.length > 0 ? (
          activeWorkout.exercises.map((item) => (
            <WorkoutExerciseCard
              key={item.id}
              item={item}
              onSelectExercise={onSelectExercise}
            />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6B7280' }}>
            <Dumbbell size={48} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p style={{ fontSize: '17px', fontWeight: 800, color: '#F3F4F6', marginBottom: '6px' }}>
              Workout is empty
            </p>
            <p style={{ fontSize: '13px' }}>
              Tap the button below to add your first exercise.
            </p>
          </div>
        )}

        {/* Buttons */}
        <button
          type="button"
          className="btn-primary"
          onClick={onOpenExercisePicker}
          style={{ width: '100%', marginTop: '10px' }}
        >
          <Plus size={20} /> Add Exercise
        </button>

        <button
          type="button"
          onClick={handleCancelPrompt}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            color: '#EF4444',
            padding: '14px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: '8px',
          }}
        >
          Cancel and delete this workout
        </button>
      </div>

      {/* Notes Modal upon finishing */}
      {showNotesModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#191C24',
              border: '1px solid #282C37',
              borderRadius: '16px',
              padding: '24px 20px',
              maxWidth: '400px',
              width: '100%',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Trophy size={40} color="#10B981" style={{ margin: '0 auto 10px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#F3F4F6' }}>
                Great workout!
              </h3>
              <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>
                Completed {completedSets.length} sets • {currentVolume} kg total volume
              </p>
            </div>

            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#9CA3AF', marginBottom: '8px' }}>
              Workout notes (optional):
            </label>
            <textarea
              rows={3}
              placeholder="How did it go? Weights, energy, recovery..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#16181F',
                border: '1px solid #232733',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '14px',
                color: '#F3F4F6',
                outline: 'none',
                resize: 'none',
                marginBottom: '16px',
              }}
            />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setShowNotesModal(false)}
              >
                Back
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{ flex: 1.5 }}
                onClick={handleConfirmFinish}
              >
                Save Workout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

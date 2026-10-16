import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, Edit2, Check, Dumbbell, Trophy, Layers, X } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { WorkoutExerciseCard } from './WorkoutExerciseCard';
import { RoutinePickerModal } from './RoutinePickerModal';
import { calculateVolume } from '../utils/calculations';
import { getRoutineById } from '../db/storage';

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
  const {
    activeWorkout,
    updateTitle,
    finishWorkout,
    cancelWorkout,
    applyRoutineToActiveWorkout,
  } = useWorkout();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(activeWorkout?.title ?? 'Workout');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [isRoutinePickerOpen, setIsRoutinePickerOpen] = useState(false);

  // Reset all temporary editing states whenever workout changes or modal opens
  useEffect(() => {
    if (activeWorkout) {
      setEditedTitle(activeWorkout.title);
    }
    setIsEditingTitle(false);
    setShowNotesModal(false);
    setNotes('');
    setIsRoutinePickerOpen(false);
  }, [activeWorkout?.id, isOpen]);

  // Keep editedTitle synced with activeWorkout.title when not in active editing mode
  useEffect(() => {
    if (activeWorkout && !isEditingTitle) {
      setEditedTitle(activeWorkout.title);
    }
  }, [activeWorkout?.title, isEditingTitle]);

  if (!isOpen || !activeWorkout) return null;

  const linkedRoutine = activeWorkout.routineId ? getRoutineById(activeWorkout.routineId) : null;
  const allSets = activeWorkout.exercises?.flatMap((e) => e.sets) ?? [];
  const completedSets = allSets.filter((s) => s.isCompleted || s.reps > 0);
  const currentVolume = calculateVolume(allSets);

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      updateTitle(editedTitle.trim());
    } else if (activeWorkout) {
      setEditedTitle(activeWorkout.title);
    }
    setIsEditingTitle(false);
  };

  const handleCancelEditTitle = () => {
    if (activeWorkout) {
      setEditedTitle(activeWorkout.title);
    }
    setIsEditingTitle(false);
  };

  const handleClose = () => {
    if (activeWorkout) {
      setEditedTitle(activeWorkout.title);
    }
    setIsEditingTitle(false);
    onClose();
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
    setIsEditingTitle(false);
    finishWorkout(notes);
    onClose();
  };

  const handleCancelPrompt = () => {
    if (confirm('Are you sure you want to cancel and delete this workout?')) {
      setIsEditingTitle(false);
      setShowNotesModal(false);
      cancelWorkout();
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      {/* Top Header */}
      {isEditingTitle ? (
        <div className="modal-header" style={{ gap: '8px' }}>
          <input
            type="text"
            autoFocus
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveTitle();
              if (e.key === 'Escape') handleCancelEditTitle();
            }}
            placeholder="Workout Title"
            style={{
              flex: 1,
              minWidth: 0,
              backgroundColor: '#20242D',
              color: '#F3F4F6',
              border: '1.5px solid #10B981',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '15px',
              fontWeight: 700,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="button"
            onClick={handleSaveTitle}
            style={{
              backgroundColor: '#10B981',
              color: '#0D0E12',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              flexShrink: 0,
            }}
          >
            <Check size={16} /> Save
          </button>
          <button
            type="button"
            onClick={handleCancelEditTitle}
            style={{
              background: 'none',
              border: '1px solid #282C37',
              color: '#9CA3AF',
              borderRadius: '8px',
              padding: '8px 10px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="modal-header">
          <button
            type="button"
            onClick={handleClose}
            style={{ background: 'none', border: 'none', color: '#F3F4F6', cursor: 'pointer', padding: '4px', flexShrink: 0 }}
          >
            <ChevronDown size={28} />
          </button>

          <div
            onClick={() => {
              setEditedTitle(activeWorkout.title);
              setIsEditingTitle(true);
            }}
            style={{
              flex: 1,
              minWidth: 0,
              textAlign: 'center',
              margin: '0 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                fontSize: '16px',
                fontWeight: 800,
                color: '#F3F4F6',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {activeWorkout.title}
            </span>
            <Edit2 size={13} color="#6B7280" style={{ flexShrink: 0 }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
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
      )}

      {/* Live Summary Bar (Volume & Sets & Plan) */}
      <div
        style={{
          display: 'flex',
          backgroundColor: '#16181F',
          padding: '10px 14px',
          borderBottom: '1px solid #232733',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#F3F4F6' }}>
            {currentVolume} kg
          </div>
          <div style={{ fontSize: '9px', fontWeight: 800, color: '#6B7280', marginTop: '2px', letterSpacing: '0.5px' }}>
            VOLUME
          </div>
        </div>

        <div style={{ width: '1px', height: '22px', backgroundColor: '#232733' }} />

        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#10B981' }}>
            {completedSets.length}/{allSets.length}
          </div>
          <div style={{ fontSize: '9px', fontWeight: 800, color: '#6B7280', marginTop: '2px', letterSpacing: '0.5px' }}>
            SETS DONE
          </div>
        </div>

        <div style={{ width: '1px', height: '22px', backgroundColor: '#232733' }} />

        <div style={{ flex: 1.3, textAlign: 'center', minWidth: 0, paddingLeft: '4px' }}>
          <button
            type="button"
            onClick={() => setIsRoutinePickerOpen(true)}
            style={{
              background: linkedRoutine ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.05)',
              border: linkedRoutine ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #282C37',
              borderRadius: '7px',
              padding: '3px 8px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              maxWidth: '100%',
              boxSizing: 'border-box',
            }}
          >
            <Layers size={12} color={linkedRoutine ? '#10B981' : '#9CA3AF'} style={{ flexShrink: 0 }} />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: linkedRoutine ? '#10B981' : '#9CA3AF',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {linkedRoutine ? linkedRoutine.title : 'Select Plan'}
            </span>
          </button>
          <div style={{ fontSize: '9px', fontWeight: 800, color: '#6B7280', marginTop: '2px', letterSpacing: '0.5px' }}>
            ROUTINE
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
          <div style={{ textAlign: 'center', padding: '30px 16px', color: '#6B7280' }}>
            <Dumbbell size={44} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p style={{ fontSize: '18px', fontWeight: 800, color: '#F3F4F6', marginBottom: '6px' }}>
              Workout is empty
            </p>
            <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '20px' }}>
              Choose a workout plan to load your exercises, or add exercises manually.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setIsRoutinePickerOpen(true)}
                style={{ width: '100%', padding: '13px', fontSize: '14px' }}
              >
                <Layers size={18} /> Choose a Workout Plan
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={onOpenExercisePicker}
                style={{ width: '100%', padding: '12px', fontSize: '13px' }}
              >
                <Plus size={16} /> Add Exercise Manually
              </button>
            </div>
          </div>
        )}

        {/* Buttons when exercises exist */}
        {activeWorkout.exercises && activeWorkout.exercises.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={onOpenExercisePicker}
              style={{ flex: 1.2, padding: '12px' }}
            >
              <Plus size={18} /> Add Exercise
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsRoutinePickerOpen(true)}
              style={{ flex: 1, padding: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Layers size={16} color="#10B981" />
              <span>{activeWorkout.routineId ? 'Change Plan' : 'Select Plan'}</span>
            </button>
          </div>
        )}

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

      <RoutinePickerModal
        isOpen={isRoutinePickerOpen}
        currentRoutineId={activeWorkout.routineId}
        onClose={() => setIsRoutinePickerOpen(false)}
        onSelectRoutine={(routine) => {
          applyRoutineToActiveWorkout(routine);
        }}
      />
    </div>
  );
};

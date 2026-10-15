import React, { useState } from 'react';
import { ChevronDown, Plus, Edit2, Check, Clock, Dumbbell, Trophy } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { WorkoutExerciseCard } from './WorkoutExerciseCard';
import { formatDuration, calculateVolume } from '../utils/calculations';

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
  const { activeWorkout, workoutDuration, updateTitle, finishWorkout, cancelWorkout } = useWorkout();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(activeWorkout?.title ?? 'Trening');
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
      if (!confirm('Nie odhaczono żadnej serii. Czy na pewno chcesz zakończyć trening?')) {
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
    if (confirm('Czy na pewno chcesz anulować i usunąć ten trening?')) {
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

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#10B981',
              marginTop: '2px',
            }}
          >
            <Clock size={12} />
            <span>{formatDuration(workoutDuration)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleFinishPrompt}
          style={{
            backgroundColor: '#10B981',
            color: '#0D0E12',
            border: 'none',
            borderRadius: '8px',
            padding: '7px 14px',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          Zakończ
        </button>
      </div>

      {/* Live Summary Bar */}
      <div
        style={{
          display: 'flex',
          backgroundColor: '#16181F',
          padding: '10px 16px',
          borderBottom: '1px solid #232733',
        }}
      >
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#F3F4F6' }}>
            {formatDuration(workoutDuration)}
          </div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#6B7280', marginTop: '2px' }}>
            CZAS
          </div>
        </div>

        <div style={{ width: '1px', backgroundColor: '#232733' }} />

        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#F3F4F6' }}>
            {currentVolume} kg
          </div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#6B7280', marginTop: '2px' }}>
            TONAŻ
          </div>
        </div>

        <div style={{ width: '1px', backgroundColor: '#232733' }} />

        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#F3F4F6' }}>
            {completedSets.length}/{allSets.length}
          </div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#6B7280', marginTop: '2px' }}>
            SERIE
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
              Trening jest pusty
            </p>
            <p style={{ fontSize: '13px' }}>
              Kliknij przycisk poniżej, aby dodać pierwsze ćwiczenie do sesji.
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
          <Plus size={20} /> Dodaj ćwiczenie
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
          Anuluj i usuń ten trening
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
                Świetny trening!
              </h3>
              <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>
                Zaliczono {completedSets.length} serii • {currentVolume} kg w czasie{' '}
                {formatDuration(workoutDuration)}
              </p>
            </div>

            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#9CA3AF', marginBottom: '8px' }}>
              Notatki z treningu (opcjonalnie):
            </label>
            <textarea
              rows={3}
              placeholder="Jak poszło? Ciężary, samopoczucie, regeneracja..."
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
                Wróć
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{ flex: 1.5 }}
                onClick={handleConfirmFinish}
              >
                Zapisz trening
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

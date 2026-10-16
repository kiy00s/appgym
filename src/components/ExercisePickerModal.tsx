import React, { useState } from 'react';
import { X, Search, Plus } from 'lucide-react';
import { getExercises } from '../db/storage';
import { Exercise } from '../types/workout';
import { EXERCISE_CATEGORIES } from '../constants/defaultExercises';

interface ExercisePickerModalProps {
  isOpen: boolean;
  zIndex?: number;
  onClose: () => void;
  onSelectExercise: (exerciseId: number) => void;
  onOpenCreateNew: () => void;
}

export const ExercisePickerModal: React.FC<ExercisePickerModalProps> = ({
  isOpen,
  zIndex,
  onClose,
  onSelectExercise,
  onOpenCreateNew,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!isOpen) return null;

  const exercises = getExercises({
    search,
    category: selectedCategory,
  });

  return (
    <div className="modal-overlay" style={{ zIndex: zIndex || 110 }}>
      <div className="modal-header">
        <button
          type="button"
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#F3F4F6', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>
        <h2 style={{ fontSize: '17px', fontWeight: 800 }}>Select Exercise</h2>
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenCreateNew();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#10B981',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Plus size={16} /> New
        </button>
      </div>

      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Search Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#16181F',
            border: '1px solid #232733',
            borderRadius: '10px',
            padding: '10px 12px',
            marginBottom: '12px',
            gap: '8px',
          }}
        >
          <Search size={18} color="#6B7280" />
          <input
            type="text"
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: '#F3F4F6',
              fontSize: '15px',
              width: '100%',
            }}
          />
        </div>

        {/* Categories scroll */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '10px',
            marginBottom: '10px',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {EXERCISE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: isSelected ? 800 : 600,
                  backgroundColor: isSelected ? '#10B981' : '#16181F',
                  color: isSelected ? '#0D0E12' : '#9CA3AF',
                  border: isSelected ? '1px solid #10B981' : '1px solid #232733',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Exercises List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
          {exercises.map((ex: Exercise) => (
            <div
              key={ex.id}
              onClick={() => {
                onSelectExercise(ex.id);
                onClose();
              }}
              style={{
                backgroundColor: '#191C24',
                border: '1px solid #282C37',
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#F3F4F6', marginBottom: '4px' }}>
                  {ex.name}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span className="badge-pill">{ex.category}</span>
                  <span className="badge-pill">{ex.equipment}</span>
                  {ex.isCustom && (
                    <span
                      className="badge-pill"
                      style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}
                    >
                      Custom
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  color: '#0D0E12',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Plus size={18} strokeWidth={3} />
              </div>
            </div>
          ))}

          {exercises.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6B7280' }}>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#F3F4F6', marginBottom: '6px' }}>
                No exercises found
              </p>
              <p style={{ fontSize: '13px', marginBottom: '16px' }}>
                You can create and add your own custom exercise!
              </p>
              <button
                type="button"
                className="btn-secondary"
                style={{ margin: '0 auto' }}
                onClick={() => {
                  onClose();
                  onOpenCreateNew();
                }}
              >
                <Plus size={16} /> Add Custom Exercise
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Search, Plus, ChevronRight } from 'lucide-react';
import { getExercises } from '../../db/storage';
import { EXERCISE_CATEGORIES } from '../../constants/defaultExercises';

interface ExercisesTabProps {
  onSelectExercise: (exerciseId: number) => void;
  onOpenCreateExercise: () => void;
}

export const ExercisesTab: React.FC<ExercisesTabProps> = ({
  onSelectExercise,
  onOpenCreateExercise,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredExercises = getExercises({
    search,
    category: selectedCategory,
  });

  return (
    <div>
      {/* Search Bar & Add Button */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#16181F',
            border: '1px solid #232733',
            borderRadius: '10px',
            padding: '10px 12px',
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
              fontSize: '14px',
              width: '100%',
            }}
          />
        </div>

        <button
          type="button"
          onClick={onOpenCreateExercise}
          className="btn-secondary"
          style={{ padding: '0 14px' }}
          title="Create New Exercise"
        >
          <Plus size={18} color="#10B981" />
        </button>
      </div>

      {/* Category Pills */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '12px',
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredExercises.map((ex) => (
          <div
            key={ex.id}
            className="card"
            onClick={() => onSelectExercise(ex.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              cursor: 'pointer',
              margin: 0,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#F3F4F6',
                  marginBottom: '4px',
                }}
              >
                {ex.name}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span className="badge-pill">{ex.category}</span>
                <span className="badge-pill">{ex.equipment}</span>
                {ex.isCustom && (
                  <span
                    className="badge-pill"
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: '#10B981',
                    }}
                  >
                    Custom
                  </span>
                )}
              </div>
            </div>
            <ChevronRight size={18} color="#6B7280" />
          </div>
        ))}
      </div>
    </div>
  );
};

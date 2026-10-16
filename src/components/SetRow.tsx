import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { ExerciseSet, SetType } from '../types/workout';
import { Colors } from '../constants/theme';

interface SetRowProps {
  set: ExerciseSet;
  previousPerformanceText?: string;
  onUpdate: (fields: Partial<ExerciseSet>) => void;
  onDelete: () => void;
  onToggleComplete: () => void;
}

const SET_TYPE_CYCLE: SetType[] = ['normal', 'warmup', 'drop', 'failure'];

export const SetRow: React.FC<SetRowProps> = ({
  set,
  previousPerformanceText,
  onUpdate,
  onDelete,
  onToggleComplete,
}) => {
  const cycleSetType = () => {
    const currentIndex = SET_TYPE_CYCLE.indexOf(set.setType);
    const nextType = SET_TYPE_CYCLE[(currentIndex + 1) % SET_TYPE_CYCLE.length];
    onUpdate({ setType: nextType });
  };

  const getSetBadge = () => {
    switch (set.setType) {
      case 'warmup':
        return { text: 'W', color: Colors.warmupTag, bg: 'rgba(245, 158, 11, 0.15)' };
      case 'drop':
        return { text: 'D', color: Colors.dropTag, bg: 'rgba(236, 72, 153, 0.15)' };
      case 'failure':
        return { text: 'F', color: Colors.failureTag, bg: 'rgba(239, 68, 68, 0.15)' };
      default:
        return { text: String(set.setNumber), color: Colors.textSecondary, bg: Colors.surfaceLight };
    }
  };

  const badge = getSetBadge();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '6px 4px',
        borderRadius: '8px',
        margin: '3px 0',
        backgroundColor: set.isCompleted ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
      }}
    >
      {/* Type badge */}
      <button
        type="button"
        onClick={cycleSetType}
        title="Click to change set type (Normal, Warmup, Drop set, Failure)"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          backgroundColor: badge.bg,
          color: badge.color,
          border: 'none',
          fontWeight: 800,
          fontSize: '13px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {badge.text}
      </button>

      {/* Previous weight & reps */}
      <div
        style={{
          flex: 1.3,
          textAlign: 'center',
          fontSize: '12px',
          color: '#6B7280',
          padding: '0 4px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {previousPerformanceText || '—'}
      </div>

      {/* Weight input */}
      <div style={{ flex: 1.1, padding: '0 3px' }}>
        <input
          type="number"
          step="any"
          value={set.weight > 0 ? set.weight : ''}
          placeholder="0"
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            onUpdate({ weight: isNaN(val) ? 0 : val });
          }}
          style={{
            width: '100%',
            backgroundColor: set.isCompleted ? 'rgba(255, 255, 255, 0.05)' : '#20242D',
            color: '#F3F4F6',
            border: set.isCompleted ? '1px solid transparent' : '1px solid #232733',
            borderRadius: '6px',
            padding: '7px 4px',
            textAlign: 'center',
            fontSize: '15px',
            fontWeight: 700,
          }}
        />
      </div>

      {/* Reps input */}
      <div style={{ flex: 1.1, padding: '0 3px' }}>
        <input
          type="number"
          value={set.reps > 0 ? set.reps : ''}
          placeholder="0"
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            onUpdate({ reps: isNaN(val) ? 0 : val });
          }}
          style={{
            width: '100%',
            backgroundColor: set.isCompleted ? 'rgba(255, 255, 255, 0.05)' : '#20242D',
            color: '#F3F4F6',
            border: set.isCompleted ? '1px solid transparent' : '1px solid #232733',
            borderRadius: '6px',
            padding: '7px 4px',
            textAlign: 'center',
            fontSize: '15px',
            fontWeight: 700,
          }}
        />
      </div>

      {/* Complete toggle */}
      <button
        type="button"
        onClick={onToggleComplete}
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '6px',
          backgroundColor: set.isCompleted ? '#10B981' : '#20242D',
          border: set.isCompleted ? 'none' : '1px solid #232733',
          color: set.isCompleted ? '#0D0E12' : '#6B7280',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: '4px',
          flexShrink: 0,
        }}
      >
        <Check size={18} strokeWidth={3} />
      </button>

      {/* Delete button */}
      <button
        type="button"
        onClick={() => {
          if (confirm(`Delete set ${set.setNumber}?`)) {
            onDelete();
          }
        }}
        style={{
          background: 'none',
          border: 'none',
          color: '#6B7280',
          padding: '6px',
          cursor: 'pointer',
          marginLeft: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

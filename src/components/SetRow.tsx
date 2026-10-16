import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { ExerciseSet, SetType } from '../types/workout';
import { Colors } from '../constants/theme';

interface SetRowProps {
  set: ExerciseSet;
  previousPerformanceText?: string;
  onUpdate: (fields: Partial<ExerciseSet>) => void;
  onDelete: () => void;
}

const SET_TYPE_CYCLE: SetType[] = ['normal', 'warmup', 'drop', 'failure'];

export const SetRow: React.FC<SetRowProps> = ({
  set,
  previousPerformanceText,
  onUpdate,
  onDelete,
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

  const handleStepWeight = (delta: number) => {
    const current = Number(set.weight) || 0;
    const next = Math.max(0, Math.round((current + delta) * 10) / 10);
    onUpdate({ weight: next, isCompleted: true });
  };

  const handleStepReps = (delta: number) => {
    const current = Number(set.reps) || 0;
    const next = Math.max(0, current + delta);
    onUpdate({ reps: next, isCompleted: true });
  };

  const moveCursorToEnd = (
    e: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>
  ) => {
    const input = e.currentTarget;
    const len = input.value.length;
    setTimeout(() => {
      try {
        input.setSelectionRange(len, len);
      } catch {
        // ignore
      }
    }, 10);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '5px 2px',
        borderRadius: '8px',
        margin: '3px 0',
        backgroundColor: '#16181F',
        border: '1px solid #1F2430',
      }}
    >
      {/* Type badge */}
      <button
        type="button"
        onClick={cycleSetType}
        title="Set type (Normal, Warmup, Drop set, Failure)"
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '6px',
          backgroundColor: badge.bg,
          color: badge.color,
          border: 'none',
          fontWeight: 800,
          fontSize: '11px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginLeft: '4px',
        }}
      >
        {badge.text}
      </button>

      {/* Previous weight & reps */}
      <div
        style={{
          flex: 1,
          textAlign: 'center',
          fontSize: '11px',
          color: '#6B7280',
          padding: '0 2px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        title={previousPerformanceText}
      >
        {previousPerformanceText || '—'}
      </div>

      {/* Weight Stepper (KG) */}
      <div
        style={{
          flex: 1.4,
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          padding: '0 2px',
        }}
      >
        <button
          type="button"
          onClick={() => handleStepWeight(-2.5)}
          title="-2.5 kg"
          style={{
            width: '24px',
            height: '30px',
            borderRadius: '5px',
            backgroundColor: '#20242D',
            border: '1px solid #282C37',
            color: '#9CA3AF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
            touchAction: 'manipulation',
          }}
        >
          <Minus size={12} strokeWidth={2.5} />
        </button>

        <input
          type="text"
          inputMode="decimal"
          value={set.weight > 0 ? set.weight : ''}
          placeholder="0"
          onFocus={moveCursorToEnd}
          onClick={moveCursorToEnd}
          onChange={(e) => {
            const raw = e.target.value.replace(',', '.');
            if (raw === '') {
              onUpdate({ weight: 0, isCompleted: true });
              return;
            }
            const val = parseFloat(raw);
            onUpdate({ weight: isNaN(val) ? 0 : val, isCompleted: true });
          }}
          style={{
            flex: 1,
            minWidth: 0,
            width: '100%',
            backgroundColor: '#0D0E12',
            color: '#F3F4F6',
            border: '1px solid #282C37',
            borderRadius: '5px',
            padding: '6px 2px',
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: 700,
            outline: 'none',
          }}
        />

        <button
          type="button"
          onClick={() => handleStepWeight(2.5)}
          title="+2.5 kg"
          style={{
            width: '24px',
            height: '30px',
            borderRadius: '5px',
            backgroundColor: '#20242D',
            border: '1px solid #282C37',
            color: '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
            touchAction: 'manipulation',
          }}
        >
          <Plus size={12} strokeWidth={2.5} />
        </button>
      </div>

      {/* Reps Stepper (REPS) */}
      <div
        style={{
          flex: 1.2,
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          padding: '0 2px',
        }}
      >
        <button
          type="button"
          onClick={() => handleStepReps(-1)}
          title="-1 rep"
          style={{
            width: '24px',
            height: '30px',
            borderRadius: '5px',
            backgroundColor: '#20242D',
            border: '1px solid #282C37',
            color: '#9CA3AF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
            touchAction: 'manipulation',
          }}
        >
          <Minus size={12} strokeWidth={2.5} />
        </button>

        <input
          type="text"
          inputMode="numeric"
          value={set.reps > 0 ? set.reps : ''}
          placeholder="0"
          onFocus={moveCursorToEnd}
          onClick={moveCursorToEnd}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === '') {
              onUpdate({ reps: 0, isCompleted: true });
              return;
            }
            const val = parseInt(raw, 10);
            onUpdate({ reps: isNaN(val) ? 0 : Math.max(0, val), isCompleted: true });
          }}
          style={{
            flex: 1,
            minWidth: 0,
            width: '100%',
            backgroundColor: '#0D0E12',
            color: '#F3F4F6',
            border: '1px solid #282C37',
            borderRadius: '5px',
            padding: '6px 2px',
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: 700,
            outline: 'none',
          }}
        />

        <button
          type="button"
          onClick={() => handleStepReps(1)}
          title="+1 rep"
          style={{
            width: '24px',
            height: '30px',
            borderRadius: '5px',
            backgroundColor: '#20242D',
            border: '1px solid #282C37',
            color: '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
            touchAction: 'manipulation',
          }}
        >
          <Plus size={12} strokeWidth={2.5} />
        </button>
      </div>

      {/* Delete button */}
      <button
        type="button"
        onClick={() => {
          if (confirm(`Delete set ${set.setNumber}?`)) {
            onDelete();
          }
        }}
        style={{
          width: '24px',
          height: '30px',
          background: 'none',
          border: 'none',
          color: '#6B7280',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          flexShrink: 0,
          marginRight: '2px',
        }}
        title="Delete set"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

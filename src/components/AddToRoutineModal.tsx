import React, { useState, useEffect } from 'react';
import { BookmarkPlus, Layers, X, Check } from 'lucide-react';

export interface AddToRoutinePromptData {
  exerciseId: number;
  exerciseName: string;
  routineId: string;
  routineTitle: string;
  isAlreadyInRoutine: boolean;
  initialSets: number;
}

interface AddToRoutineModalProps {
  isOpen: boolean;
  data: AddToRoutinePromptData | null;
  onClose: () => void;
  onConfirm: (result: { addToRoutine: boolean; targetSetsCount: number }) => void;
}

export const AddToRoutineModal: React.FC<AddToRoutineModalProps> = ({
  isOpen,
  data,
  onClose,
  onConfirm,
}) => {
  const [setsCount, setSetsCount] = useState(3);

  useEffect(() => {
    if (data) {
      setSetsCount(data.initialSets || 3);
    }
  }, [data]);

  if (!isOpen || !data) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
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
          maxWidth: '380px',
          width: '100%',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10B981',
              flexShrink: 0,
            }}
          >
            <BookmarkPlus size={20} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#F3F4F6' }}>
              {data.isAlreadyInRoutine ? 'Update Plan Sets?' : 'Add to Workout Plan?'}
            </h3>
            <div style={{ fontSize: '12px', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <Layers size={13} color="#10B981" />
              <span style={{ fontWeight: 600 }}>{data.routineTitle}</span>
            </div>
          </div>
        </div>

        <p style={{ fontSize: '13px', color: '#D1D5DB', lineHeight: '1.4', marginBottom: '16px' }}>
          {data.isAlreadyInRoutine ? (
            <>
              <strong>{data.exerciseName}</strong> is already in plan <strong>{data.routineTitle}</strong>.
              Would you like to change its planned sets in the plan?
            </>
          ) : (
            <>
              You added <strong>{data.exerciseName}</strong> to this workout. Do you also want to permanently save it into plan <strong>{data.routineTitle}</strong>?
            </>
          )}
        </p>

        {/* Planned sets selector */}
        <div
          style={{
            backgroundColor: '#16181F',
            border: '1px solid #232733',
            borderRadius: '12px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#9CA3AF' }}>
            Planned sets in plan:
          </span>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#20242D',
              borderRadius: '8px',
              padding: '2px 4px',
              gap: '4px',
            }}
          >
            <button
              type="button"
              onClick={() => setSetsCount((prev) => Math.max(1, prev - 1))}
              style={{
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                color: '#9CA3AF',
                fontSize: '18px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              -
            </button>
            <span
              style={{
                fontSize: '15px',
                fontWeight: 800,
                color: '#10B981',
                minWidth: '24px',
                textAlign: 'center',
              }}
            >
              {setsCount}
            </span>
            <button
              type="button"
              onClick={() => setSetsCount((prev) => Math.min(15, prev + 1))}
              style={{
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                color: '#9CA3AF',
                fontSize: '18px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={() => onConfirm({ addToRoutine: true, targetSetsCount: setsCount })}
            style={{ width: '100%', padding: '12px', fontSize: '14px' }}
          >
            <Check size={16} />
            {data.isAlreadyInRoutine ? 'Update Plan Sets' : 'Save to Plan & Workout'}
          </button>
          <button
            type="button"
            onClick={() => onConfirm({ addToRoutine: false, targetSetsCount: setsCount })}
            style={{
              width: '100%',
              background: 'none',
              border: '1px solid #282C37',
              borderRadius: '10px',
              color: '#9CA3AF',
              padding: '10px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {data.isAlreadyInRoutine ? 'Keep Existing Plan' : 'Workout Only (Don’t save to plan)'}
          </button>
        </div>
      </div>
    </div>
  );
};

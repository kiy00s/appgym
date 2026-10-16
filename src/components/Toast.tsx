import React, { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  isOpen: boolean;
  title: string;
  message?: string;
  durationMs?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  isOpen,
  title,
  message,
  durationMs = 4000,
  onClose,
}) => {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      setIsExiting(false);

      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsRendered(false);
          onClose();
        }, 250);
      }, durationMs);

      return () => clearTimeout(timer);
    } else {
      setIsExiting(true);
      const exitTimer = setTimeout(() => {
        setIsRendered(false);
      }, 250);
      return () => clearTimeout(exitTimer);
    }
  }, [isOpen, durationMs, onClose]);

  if (!isRendered) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 'calc(env(safe-area-inset-top, 20px) + 12px)',
        left: '16px',
        right: '16px',
        zIndex: 9999,
        backgroundColor: '#191C24',
        border: '1.5px solid #10B981',
        borderRadius: '14px',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(16, 185, 129, 0.25)',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'translateY(-12px) scale(0.96)' : 'translateY(0) scale(1)',
      }}
    >
      <div
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <CheckCircle2 size={20} color="#10B981" />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '14px', fontWeight: 800, color: '#F3F4F6' }}>
          {title}
        </div>
        {message && (
          <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '1px' }}>
            {message}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          background: 'none',
          border: 'none',
          color: '#6B7280',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

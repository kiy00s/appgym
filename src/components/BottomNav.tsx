import React from 'react';
import { Dumbbell, Layers, BookOpen, Calendar } from 'lucide-react';

export type AppTab = 'workout' | 'routines' | 'exercises' | 'history';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bottom-tabs">
      <button
        type="button"
        className={`tab-button ${activeTab === 'workout' ? 'active' : ''}`}
        onClick={() => onTabChange('workout')}
      >
        <Dumbbell size={20} />
        <span className="tab-label">Workout</span>
      </button>

      <button
        type="button"
        className={`tab-button ${activeTab === 'routines' ? 'active' : ''}`}
        onClick={() => onTabChange('routines')}
      >
        <Layers size={20} />
        <span className="tab-label">Plans</span>
      </button>

      <button
        type="button"
        className={`tab-button ${activeTab === 'exercises' ? 'active' : ''}`}
        onClick={() => onTabChange('exercises')}
      >
        <BookOpen size={20} />
        <span className="tab-label">Exercises</span>
      </button>

      <button
        type="button"
        className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
        onClick={() => onTabChange('history')}
      >
        <Calendar size={20} />
        <span className="tab-label">History</span>
      </button>
    </nav>
  );
};

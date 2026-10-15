import React, { useState } from 'react';
import {
  Dumbbell,
  BookOpen,
  Calendar,
  Play,
  Trophy,
  Activity,
  Flame,
  Footprints,
  Zap,
  ChevronRight,
  Plus,
  Search,
  Download,
  Upload,
} from 'lucide-react';
import { useWorkout } from './context/WorkoutContext';
import {
  getDashboardStats,
  getCompletedWorkouts,
  getExercises,
  exportBackupJSON,
  importBackupJSON,
} from './db/storage';
import { formatRelativeDate, formatWorkoutDate } from './utils/calculations';
import { ActiveWorkoutModal } from './components/ActiveWorkoutModal';
import { ExercisePickerModal } from './components/ExercisePickerModal';
import { NewExerciseModal } from './components/NewExerciseModal';
import { ExerciseDetailModal } from './components/ExerciseDetailModal';
import { WorkoutDetailModal } from './components/WorkoutDetailModal';

export const App: React.FC = () => {
  const { activeWorkout, startWorkout, addExercise, refreshState } = useWorkout();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'workout' | 'exercises' | 'history'>('workout');

  // Modals state
  const [isActiveModalOpen, setIsActiveModalOpen] = useState(false);
  const [isExercisePickerOpen, setIsExercisePickerOpen] = useState(false);
  const [isNewExerciseOpen, setIsNewExerciseOpen] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(null);

  // Exercises screen state
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [exerciseCategory, setExerciseCategory] = useState('All');

  const stats = getDashboardStats();
  const completedWorkouts = getCompletedWorkouts();
  const lastWorkout = completedWorkouts[0];

  const handleStartWorkout = (title?: string) => {
    if (activeWorkout) {
      setIsActiveModalOpen(true);
      return;
    }
    startWorkout(title);
    setIsActiveModalOpen(true);
  };

  const handleStartWithExercise = (exerciseId: number) => {
    startWorkout();
    addExercise(exerciseId);
    setIsActiveModalOpen(true);
  };

  const handleAddExerciseFromPicker = (exerciseId: number) => {
    addExercise(exerciseId);
  };

  const handleExportBackup = () => {
    const json = exportBackupJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gymtracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (importBackupJSON(text)) {
          alert('Backup imported successfully!');
          refreshState();
        } else {
          alert('Error importing backup file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const templates = [
    { title: 'Push (Chest + Shoulders + Triceps)', icon: <Flame size={20} color="#F59E0B" /> },
    { title: 'Pull (Back + Rear Delts + Biceps)', icon: <Dumbbell size={20} color="#10B981" /> },
    { title: 'Legs (Quads + Hamstrings + Calves)', icon: <Footprints size={20} color="#06B6D4" /> },
    { title: 'FBW (Full Body Workout)', icon: <Zap size={20} color="#EC4899" /> },
  ];

  const categories = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

  return (
    <div className="app-viewport">
      {/* Top Header */}
      <header className="app-header">
        <div className="header-title-box">
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10B981',
            }}
          >
            <Dumbbell size={20} />
          </div>
          <h1>GymTracker</h1>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={handleExportBackup}
            title="Download Backup (JSON)"
            style={{
              background: 'none',
              border: '1px solid #232733',
              borderRadius: '8px',
              color: '#9CA3AF',
              padding: '6px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 700,
            }}
          >
            <Download size={14} /> Backup
          </button>
          <button
            type="button"
            onClick={handleImportBackup}
            title="Upload Backup (JSON)"
            style={{
              background: 'none',
              border: '1px solid #232733',
              borderRadius: '8px',
              color: '#9CA3AF',
              padding: '6px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 700,
            }}
          >
            <Upload size={14} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ padding: '16px', flex: 1 }}>
        {/* ================= TAB 1: WORKOUT / DASHBOARD ================= */}
        {activeTab === 'workout' && (
          <div>
            {/* Active workout banner */}
            {activeWorkout && (
              <div
                className="active-banner"
                onClick={() => setIsActiveModalOpen(true)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="pulsing-dot" />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#10B981', letterSpacing: '0.8px' }}>
                      WORKOUT IN PROGRESS
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#F3F4F6', marginBottom: '2px' }}>
                  {activeWorkout.title}
                </div>
                <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                  {activeWorkout.exercises?.length ?? 0} exercises in session • Tap to resume
                </div>
              </div>
            )}

            {/* Quick Start Action */}
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#9CA3AF', marginBottom: '10px' }}>
                QUICK START
              </h2>
              <button
                type="button"
                className="btn-primary"
                onClick={() => handleStartWorkout()}
                style={{ width: '100%', padding: '16px' }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 0, 0, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '6px',
                  }}
                >
                  <Play size={20} fill="#0D0E12" />
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800 }}>Start Empty Workout</div>
                  <div style={{ fontSize: '12px', opacity: 0.8, fontWeight: 500 }}>
                    Add exercises and log sets on the fly
                  </div>
                </div>
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Summary Stats */}
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#9CA3AF', marginBottom: '10px' }}>
                SUMMARY
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div className="card" style={{ padding: '14px 10px', textAlign: 'center', margin: 0 }}>
                  <Trophy size={20} color="#10B981" style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#F3F4F6' }}>
                    {stats.totalWorkouts}
                  </div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#6B7280', marginTop: '2px' }}>
                    Workouts
                  </div>
                </div>

                <div className="card" style={{ padding: '14px 10px', textAlign: 'center', margin: 0 }}>
                  <Activity size={20} color="#06B6D4" style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#F3F4F6' }}>
                    {stats.totalVolumeKg >= 1000
                      ? `${(stats.totalVolumeKg / 1000).toFixed(1)} t`
                      : `${stats.totalVolumeKg} kg`}
                  </div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#6B7280', marginTop: '2px' }}>
                    Volume
                  </div>
                </div>

                <div className="card" style={{ padding: '14px 10px', textAlign: 'center', margin: 0 }}>
                  <Calendar size={20} color="#EC4899" style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#F3F4F6' }}>
                    {stats.workoutsThisMonth}
                  </div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#6B7280', marginTop: '2px' }}>
                    This Month
                  </div>
                </div>
              </div>
            </div>

            {/* Templates */}
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#9CA3AF', marginBottom: '10px' }}>
                WORKOUT ROUTINES
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {templates.map((tmpl, idx) => (
                  <div
                    key={idx}
                    className="card"
                    onClick={() => handleStartWorkout(tmpl.title)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '14px',
                      cursor: 'pointer',
                      margin: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: '#20242D',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '12px',
                        flexShrink: 0,
                      }}
                    >
                      {tmpl.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#F3F4F6' }}>
                        {tmpl.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                        Tap to start routine
                      </div>
                    </div>
                    <Plus size={20} color="#10B981" />
                  </div>
                ))}
              </div>
            </div>

            {/* Last workout preview */}
            {lastWorkout && (
              <div>
                <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#9CA3AF', marginBottom: '10px' }}>
                  RECENT WORKOUT
                </h2>
                <div
                  className="card"
                  onClick={() => setSelectedWorkoutId(lastWorkout.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#F3F4F6' }}>
                      {lastWorkout.title}
                    </div>
                    <ChevronRight size={18} color="#6B7280" />
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '10px' }}>
                    {formatRelativeDate(lastWorkout.startTime)}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      backgroundColor: '#16181F',
                      borderRadius: '8px',
                      padding: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#F3F4F6',
                    }}
                  >
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      {lastWorkout.exercises?.length ?? 0} exercises
                    </div>
                    <div style={{ width: '1px', backgroundColor: '#232733' }} />
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      {lastWorkout.exercises?.flatMap((e) => e.sets).filter((s) => s.isCompleted).length ?? 0} sets completed
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: EXERCISES CATALOG ================= */}
        {activeTab === 'exercises' && (
          <div>
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
                  value={exerciseSearch}
                  onChange={(e) => setExerciseSearch(e.target.value)}
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
                onClick={() => setIsNewExerciseOpen(true)}
                className="btn-secondary"
                style={{ padding: '0 14px' }}
              >
                <Plus size={18} color="#10B981" />
              </button>
            </div>

            {/* Categories */}
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
              {categories.map((cat) => {
                const isSelected = exerciseCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setExerciseCategory(cat)}
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
              {getExercises({ search: exerciseSearch, category: exerciseCategory }).map((ex) => (
                <div
                  key={ex.id}
                  className="card"
                  onClick={() => setSelectedExerciseId(ex.id)}
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
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#F3F4F6', marginBottom: '4px' }}>
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
                  <ChevronRight size={18} color="#6B7280" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: HISTORY ================= */}
        {activeTab === 'history' && (
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#9CA3AF', marginBottom: '12px' }}>
              WORKOUT HISTORY ({completedWorkouts.length})
            </h2>

            {completedWorkouts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {completedWorkouts.map((w) => {
                  const allWsets = w.exercises?.flatMap((e) => e.sets) || [];
                  const compSets = allWsets.filter((s) => s.isCompleted);
                  const totalVol = allWsets.reduce((sum, s) => sum + (s.isCompleted ? s.weight * s.reps : 0), 0);

                  return (
                    <div
                      key={w.id}
                      className="card"
                      onClick={() => setSelectedWorkoutId(w.id)}
                      style={{ cursor: 'pointer', margin: 0 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: 800, color: '#F3F4F6' }}>
                            {w.title}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                            {formatWorkoutDate(w.startTime)}
                          </div>
                        </div>
                        <ChevronRight size={18} color="#6B7280" />
                      </div>

                      {/* Stat badges */}
                      <div style={{ display: 'flex', gap: '8px', margin: '10px 0' }}>
                        <span className="badge-pill" style={{ color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
                          🏋️ {Math.round(totalVol)} kg
                        </span>
                        <span className="badge-pill" style={{ color: '#06B6D4', backgroundColor: 'rgba(6, 182, 212, 0.15)' }}>
                          📊 {compSets.length} sets
                        </span>
                      </div>

                      {/* Exercises names */}
                      {w.exercises && w.exercises.length > 0 && (
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#9CA3AF',
                            lineHeight: '1.4',
                            borderTop: '1px solid #232733',
                            paddingTop: '8px',
                          }}
                        >
                          {w.exercises.map((e) => e.exercise.name).join(' • ')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: '#6B7280' }}>
                <Calendar size={48} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                <p style={{ fontSize: '17px', fontWeight: 800, color: '#F3F4F6', marginBottom: '6px' }}>
                  No workouts recorded
                </p>
                <p style={{ fontSize: '13px', marginBottom: '16px' }}>
                  Once you complete your first workout, your full history and stats will appear here.
                </p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => handleStartWorkout()}
                  style={{ margin: '0 auto' }}
                >
                  Start First Workout
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Tabs Bar */}
      <nav className="bottom-tabs">
        <button
          type="button"
          className={`tab-button ${activeTab === 'workout' ? 'active' : ''}`}
          onClick={() => setActiveTab('workout')}
        >
          <Dumbbell size={22} />
          <span className="tab-label">Workout</span>
        </button>

        <button
          type="button"
          className={`tab-button ${activeTab === 'exercises' ? 'active' : ''}`}
          onClick={() => setActiveTab('exercises')}
        >
          <BookOpen size={22} />
          <span className="tab-label">Exercises</span>
        </button>

        <button
          type="button"
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <Calendar size={22} />
          <span className="tab-label">History</span>
        </button>
      </nav>

      {/* Modals */}
      <ActiveWorkoutModal
        isOpen={isActiveModalOpen}
        onClose={() => setIsActiveModalOpen(false)}
        onOpenExercisePicker={() => setIsExercisePickerOpen(true)}
        onSelectExercise={(id) => setSelectedExerciseId(id)}
      />

      <ExercisePickerModal
        isOpen={isExercisePickerOpen}
        onClose={() => setIsExercisePickerOpen(false)}
        onSelectExercise={handleAddExerciseFromPicker}
        onOpenCreateNew={() => setIsNewExerciseOpen(true)}
      />

      <NewExerciseModal
        isOpen={isNewExerciseOpen}
        onClose={() => setIsNewExerciseOpen(false)}
        onCreated={(id) => {
          if (activeWorkout) {
            addExercise(id);
          }
          refreshState();
        }}
      />

      <ExerciseDetailModal
        exerciseId={selectedExerciseId}
        onClose={() => setSelectedExerciseId(null)}
        onStartWorkoutWithExercise={handleStartWithExercise}
        onDeleted={() => refreshState()}
      />

      <WorkoutDetailModal
        workoutId={selectedWorkoutId}
        onClose={() => setSelectedWorkoutId(null)}
        onDeleted={() => refreshState()}
        onSelectExercise={(id) => setSelectedExerciseId(id)}
      />
    </div>
  );
};

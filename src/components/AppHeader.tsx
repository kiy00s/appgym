import React, { useState } from 'react';
import { Dumbbell, Settings, RotateCw, Download, Upload, Cloud } from 'lucide-react';
import { forceRefreshPWA } from '../utils/pwa';
import { downloadBackupFile, promptUploadBackupFile } from '../utils/backup';

interface AppHeaderProps {
  onDataRestored?: () => void;
  onOpenGitHubSync?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onDataRestored, onOpenGitHubSync }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleUpdateApp = async () => {
    setIsRefreshing(true);
    await forceRefreshPWA();
  };

  const handleDownloadBackup = () => {
    downloadBackupFile();
  };

  const handleUploadBackup = () => {
    promptUploadBackupFile({
      onSuccess: () => {
        alert('Backup imported successfully!');
        onDataRestored?.();
      },
      onError: () => {
        alert('Error importing backup file.');
      },
    });
  };

  return (
    <>
      {/* Top safe notch spacer */}
      <div className="top-safe-spacer" />

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

        {/* Settings Gear Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setIsSettingsOpen((prev) => !prev)}
            title="Settings & Tools"
            style={{
              background: isSettingsOpen ? '#20242D' : '#16181F',
              border: '1px solid #282C37',
              borderRadius: '9px',
              color: isSettingsOpen ? '#F3F4F6' : '#9CA3AF',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s, color 0.15s',
            }}
          >
            <Settings size={18} />
          </button>

          {isSettingsOpen && (
            <>
              {/* Invisible backdrop to dismiss on tap outside */}
              <div
                onClick={() => setIsSettingsOpen(false)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 80,
                }}
              />

              {/* Settings Dropdown Card */}
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '210px',
                  backgroundColor: '#16181F',
                  border: '1px solid #282C37',
                  borderRadius: '12px',
                  padding: '6px',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
                  zIndex: 85,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    handleUpdateApp();
                  }}
                  className="dropdown-item"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#F3F4F6',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <RotateCw size={15} color="#10B981" className={isRefreshing ? 'spin-icon' : ''} />
                  <span>Update App</span>
                </button>

                <div style={{ height: '1px', backgroundColor: '#232733', margin: '4px 0' }} />

                <button
                  type="button"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    onOpenGitHubSync?.();
                  }}
                  className="dropdown-item"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#F3F4F6',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <Cloud size={15} color="#10B981" />
                  <span>GitHub Cloud Sync</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    handleDownloadBackup();
                  }}
                  className="dropdown-item"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#F3F4F6',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <Download size={15} color="#06B6D4" />
                  <span>Download Backup</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    handleUploadBackup();
                  }}
                  className="dropdown-item"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#F3F4F6',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <Upload size={15} color="#F59E0B" />
                  <span>Upload Backup</span>
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Full-screen update transition overlay */}
      {isRefreshing && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(13, 14, 18, 0.92)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <RotateCw size={36} color="#10B981" className="spin-icon" />
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#F3F4F6' }}>
            Updating GymTracker...
          </div>
          <div style={{ fontSize: '13px', color: '#9CA3AF', maxWidth: '280px' }}>
            Clearing cache, updating Service Worker and reloading latest version
          </div>
        </div>
      )}
    </>
  );
};

import React, { useState, useEffect } from 'react';
import {
  X,
  Cloud,
  Check,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
  UploadCloud,
  DownloadCloud,
  Trash2,
  HelpCircle,
  RotateCw,
} from 'lucide-react';
import {
  getGitHubSyncConfig,
  saveGitHubSyncConfig,
  clearGitHubSyncConfig,
  syncToGitHubGist,
  restoreFromGitHubGist,
  GitHubSyncConfig,
} from '../utils/githubSync';
import { formatRelativeDate } from '../utils/calculations';

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored: () => void;
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({
  isOpen,
  onClose,
  onDataRestored,
}) => {
  const [config, setConfig] = useState<GitHubSyncConfig>(getGitHubSyncConfig());
  const [inputToken, setInputToken] = useState(config.token);
  const [showToken, setShowToken] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const current = getGitHubSyncConfig();
      setConfig(current);
      setInputToken(current.token);
      setFeedback(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isConnected = Boolean(config.token.trim());

  const handleSaveToken = () => {
    const trimmed = inputToken.trim();
    saveGitHubSyncConfig({ token: trimmed });
    const updated = getGitHubSyncConfig();
    setConfig(updated);
    setFeedback({
      type: 'success',
      message: trimmed ? 'GitHub Token saved!' : 'GitHub Token cleared.',
    });
  };

  const handleToggleAutoSync = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.checked;
    saveGitHubSyncConfig({ autoSync: val });
    setConfig((prev) => ({ ...prev, autoSync: val }));
  };

  const handleSyncNow = async () => {
    if (!inputToken.trim()) {
      setFeedback({ type: 'error', message: 'Please enter a GitHub Token first.' });
      return;
    }
    // Save token if changed
    if (inputToken.trim() !== config.token) {
      saveGitHubSyncConfig({ token: inputToken.trim() });
    }

    setIsLoading(true);
    setFeedback(null);
    const result = await syncToGitHubGist(inputToken.trim());
    setIsLoading(false);

    if (result.success) {
      setFeedback({ type: 'success', message: result.message });
      setConfig(getGitHubSyncConfig());
    } else {
      setFeedback({ type: 'error', message: result.message });
    }
  };

  const handleRestoreNow = async () => {
    if (!inputToken.trim()) {
      setFeedback({ type: 'error', message: 'Please enter a GitHub Token first.' });
      return;
    }
    if (
      !confirm(
        'Restoring will import workouts and routines from your private GitHub Gist into this device. Continue?'
      )
    ) {
      return;
    }

    setIsLoading(true);
    setFeedback(null);
    const result = await restoreFromGitHubGist(inputToken.trim());
    setIsLoading(false);

    if (result.success) {
      setFeedback({ type: 'success', message: result.message });
      setConfig(getGitHubSyncConfig());
      onDataRestored();
    } else {
      setFeedback({ type: 'error', message: result.message });
    }
  };

  const handleDisconnect = () => {
    if (confirm('Disconnect GitHub and remove the saved token from this phone?')) {
      clearGitHubSyncConfig();
      setConfig(getGitHubSyncConfig());
      setInputToken('');
      setFeedback({ type: 'success', message: 'GitHub disconnected.' });
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 160 }}>
      {/* Header */}
      <div className="modal-header">
        <button
          type="button"
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#F3F4F6', cursor: 'pointer', padding: '4px' }}
        >
          <X size={24} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cloud size={20} color="#10B981" />
          <h2 style={{ fontSize: '17px', fontWeight: 800 }}>GitHub Cloud Sync</h2>
        </div>
        <div style={{ width: '24px' }} />
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
        {/* Status Card */}
        <div className="card" style={{ margin: 0, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#9CA3AF' }}>STATUS</span>
            <span
              className="badge-pill"
              style={{
                backgroundColor: isConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(107, 114, 128, 0.15)',
                color: isConnected ? '#10B981' : '#9CA3AF',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              {isConnected ? 'Connected' : 'Not Configured'}
            </span>
          </div>

          <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: '1.4', margin: '4px 0 10px' }}>
            Your workouts and plans are backed up to a <strong>100% private Secret Gist</strong> on your GitHub account.
            If your Safari cache is wiped, you can restore everything here with 1 tap.
          </p>

          {config.lastSync && (
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '6px' }}>
              Last sync: <strong style={{ color: '#F3F4F6' }}>{formatRelativeDate(config.lastSync)}</strong>
            </div>
          )}

          {config.gistId && (
            <div style={{ marginTop: '8px' }}>
              <a
                href={`https://gist.github.com/${config.gistId}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '12px',
                  color: '#06B6D4',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 600,
                }}
              >
                View Gist on GitHub <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: feedback.type === 'success' ? '#10B981' : '#EF4444',
              border: `1px solid ${feedback.type === 'success' ? '#10B981' : '#EF4444'}`,
            }}
          >
            {feedback.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Token Configuration Card */}
        <div className="card" style={{ margin: 0, padding: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#F3F4F6', marginBottom: '6px' }}>
            GitHub Personal Access Token (classic)
          </label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#16181F',
                border: '1px solid #232733',
                borderRadius: '8px',
                padding: '0 10px',
              }}
            >
              <input
                type={showToken ? 'text' : 'password'}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: '#F3F4F6',
                  fontSize: '13px',
                  width: '100%',
                  padding: '10px 0',
                }}
              />
              <button
                type="button"
                onClick={() => setShowToken((prev) => !prev)}
                style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', padding: '4px' }}
              >
                {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleSaveToken}
              style={{ padding: '0 14px', fontSize: '13px', whiteSpace: 'nowrap' }}
            >
              Save
            </button>
          </div>

          {/* Toggle instructions link */}
          <button
            type="button"
            onClick={() => setShowInstructions((prev) => !prev)}
            style={{
              background: 'none',
              border: 'none',
              color: '#10B981',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: 0,
            }}
          >
            <HelpCircle size={14} />
            <span>{showInstructions ? 'Hide instructions' : 'How to get a free GitHub Token?'}</span>
          </button>

          {showInstructions && (
            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#16181F',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#9CA3AF',
                lineHeight: '1.5',
              }}
            >
              <ol style={{ paddingLeft: '18px', margin: 0 }}>
                <li style={{ marginBottom: '6px' }}>
                  Log in to GitHub and open{' '}
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#06B6D4' }}
                  >
                    github.com/settings/tokens
                  </a>.
                </li>
                <li style={{ marginBottom: '6px' }}>
                  Click <strong>Generate new token</strong> &rarr; <strong>Generate new token (classic)</strong>.
                </li>
                <li style={{ marginBottom: '6px' }}>
                  Set Note (e.g. <em>GymTracker Sync</em>) and check <strong>only the [x] gist</strong> scope.
                </li>
                <li>Generate token, copy it, and paste it into the field above.</li>
              </ol>
            </div>
          )}
        </div>

        {/* Auto Sync Toggle */}
        <div
          className="card"
          style={{
            margin: 0,
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#F3F4F6' }}>
              Auto-sync after workout
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
              Automatically update private Gist when you tap Finish Workout
            </div>
          </div>
          <input
            type="checkbox"
            checked={config.autoSync}
            onChange={handleToggleAutoSync}
            style={{ width: '18px', height: '18px', accentColor: '#10B981', cursor: 'pointer' }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSyncNow}
            disabled={isLoading}
            style={{ width: '100%', padding: '14px', fontSize: '15px', justifyContent: 'center' }}
          >
            {isLoading ? (
              <RotateCw size={18} className="spin-icon" />
            ) : (
              <UploadCloud size={18} />
            )}
            <span>Backup Now to GitHub</span>
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleRestoreNow}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '13px',
              fontSize: '14px',
              justifyContent: 'center',
              color: '#06B6D4',
              borderColor: '#232733',
            }}
          >
            <DownloadCloud size={18} />
            <span>Restore from GitHub Gist</span>
          </button>

          {isConnected && (
            <button
              type="button"
              onClick={handleDisconnect}
              style={{
                background: 'none',
                border: 'none',
                color: '#EF4444',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '8px',
                marginTop: '4px',
              }}
            >
              <Trash2 size={14} /> Disconnect GitHub Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

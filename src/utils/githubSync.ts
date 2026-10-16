import { exportBackupJSON, importBackupJSON, getCompletedWorkouts } from '../db/storage';

const GITHUB_STORAGE_KEYS = {
  TOKEN: 'gymtracker_github_token',
  GIST_ID: 'gymtracker_github_gist_id',
  AUTO_SYNC: 'gymtracker_github_auto_sync',
  LAST_SYNC: 'gymtracker_github_last_sync',
};

export const BACKUP_FILENAME = 'gymtracker-backup.json';
export const GIST_DESCRIPTION = 'GymTracker PWA Workout Data Backup';

export interface GitHubSyncConfig {
  token: string;
  gistId: string;
  autoSync: boolean;
  lastSync: string | null;
}

export function getGitHubSyncConfig(): GitHubSyncConfig {
  return {
    token: localStorage.getItem(GITHUB_STORAGE_KEYS.TOKEN) || '',
    gistId: localStorage.getItem(GITHUB_STORAGE_KEYS.GIST_ID) || '',
    autoSync: localStorage.getItem(GITHUB_STORAGE_KEYS.AUTO_SYNC) !== 'false',
    lastSync: localStorage.getItem(GITHUB_STORAGE_KEYS.LAST_SYNC),
  };
}

export function saveGitHubSyncConfig(config: Partial<GitHubSyncConfig>): void {
  if (config.token !== undefined) {
    if (config.token.trim()) {
      localStorage.setItem(GITHUB_STORAGE_KEYS.TOKEN, config.token.trim());
    } else {
      localStorage.removeItem(GITHUB_STORAGE_KEYS.TOKEN);
    }
  }
  if (config.gistId !== undefined) {
    if (config.gistId.trim()) {
      localStorage.setItem(GITHUB_STORAGE_KEYS.GIST_ID, config.gistId.trim());
    } else {
      localStorage.removeItem(GITHUB_STORAGE_KEYS.GIST_ID);
    }
  }
  if (config.autoSync !== undefined) {
    localStorage.setItem(GITHUB_STORAGE_KEYS.AUTO_SYNC, String(config.autoSync));
  }
  if (config.lastSync !== undefined) {
    if (config.lastSync) {
      localStorage.setItem(GITHUB_STORAGE_KEYS.LAST_SYNC, config.lastSync);
    } else {
      localStorage.removeItem(GITHUB_STORAGE_KEYS.LAST_SYNC);
    }
  }
}

export function clearGitHubSyncConfig(): void {
  localStorage.removeItem(GITHUB_STORAGE_KEYS.TOKEN);
  localStorage.removeItem(GITHUB_STORAGE_KEYS.GIST_ID);
  localStorage.removeItem(GITHUB_STORAGE_KEYS.AUTO_SYNC);
  localStorage.removeItem(GITHUB_STORAGE_KEYS.LAST_SYNC);
}

/**
 * Searches user's gists to find an existing GymTracker backup gist.
 */
export async function findExistingBackupGist(token: string): Promise<string | null> {
  try {
    const res = await fetch('https://api.github.com/gists?per_page=100', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!res.ok) {
      return null;
    }

    const gists = await res.json();
    if (!Array.isArray(gists)) return null;

    const matched = gists.find(
      (g) =>
        (g.files && g.files[BACKUP_FILENAME]) ||
        g.description === GIST_DESCRIPTION
    );

    return matched ? matched.id : null;
  } catch (e) {
    console.error('Failed to search gists:', e);
    return null;
  }
}

export interface SyncResult {
  success: boolean;
  message: string;
  gistId?: string;
  lastSync?: string;
}

/**
 * Backs up local data to a private GitHub Gist.
 */
export async function syncToGitHubGist(manualToken?: string): Promise<SyncResult> {
  const currentConfig = getGitHubSyncConfig();
  const token = (manualToken || currentConfig.token).trim();

  if (!token) {
    return {
      success: false,
      message: 'GitHub Personal Access Token is missing. Please configure it in settings.',
    };
  }

  const backupData = exportBackupJSON();
  let gistId = currentConfig.gistId.trim();

  try {
    // If we don't have a gistId, check if one already exists on the user's GitHub
    if (!gistId) {
      const existingId = await findExistingBackupGist(token);
      if (existingId) {
        gistId = existingId;
        saveGitHubSyncConfig({ gistId });
      }
    }

    const headers = {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    };

    let response: Response;

    if (gistId) {
      // Update existing gist
      response = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          description: GIST_DESCRIPTION,
          files: {
            [BACKUP_FILENAME]: {
              content: backupData,
            },
          },
        }),
      });

      // If gist was deleted on GitHub (404), fall back to creating a new one
      if (response.status === 404) {
        gistId = '';
      }
    }

    // Create a new secret gist if no gistId or 404 occurred
    if (!gistId) {
      response = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          description: GIST_DESCRIPTION,
          public: false,
          files: {
            [BACKUP_FILENAME]: {
              content: backupData,
            },
          },
        }),
      });
    }

    if (!response!.ok) {
      const errText = await response!.text();
      return {
        success: false,
        message: `GitHub sync error (${response!.status}): ${errText || response!.statusText}`,
      };
    }

    const result = await response!.json();
    const newGistId = result.id;
    const now = new Date().toISOString();

    saveGitHubSyncConfig({
      token,
      gistId: newGistId,
      lastSync: now,
    });

    return {
      success: true,
      message: 'Backup successfully uploaded to your private GitHub Gist!',
      gistId: newGistId,
      lastSync: now,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Network or sync error: ${error.message || 'Unknown error'}`,
    };
  }
}

export interface RestoreResult {
  success: boolean;
  message: string;
  workoutCount?: number;
}

/**
 * Restores local data from the private GitHub Gist.
 */
export async function restoreFromGitHubGist(tokenOverride?: string): Promise<RestoreResult> {
  const currentConfig = getGitHubSyncConfig();
  const token = (tokenOverride || currentConfig.token).trim();

  if (!token) {
    return {
      success: false,
      message: 'GitHub Personal Access Token is required to restore backup.',
    };
  }

  let gistId = currentConfig.gistId.trim();

  try {
    if (!gistId) {
      const foundId = await findExistingBackupGist(token);
      if (!foundId) {
        return {
          success: false,
          message: 'No GymTracker backup Gist was found on this GitHub account.',
        };
      }
      gistId = foundId;
    }

    const headers = {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    };

    const res = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers,
    });

    if (!res.ok) {
      return {
        success: false,
        message: `Could not fetch Gist (${res.status}): ${res.statusText}`,
      };
    }

    const gistData = await res.json();
    const backupFile = gistData.files?.[BACKUP_FILENAME];

    if (!backupFile) {
      return {
        success: false,
        message: `Gist does not contain ${BACKUP_FILENAME}`,
      };
    }

    let jsonContent = backupFile.content;

    // If file is truncated by GitHub API (>1MB), fetch directly from raw_url
    if (backupFile.truncated && backupFile.raw_url) {
      const rawRes = await fetch(backupFile.raw_url);
      jsonContent = await rawRes.text();
    }

    if (!jsonContent) {
      return {
        success: false,
        message: 'Backup file in Gist was empty.',
      };
    }

    const importSuccess = importBackupJSON(jsonContent);
    if (!importSuccess) {
      return {
        success: false,
        message: 'Failed to parse and import backup JSON file.',
      };
    }

    const completed = getCompletedWorkouts();
    const now = new Date().toISOString();

    saveGitHubSyncConfig({
      token,
      gistId,
      lastSync: now,
    });

    return {
      success: true,
      message: `Successfully restored ${completed.length} workouts from GitHub!`,
      workoutCount: completed.length,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to restore from GitHub: ${error.message || 'Unknown error'}`,
    };
  }
}

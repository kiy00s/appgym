import { exportBackupJSON, importBackupJSON } from '../db/storage';

/**
 * Triggers download of the full app state as a JSON file.
 */
export function downloadBackupFile(): void {
  const json = exportBackupJSON();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `gymtracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

/**
 * Prompts user to pick a JSON backup file and imports it.
 */
export function promptUploadBackupFile(options: {
  onSuccess: () => void;
  onError: () => void;
}): void {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';

  input.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (readEvent) => {
      const text = readEvent.target?.result;
      if (typeof text === 'string' && importBackupJSON(text)) {
        options.onSuccess();
      } else {
        options.onError();
      }
    };
    reader.readAsText(file);
  };

  input.click();
}

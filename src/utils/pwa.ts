/**
 * Checks if the app was just updated/refreshed, and clears the flag.
 */
export function checkAndClearUpdateFlag(): boolean {
  try {
    const inSession = sessionStorage.getItem('gymtracker_just_updated') === 'true';
    const lastTime = Number(localStorage.getItem('gymtracker_just_updated_time') || '0');
    const isRecent = inSession || (Date.now() - lastTime < 12000);

    if (isRecent) {
      sessionStorage.removeItem('gymtracker_just_updated');
      localStorage.removeItem('gymtracker_just_updated_time');
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Forces PWA refresh: marks update flag, updates Service Worker registrations,
 * clears cache storage, and reloads the current page.
 */
export async function forceRefreshPWA(): Promise<void> {
  try {
    sessionStorage.setItem('gymtracker_just_updated', 'true');
    localStorage.setItem('gymtracker_just_updated_time', String(Date.now()));

    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.update();
      }
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }
    }
  } catch (error) {
    console.error('Failed to clear caches/update SW:', error);
  } finally {
    window.location.reload();
  }
}

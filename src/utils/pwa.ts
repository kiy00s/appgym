/**
 * Checks if the app was just updated via the Update button, and clears the flag.
 */
export function isAppJustUpdated(): boolean {
  try {
    // 1. Check URL query parameter ?updated=1
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('updated') === '1') {
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, '', cleanUrl);
      localStorage.removeItem('gymtracker_just_updated');
      sessionStorage.removeItem('gymtracker_just_updated');
      return true;
    }

    // 2. Check storage flags
    const flag = localStorage.getItem('gymtracker_just_updated');
    const sessionFlag = sessionStorage.getItem('gymtracker_just_updated');
    if (flag || sessionFlag) {
      localStorage.removeItem('gymtracker_just_updated');
      sessionStorage.removeItem('gymtracker_just_updated');
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Forces PWA refresh: marks update flag, updates Service Worker registrations,
 * clears cache storage, and reloads the current page with a cachebuster.
 */
export async function forceRefreshPWA(): Promise<void> {
  try {
    localStorage.setItem('gymtracker_just_updated', '1');
    sessionStorage.setItem('gymtracker_just_updated', '1');

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
    const cleanPath = window.location.pathname;
    window.location.href = `${cleanPath}?updated=1&t=${Date.now()}`;
  }
}

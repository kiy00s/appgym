/**
 * Forces PWA refresh: updates Service Worker registrations,
 * clears cache storage, and reloads the current page.
 */
export async function forceRefreshPWA(): Promise<void> {
  try {
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

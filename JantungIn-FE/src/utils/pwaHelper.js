/**
 * PWA Helper utility
 *
 * Fungsi utilitas untuk membantu pengelolaan PWA
 */

/**
 * Mengecek apakah aplikasi dijalankan dalam mode standalone (terinstal sebagai PWA)
 * @returns {boolean} true jika aplikasi dijalankan sebagai PWA yang terinstal
 */
export function isAppInstalled() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    localStorage.getItem('pwaInstalled') === 'true'
  )
}

/**
 * Mengecek apakah browser mendukung fitur PWA
 * @returns {boolean} true jika browser mendukung PWA
 */
export function isPwaSupported() {
  return (
    'serviceWorker' in navigator && 'PushManager' in window && navigator.serviceWorker !== undefined
  )
}

/**
 * Mencatat instalasi PWA ke localStorage
 */
export function recordInstallation() {
  localStorage.setItem('pwaInstalled', 'true')
  localStorage.setItem('pwaInstallDate', new Date().toISOString())
}

/**
 * Mendapatkan tanggal instalasi PWA
 * @returns {Date|null} Tanggal instalasi atau null jika belum terinstal
 */
export function getInstallDate() {
  const date = localStorage.getItem('pwaInstallDate')
  return date ? new Date(date) : null
}

/**
 * Mengecek kompatibilitas browser dengan fitur tertentu
 * @returns {Object} Status dukungan berbagai fitur PWA
 */
export function checkBrowserSupport() {
  return {
    serviceWorker: 'serviceWorker' in navigator,
    pushManager: 'PushManager' in window,
    notificationAPI: 'Notification' in window,
    beforeInstallPrompt: 'BeforeInstallPromptEvent' in window || 'onbeforeinstallprompt' in window,
    storageEstimate: 'storage' in navigator && 'estimate' in navigator.storage,
    periodicSync: 'serviceWorker' in navigator && 'PeriodicSyncManager' in window,
    // iOS PWA detection
    iosStandalone: window.navigator.standalone === true,
  }
}

/**
 * Listener untuk deteksi perubahan mode display
 * @param {Function} callback Fungsi callback saat mode berubah
 * @returns {Function} Fungsi untuk menghapus listener
 */
export function listenForDisplayModeChange(callback) {
  const mediaQuery = window.matchMedia('(display-mode: standalone)')
  const listener = (e) => {
    callback(e.matches)
  }

  // Initial check
  callback(mediaQuery.matches)

  // Listen for changes
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(listener)
    return () => mediaQuery.removeListener(listener)
  }
}

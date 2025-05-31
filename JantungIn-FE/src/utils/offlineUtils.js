// Offline data management utilities

/**
 * Cache data for offline access
 * @param {string} key - The storage key
 * @param {any} data - The data to store
 * @param {number} expirationMinutes - Optional expiration time in minutes
 */
export function cacheData(key, data, expirationMinutes = 1440) { // Default 24 hours
  try {
    const item = {
      data,
      timestamp: new Date().getTime(),
      expiration: expirationMinutes * 60 * 1000
    }
    localStorage.setItem(`jantungin_cache_${key}`, JSON.stringify(item))
    return true
  } catch (error) {
    console.error(`Error caching data for ${key}:`, error)
    return false
  }
}

/**
 * Retrieve cached data
 * @param {string} key - The storage key
 * @returns {any|null} - The cached data or null if not found/expired
 */
export function getCachedData(key) {
  try {
    const item = localStorage.getItem(`jantungin_cache_${key}`)
    if (!item) return null

    const parsedItem = JSON.parse(item)
    const now = new Date().getTime()
    
    // Check if data has expired
    if (now - parsedItem.timestamp > parsedItem.expiration) {
      localStorage.removeItem(`jantungin_cache_${key}`)
      return null
    }
    
    return parsedItem.data
  } catch (error) {
    console.error(`Error retrieving cached data for ${key}:`, error)
    return null
  }
}

/**
 * Clear all cached data or specific keys
 * @param {string|null} key - Specific key to clear, or null to clear all
 */
export function clearCachedData(key = null) {
  try {
    if (key) {
      localStorage.removeItem(`jantungin_cache_${key}`)
    } else {
      // Clear all cache items
      for (let i = 0; i < localStorage.length; i++) {
        const storageKey = localStorage.key(i)
        if (storageKey.startsWith('jantungin_cache_')) {
          localStorage.removeItem(storageKey)
        }
      }
    }
    return true
  } catch (error) {
    console.error('Error clearing cached data:', error)
    return false
  }
}

/**
 * Check if the app is running in offline mode
 * @returns {boolean}
 */
export function isOffline() {
  return !navigator.onLine
}

/**
 * Register online/offline event handlers
 * @param {Function} onlineCallback - Function to call when online
 * @param {Function} offlineCallback - Function to call when offline
 * @returns {Function} - Function to remove event listeners
 */
export function registerNetworkHandlers(onlineCallback, offlineCallback) {
  window.addEventListener('online', onlineCallback)
  window.addEventListener('offline', offlineCallback)
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', onlineCallback)
    window.removeEventListener('offline', offlineCallback)
  }
}

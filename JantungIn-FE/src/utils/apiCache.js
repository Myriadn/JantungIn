/**
 * API response caching utilities for offline support
 */

// Cache duration in milliseconds
const DEFAULT_CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Save API response to cache
 * @param {string} key - Cache key
 * @param {Object} data - Data to cache
 * @param {number} duration - Cache duration in ms
 */
export function saveToCache(key, data, duration = DEFAULT_CACHE_DURATION) {
  try {
    const cacheItem = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + duration,
    }

    localStorage.setItem(`jantungin_cache_${key}`, JSON.stringify(cacheItem))
  } catch (error) {
    console.error('Error saving to cache:', error)
  }
}

/**
 * Get data from cache
 * @param {string} key - Cache key
 * @param {boolean} ignoreExpiry - Whether to ignore expiry
 * @returns {Object|null} Cached data or null
 */
export function getFromCache(key, ignoreExpiry = false) {
  try {
    const cacheData = localStorage.getItem(`jantungin_cache_${key}`)

    if (!cacheData) {
      return null
    }

    const cacheItem = JSON.parse(cacheData)

    // Check if cache is expired
    if (!ignoreExpiry && cacheItem.expiry < Date.now()) {
      // Clean up expired item
      localStorage.removeItem(`jantungin_cache_${key}`)
      return null
    }

    return cacheItem.data
  } catch (error) {
    console.error('Error reading from cache:', error)
    return null
  }
}

/**
 * Clear specific cache item
 * @param {string} key - Cache key
 */
export function clearCache(key) {
  localStorage.removeItem(`jantungin_cache_${key}`)
}

/**
 * Clear all cached data
 */
export function clearAllCache() {
  const keys = Object.keys(localStorage)

  keys.forEach((key) => {
    if (key.startsWith('jantungin_cache_')) {
      localStorage.removeItem(key)
    }
  })
}

/**
 * Create a cache key from endpoint and params
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {string} Cache key
 */
export function createCacheKey(endpoint, params = {}) {
  if (Object.keys(params).length === 0) {
    return endpoint
  }

  const paramString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  return `${endpoint}?${paramString}`
}

/**
 * Wrapper function for API calls with caching
 * @param {Function} apiCall - The API call function
 * @param {string} cacheKey - Cache key
 * @param {Object} options - Cache options
 * @returns {Promise} Promise resolving to API response
 */
export async function withCache(apiCall, cacheKey, options = {}) {
  const { duration = DEFAULT_CACHE_DURATION, forceRefresh = false } = options

  // If offline, try to get from cache
  if (!navigator.onLine) {
    const cachedData = getFromCache(cacheKey, true) // Ignore expiry when offline

    if (cachedData) {
      return cachedData
    }

    throw new Error('No cached data available and you are offline')
  }

  // If online and not forcing refresh, check cache first
  if (!forceRefresh) {
    const cachedData = getFromCache(cacheKey)

    if (cachedData) {
      return cachedData
    }
  }

  try {
    // Make the actual API call
    const response = await apiCall()

    // Cache the result
    saveToCache(cacheKey, response, duration)

    return response
  } catch (error) {
    // If online call fails, try cache as fallback
    const cachedData = getFromCache(cacheKey, true)

    if (cachedData) {
      console.log('Using cached data as fallback due to API error')
      return cachedData
    }

    throw error
  }
}

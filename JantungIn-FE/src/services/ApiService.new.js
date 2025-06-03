/**
 * Base API service with common fetch methods and enhanced error handling
 */
class ApiService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    this.headers = {
      'Content-Type': 'application/json',
    }
    this.networkStatus = {
      online: navigator.onLine,
      lastChecked: Date.now(),
    }

    // Listen for online/offline events
    window.addEventListener('online', () => this.handleOnlineStatus(true))
    window.addEventListener('offline', () => this.handleOnlineStatus(false))
  }

  /**
   * Handle online/offline status changes
   * @param {boolean} isOnline - Whether the browser is online
   */
  handleOnlineStatus(isOnline) {
    this.networkStatus.online = isOnline
    this.networkStatus.lastChecked = Date.now()

    // Dispatch custom event for the application to react to network changes
    window.dispatchEvent(
      new CustomEvent('network-status-changed', {
        detail: { online: isOnline },
      }),
    )
  }

  /**
   * Check if network is available
   * @returns {boolean} Network availability
   */
  isNetworkAvailable() {
    // Update the last checked timestamp
    this.networkStatus.lastChecked = Date.now()
    return navigator.onLine
  }

  /**
   * Set authorization token
   * @param {string} token - JWT token
   */
  setToken(token) {
    if (token) {
      this.headers['Authorization'] = `Bearer ${token}`

      // Parse expiration from JWT to determine when to refresh
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload.exp) {
          this.tokenExpiry = payload.exp * 1000 // convert to milliseconds
        }
      } catch (error) {
        console.error('Error parsing token:', error)
      }
    } else {
      delete this.headers['Authorization']
      this.tokenExpiry = null
    }
  }

  /**
   * Get token from storage
   * @returns {string|null} Stored token
   */
  getStoredToken() {
    try {
      const userData = localStorage.getItem('jantungin_user')
      if (userData) {
        const { token } = JSON.parse(userData)
        return token
      }
    } catch (error) {
      console.error('Error reading token:', error)
    }
    return null
  }

  /**
   * Initialize token from storage
   */
  initializeFromStorage() {
    const token = this.getStoredToken()
    if (token) {
      this.setToken(token)
    }
  }

  /**
   * HTTP GET request with enhanced error handling
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise} Response promise
   */
  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`)

    // Add query parameters
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key])
      }
    })

    try {
      // Check network availability
      if (!this.isNetworkAvailable()) {
        throw new Error('No network connection')
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers,
      })

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API get error:', error)

      // Add network status to error for UI handling
      error.isNetworkError = !navigator.onLine

      throw error
    }
  }

  /**
   * HTTP POST request with enhanced error handling
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise} Response promise
   */
  async post(endpoint, data = {}) {
    try {
      // Check network availability
      if (!this.isNetworkAvailable()) {
        throw new Error('No network connection')
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API post error:', error)

      // Add network status to error for UI handling
      error.isNetworkError = !navigator.onLine

      throw error
    }
  }

  /**
   * HTTP PUT request with enhanced error handling
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise} Response promise
   */
  async put(endpoint, data = {}) {
    try {
      // Check network availability
      if (!this.isNetworkAvailable()) {
        throw new Error('No network connection')
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API put error:', error)

      // Add network status to error for UI handling
      error.isNetworkError = !navigator.onLine

      throw error
    }
  }

  /**
   * HTTP DELETE request with enhanced error handling
   * @param {string} endpoint - API endpoint
   * @returns {Promise} Response promise
   */
  async delete(endpoint) {
    try {
      // Check network availability
      if (!this.isNetworkAvailable()) {
        throw new Error('No network connection')
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.headers,
      })

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API delete error:', error)

      // Add network status to error for UI handling
      error.isNetworkError = !navigator.onLine

      throw error
    }
  }
}

// Create singleton instance
const apiService = new ApiService()

export default apiService

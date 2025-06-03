/**
 * Base API service with Axios and enhanced error handling
 */
import axios from 'axios'

class ApiService {
  constructor() {
    // Use environment variable for API URL with fallback
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

    // Create axios instance
    this.axios = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000, // 15 seconds timeout
      withCredentials: true, // Enable cookies for sessions if needed
    })

    this.networkStatus = {
      online: navigator.onLine,
      lastChecked: Date.now(),
    }

    // Listen for online/offline events
    window.addEventListener('online', () => this.handleOnlineStatus(true))
    window.addEventListener('offline', () => this.handleOnlineStatus(false))

    // Initialize token from storage on startup
    this.initializeFromStorage()

    // Setup interceptors
    this.setupInterceptors()

    console.log(`ApiService initialized with baseUrl: ${this.baseUrl}`)
  }

  /**
   * Setup axios interceptors for global error handling
   */
  setupInterceptors() {
    // Response interceptor
    this.axios.interceptors.response.use(
      (response) => {
        // Return just the response data
        return response.data
      },
      (error) => {
        // Handle errors
        if (error.response) {
          // Server responded with an error status
          console.error('API error response:', error.response.status, error.response.data)

          // Format the error with more details
          const formattedError = new Error(
            error.response.data?.message || `API error: ${error.response.status}`,
          )
          formattedError.status = error.response.status
          formattedError.data = error.response.data

          return Promise.reject(formattedError)
        } else if (error.request) {
          // Network error or no response received
          console.error('API network error:', error.message)
          const networkError = new Error('Network error, please check your connection')
          networkError.isNetworkError = true
          return Promise.reject(networkError)
        } else {
          // Error in request configuration
          console.error('API request error:', error.message)
          return Promise.reject(error)
        }
      },
    )
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
    this.networkStatus.lastChecked = Date.now()
    return navigator.onLine
  }

  /**
   * Set authorization token
   * @param {string} token - JWT token
   */
  setToken(token) {
    console.log('Setting API token:', token ? 'Token present' : 'No token')
    if (token) {
      this.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      // Parse expiration from JWT to determine when to refresh
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload.exp) {
          this.tokenExpiry = payload.exp * 1000 // convert to milliseconds
          console.log('Token will expire at:', new Date(this.tokenExpiry).toISOString())
        }
      } catch (error) {
        console.error('Error parsing token:', error)
      }
    } else {
      delete this.axios.defaults.headers.common['Authorization']
      this.tokenExpiry = null
      console.log('Cleared authorization token')
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
    try {
      // Check network availability
      if (!this.isNetworkAvailable()) {
        throw new Error('No network connection')
      }

      // Log full URL for debugging in development
      if (import.meta.env.DEV) {
        console.log('GET request to:', `${this.baseUrl}${endpoint}`)
      }

      return await this.axios.get(endpoint, { params })
    } catch (error) {
      // If error was already processed by interceptor, just throw it
      if (error.isNetworkError) {
        throw error
      }

      console.error('API get error:', error)
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

      // Log request details in development
      if (import.meta.env.DEV) {
        console.log('POST request to:', `${this.baseUrl}${endpoint}`)
        console.log('POST data:', data)
      }

      return await this.axios.post(endpoint, data)
    } catch (error) {
      // If error was already processed by interceptor, just throw it
      if (error.isNetworkError) {
        throw error
      }

      console.error('API post error:', error)
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

      return await this.axios.put(endpoint, data)
    } catch (error) {
      // If error was already processed by interceptor, just throw it
      if (error.isNetworkError) {
        throw error
      }

      console.error('API put error:', error)
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

      return await this.axios.delete(endpoint)
    } catch (error) {
      // If error was already processed by interceptor, just throw it
      if (error.isNetworkError) {
        throw error
      }

      console.error('API delete error:', error)
      throw error
    }
  }
}

// Create singleton instance
const apiService = new ApiService()

export default apiService

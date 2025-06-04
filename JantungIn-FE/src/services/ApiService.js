/**
 * Base API service with Axios and enhanced error handling
 */
import axios from 'axios'
import { generateOperationId } from '@/utils/notifications'

class ApiService {
  constructor() {
    // Use environment variable for API URL with fallback
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    console.log('API Service initialized with baseURL:', this.baseUrl)

    // Timeout configuration
    this.defaultTimeout = import.meta.env.VITE_API_TIMEOUT
      ? parseInt(import.meta.env.VITE_API_TIMEOUT)
      : 15000 // 15 seconds default timeout

    // Create axios instance
    this.axios = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: this.defaultTimeout,
      withCredentials: false, // Disable cookies to avoid CORS issues
    })

    // Retry configuration
    this.maxRetries = import.meta.env.VITE_API_MAX_RETRIES
      ? parseInt(import.meta.env.VITE_API_MAX_RETRIES)
      : 2
    this.retryDelay = import.meta.env.VITE_API_RETRY_DELAY
      ? parseInt(import.meta.env.VITE_API_RETRY_DELAY)
      : 1000 // 1 second delay between retries
    this.maxRetryDelay = import.meta.env.VITE_API_MAX_RETRY_DELAY
      ? parseInt(import.meta.env.VITE_API_MAX_RETRY_DELAY)
      : 5000 // 5 seconds maximum delay

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
        // Log successful responses in development mode
        if (import.meta.env.DEV) {
          console.log(
            `API Success [${response.config.method.toUpperCase()}] ${response.config.url}:`,
            response.status,
          )
          if (response.data && response.data.statusCode) {
            console.log(
              `Response statusCode: ${response.data.statusCode}, message: ${response.data.message}`,
            )
          }
        }
        // Return the full response (not just data) to allow access to both response.data and response.status
        return response
      },
      (error) => {
        // Handle errors
        if (error.response) {
          // Server responded with an error status
          console.error(
            `API Error [${error.config?.method?.toUpperCase() || 'UNKNOWN'}] ${error.config?.url || 'UNKNOWN'}:`,
            error.response.status,
            error.response.data,
          )

          // Format the error with more details
          const errorMessage = error.response.data?.message || `API error: ${error.response.status}`
          const formattedError = new Error(errorMessage)
          formattedError.status = error.response.status
          formattedError.data = error.response.data
          formattedError.endpoint = error.config?.url
          formattedError.method = error.config?.method?.toUpperCase()

          return Promise.reject(formattedError)
        } else if (error.request) {
          // Network error or no response received
          console.error('API network error:', {
            url: error.config?.url || 'UNKNOWN',
            method: error.config?.method?.toUpperCase() || 'UNKNOWN',
            message: error.message,
          })

          const networkError = new Error(
            'Kesalahan jaringan, silakan periksa koneksi internet Anda',
          )
          networkError.isNetworkError = true
          networkError.originalError = error
          networkError.endpoint = error.config?.url
          networkError.method = error.config?.method?.toUpperCase()

          return Promise.reject(networkError)
        } else {
          // Error in request configuration
          console.error('API request configuration error:', error.message)

          const configError = new Error('Kesalahan konfigurasi permintaan API')
          configError.originalError = error

          return Promise.reject(configError)
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

    console.log(`Network status changed: ${isOnline ? 'Online' : 'Offline'}`)

    // Dispatch custom event for the application to react to network changes
    window.dispatchEvent(
      new CustomEvent('network-status-changed', {
        detail: { online: isOnline },
      }),
    )
  }

  /**
   * Check if network is available
   * @param {boolean} testEndpoint - Whether to do an actual test ping
   * @returns {Promise<boolean>} Network availability
   */
  async isNetworkAvailable(testEndpoint = false) {
    // Update last checked timestamp
    this.networkStatus.lastChecked = Date.now()

    // First check the navigator.onLine property
    const browserOnline = navigator.onLine

    // If browser reports offline, no need to test further
    if (!browserOnline) {
      this.networkStatus.online = false
      return false
    }

    // If requested, verify connectivity with a real network request
    if (testEndpoint) {
      try {
        // Create a minimal request to test connectivity
        // We use a small image or the /health endpoint if available
        const testUrl = `${this.baseUrl}/health`
        const controller = new AbortController()

        // Set a short timeout for this test
        const timeoutId = setTimeout(() => controller.abort(), 3000)

        const response = await fetch(testUrl, {
          method: 'HEAD',
          cache: 'no-store',
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        // Update network status based on response
        this.networkStatus.online = response.ok
        return response.ok
      } catch (error) {
        console.warn('Network connectivity test failed:', error.message)

        // If the fetch was aborted due to timeout, or other network error
        // we'll assume offline, but not update the status
        // because this could be a temporary issue
        return false
      }
    }

    // If we didn't do a real test, just use the browser's online status
    this.networkStatus.online = browserOnline
    return browserOnline
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
   * @param {Object} options - Additional options
   * @returns {Promise} Response promise
   */
  async get(endpoint, params = {}, options = {}) {
    const { showNotifications = false, operationName = `GET ${endpoint}` } = options

    // Log full URL for debugging in development
    if (import.meta.env.DEV) {
      console.log('GET request to:', `${this.baseUrl}${endpoint}`)
    }

    // Check network availability before attempting the request
    if (!(await this.isNetworkAvailable())) {
      const networkError = new Error('Tidak ada koneksi internet')
      networkError.isNetworkError = true
      throw networkError
    }

    // Use the retry mechanism for network errors
    return this.retryRequest(
      async () => {
        try {
          return await this.axios.get(endpoint, { params })
        } catch (error) {
          // If it's a network error, we'll let the retry mechanism handle it
          if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            console.error('Request timeout, will retry:', error.message)
            error.isTimeout = true
            throw error
          }

          // For other errors, just rethrow
          throw error
        }
      },
      this.maxRetries,
      {
        showNotification: showNotifications,
        operationName,
      },
    )
  }

  /**
   * HTTP POST request with enhanced error handling
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Additional options
   * @returns {Promise} Response promise
   */
  async post(endpoint, data = {}, options = {}) {
    const { showNotifications = false, operationName = `POST ${endpoint}` } = options

    // Log request details in development
    if (import.meta.env.DEV) {
      console.log('POST request to:', `${this.baseUrl}${endpoint}`)
      console.log('POST data:', data)
    }

    // Check network availability before attempting the request
    if (!(await this.isNetworkAvailable())) {
      const networkError = new Error('Tidak ada koneksi internet')
      networkError.isNetworkError = true
      throw networkError
    }

    // Use the retry mechanism for network errors
    return this.retryRequest(
      async () => {
        try {
          return await this.axios.post(endpoint, data)
        } catch (error) {
          // If it's a network error, we'll let the retry mechanism handle it
          if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            console.error('Request timeout, will retry:', error.message)
            error.isTimeout = true
            throw error
          }

          // For other errors, just rethrow
          throw error
        }
      },
      this.maxRetries,
      {
        showNotification: showNotifications,
        operationName,
      },
    )
  }

  /**
   * HTTP PUT request with enhanced error handling
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Additional options
   * @returns {Promise} Response promise
   */
  async put(endpoint, data = {}, options = {}) {
    const { showNotifications = false, operationName = `PUT ${endpoint}` } = options

    // Log request details in development
    if (import.meta.env.DEV) {
      console.log('PUT request to:', `${this.baseUrl}${endpoint}`)
      console.log('PUT data:', data)
    }

    // Check network availability before attempting the request
    if (!(await this.isNetworkAvailable())) {
      const networkError = new Error('Tidak ada koneksi internet')
      networkError.isNetworkError = true
      throw networkError
    }

    // Use the retry mechanism for network errors
    return this.retryRequest(
      async () => {
        try {
          return await this.axios.put(endpoint, data)
        } catch (error) {
          // If it's a network error, we'll let the retry mechanism handle it
          if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            console.error('Request timeout, will retry:', error.message)
            error.isTimeout = true
            throw error
          }

          // For other errors, just rethrow
          throw error
        }
      },
      this.maxRetries,
      {
        showNotification: showNotifications,
        operationName,
      },
    )
  }

  /**
   * HTTP DELETE request with enhanced error handling
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional options
   * @returns {Promise} Response promise
   */
  async delete(endpoint, options = {}) {
    const { showNotifications = false, operationName = `DELETE ${endpoint}` } = options

    // Log request details in development
    if (import.meta.env.DEV) {
      console.log('DELETE request to:', `${this.baseUrl}${endpoint}`)
    }

    // Check network availability before attempting the request
    if (!(await this.isNetworkAvailable())) {
      const networkError = new Error('Tidak ada koneksi internet')
      networkError.isNetworkError = true
      throw networkError
    }

    // Use the retry mechanism for network errors
    return this.retryRequest(
      async () => {
        try {
          return await this.axios.delete(endpoint)
        } catch (error) {
          // If it's a network error, we'll let the retry mechanism handle it
          if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            console.error('Request timeout, will retry:', error.message)
            error.isTimeout = true
            throw error
          }

          // For other errors, just rethrow
          throw error
        }
      },
      this.maxRetries,
      {
        showNotification: showNotifications,
        operationName,
      },
    )
  }

  /**
   * Retry a failed request
   * @param {Function} apiCall - The API call function to retry
   * @param {number} retries - Number of retries left
   * @param {Object} options - Additional options
   * @returns {Promise} - The API call result
   */
  async retryRequest(apiCall, retries = this.maxRetries, options = {}) {
    const { showNotification = false, operationName = 'API Request', requestId = null } = options

    // Generate a unique ID for this operation if one was not provided
    const operationId = requestId || generateOperationId('api-retry')

    // Notification handling
    let notifyUser = null
    if (showNotification && typeof window !== 'undefined') {
      // We'll dynamically import the notification module only if needed
      try {
        const { useApiNotifications } = await import('@/utils/notifications')
        notifyUser = useApiNotifications()
      } catch (err) {
        console.warn('Failed to load notification module:', err)
      }
    }

    try {
      return await apiCall()
    } catch (error) {
      // Only retry network errors or timeout errors
      if (
        retries > 0 &&
        (error.isNetworkError || error.code === 'ECONNABORTED' || error.message.includes('timeout'))
      ) {
        const attemptNumber = this.maxRetries - retries + 1

        console.log(`Request failed, retrying... (${attemptNumber}/${this.maxRetries})`)

        // Show notification if requested
        if (showNotification && notifyUser) {
          notifyUser.showRetryNotification(operationId, {
            message: `${operationName}: ${error.message}`,
            attempt: attemptNumber,
            maxAttempts: this.maxRetries,
            type: 'warning',
          })
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay))

        // Increase delay for next retry (exponential backoff)
        this.retryDelay = Math.min(this.retryDelay * 1.5, this.maxRetryDelay)

        // Pass along the notification options to the next retry
        return this.retryRequest(apiCall, retries - 1, {
          showNotification,
          operationName,
          requestId: operationId,
        })
      }

      // If we're out of retries or it's not a network error, throw the error
      // But first close any pending notification
      if (showNotification && notifyUser) {
        notifyUser.showError(operationId, `${operationName}: ${error.message}`)
      }

      throw error
    }
  }
}

// Create singleton instance
const apiService = new ApiService()

export default apiService

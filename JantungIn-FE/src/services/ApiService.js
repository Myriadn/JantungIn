/**
 * Base API service with common fetch methods
 */
class ApiService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    this.headers = {
      'Content-Type': 'application/json',
    }
  }

  /**
   * Set authorization token
   * @param {string} token - JWT token
   */
  setToken(token) {
    if (token) {
      this.headers['Authorization'] = `Bearer ${token}`
    } else {
      delete this.headers['Authorization']
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
   * HTTP GET request
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
      throw error
    }
  }

  /**
   * HTTP POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise} Response promise
   */
  async post(endpoint, data = {}) {
    try {
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
      throw error
    }
  }

  /**
   * HTTP PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise} Response promise
   */
  async put(endpoint, data = {}) {
    try {
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
      throw error
    }
  }

  /**
   * HTTP DELETE request
   * @param {string} endpoint - API endpoint
   * @returns {Promise} Response promise
   */
  async delete(endpoint) {
    try {
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
      throw error
    }
  }
}

// Create singleton instance
const apiService = new ApiService()

export default apiService

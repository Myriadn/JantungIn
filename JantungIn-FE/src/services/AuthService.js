import apiService from './ApiService'
import { UserModel } from '@/models/UserModel'

/**
 * Authentication service for login, register, and user management
 */
class AuthService {
  /**
   * User login
   * @param {string} nik - User NIK
   * @param {string} password - User password
   * @returns {Promise<UserModel>} User model with token
   */
  async login(nik, password) {
    try {
      // Try to make the API call if online
      if (navigator.onLine) {
        const response = await apiService.post('/api/v1/auth/login', { nik, password })
        console.log('Login API response:', response)

        // The API returns: { statusCode, message, data: { id, name, email, role, token } }
        if (!response.data || !response.data.token) {
          throw new Error('Invalid response from server: missing token')
        }

        console.log('Login successful, received token')

        // Set token first before saving to storage
        apiService.setToken(response.data.token)

        // Save user data to local storage for offline mode
        this.saveUserToStorage({
          ...response.data,
          nik: nik,
          password: password, // Only for offline login, in a real app use more secure methods
        })

        return new UserModel(response.data)
      } else {
        // Offline login from cache
        return await this.offlineLogin(nik, password)
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  /**
   * User login with email
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<UserModel>} User model with token
   */
  async loginWithEmail(email, password) {
    try {
      if (navigator.onLine) {
        const response = await apiService.post('/api/v1/auth/login-email', { email, password })

        if (!response.data || !response.data.token) {
          throw new Error('Invalid response from server: missing token')
        }

        this.saveUserToStorage({
          ...response.data,
          email: email,
          password: password, // Only for offline login
        })

        apiService.setToken(response.data.token)

        return new UserModel(response.data)
      } else {
        throw new Error('Cannot login with email while offline')
      }
    } catch (error) {
      console.error('Email login error:', error)
      throw error
    }
  }

  /**
   * Offline login from cached credentials
   * @param {string} nik - User NIK
   * @param {string} password - User password
   * @returns {Promise<UserModel>} User model
   */
  async offlineLogin(nik, password) {
    const userData = localStorage.getItem('jantungin_user')

    if (!userData) {
      throw new Error('No cached user found for offline login')
    }

    const parsedData = JSON.parse(userData)

    if (parsedData.nik === nik && parsedData.password === password) {
      return new UserModel(parsedData)
    } else {
      throw new Error('Invalid credentials for offline login')
    }
  }

  /**
   * User registration
   * @param {Object} userData - User registration data with name, nik, password, and optional email and dateOfBirth
   * @returns {Promise} Registration result
   */
  async register(userData) {
    try {
      // Validate user data
      if (!userData.nik || !userData.password || !userData.name) {
        throw new Error('Missing required fields for registration')
      }

      const response = await apiService.post('/api/v1/auth/register', userData)

      // API returns: { statusCode: 201, message: "User registered successfully", data: { id, name, email, role, token } }
      if (!response.data || !response.data.token) {
        throw new Error('Invalid response from server during registration')
      }

      // Set token for future API calls
      apiService.setToken(response.data.token)

      // Save user data for offline usage
      this.saveUserToStorage({
        ...response.data,
        nik: userData.nik,
        password: userData.password, // Only for offline login
      })

      return new UserModel(response.data)
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  /**
   * Doctor/admin login
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @returns {Promise} Login result
   */
  async adminLogin(email, password) {
    try {
      // Login request
      console.log('Attempting admin login...')
      const loginResponse = await apiService.post('/api/v1/admin/login', { email, password })

      // The login response can either be in data.data or directly in data
      const responseData = loginResponse.data?.data || loginResponse.data

      if (!responseData?.token) {
        console.error('Invalid login response:', loginResponse.data)
        throw new Error('Invalid response from server: missing token')
      }

      const { token, ...userData } = responseData
      console.log('Login successful, setting token...')

      // Set token for future API calls
      apiService.setToken(token)

      try {
        // Get full admin profile with new token
        console.log('Fetching admin profile...')
        const profileResponse = await apiService.get('/api/v1/admin/profile')

        // Profile data can be in data.data or directly in data
        const profileData = profileResponse.data?.data || profileResponse.data

        if (!profileData) {
          console.error('Invalid profile response:', profileResponse.data)
          throw new Error('Failed to get admin profile')
        }

        // Combine login data and profile data
        const fullUserData = {
          ...userData, // Basic data from login (id, name, email, role)
          ...profileResponse.data.data, // Additional data from profile
          token, // Store token for offline/refresh purposes
        }

        // Save complete user data to storage
        this.saveUserToStorage(fullUserData)
        console.log('Admin login complete')

        return fullUserData
      } catch (error) {
        // If profile fetch fails, still return login data
        console.error('Error fetching profile:', error)
        this.saveUserToStorage({ ...userData, token })
        return userData
      }
    } catch (error) {
      console.error('Admin login error:', error)
      throw error
    }
  }

  /**
   * Save user data to local storage
   * @param {Object} userData - User data
   */
  saveUserToStorage(userData) {
    localStorage.setItem('jantungin_user', JSON.stringify(userData))
  }

  /**
   * Get current user from storage
   * @returns {UserModel|null} Current user
   */
  getCurrentUser() {
    try {
      const userData = localStorage.getItem('jantungin_user')
      return userData ? UserModel.fromStorage(JSON.parse(userData)) : null
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    return !!this.getCurrentUser()
  }

  /**
   * Check if current user is admin
   * @returns {boolean} Admin status
   */
  isAdmin() {
    const user = this.getCurrentUser()
    return user ? user.role === 'admin' : false
  }

  /**
   * Get user profile from API
   * @returns {Promise<Object>} User profile data
   */
  async getProfile() {
    try {
      // Check if we have auth token
      const token = apiService.getStoredToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await apiService.get('/api/v1/auth/profile')
      console.log('Profile response:', response)

      if (!response.data) {
        throw new Error('Invalid profile response from server')
      }

      // Update stored user data with latest profile info
      const currentUser = this.getCurrentUser()
      if (currentUser) {
        const updatedUserData = {
          ...JSON.parse(localStorage.getItem('jantungin_user')),
          ...response.data,
        }
        this.saveUserToStorage(updatedUserData)
      }

      return response.data
    } catch (error) {
      console.error('Error getting profile:', error)
      throw error
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data (name, dateOfBirth)
   * @returns {Promise<Object>} Updated profile
   */
  async updateProfile(profileData) {
    try {
      const response = await apiService.put('/api/v1/auth/profile', profileData)

      if (!response.data) {
        throw new Error('Invalid response from server during profile update')
      }

      // Update stored user data with latest profile info
      const currentUser = this.getCurrentUser()
      if (currentUser) {
        const updatedUserData = {
          ...JSON.parse(localStorage.getItem('jantungin_user')),
          ...response.data,
        }
        this.saveUserToStorage(updatedUserData)
      }

      return response.data
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  /**
   * Logout current user
   */
  logout() {
    localStorage.removeItem('jantungin_user')
    apiService.setToken(null)
  }
}

// Create singleton instance
const authService = new AuthService()

export default authService

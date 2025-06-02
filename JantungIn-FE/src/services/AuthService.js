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
        const response = await apiService.post('/auth/login', { nik, password })

        // Save user data to local storage for offline mode
        this.saveUserToStorage({
          ...response.user,
          token: response.token,
          nik: nik,
          password: password, // Only for offline login, in a real app use more secure methods
        })

        apiService.setToken(response.token)

        return new UserModel(response.user)
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
   * @param {Object} userData - User registration data
   * @returns {Promise} Registration result
   */
  async register(userData) {
    return await apiService.post('/auth/register', userData)
  }

  /**
   * Doctor/admin login
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @returns {Promise} Login result
   */
  async adminLogin(email, password) {
    const response = await apiService.post('/admin/login', { email, password })

    if (response.token) {
      apiService.setToken(response.token)

      this.saveUserToStorage({
        ...response.admin,
        token: response.token,
        role: 'admin',
      })
    }

    return response
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

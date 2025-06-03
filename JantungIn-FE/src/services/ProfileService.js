import apiService from './ApiService'

/**
 * Service for handling admin/doctor profile related API calls
 */
class ProfileService {
  /**
   * Get admin profile data
   * @returns {Promise} Admin profile data
   */
  async getProfile() {
    try {
      const response = await apiService.get('/api/v1/admin/profile')
      return response.data
    } catch (error) {
      console.error('Error getting admin profile:', error)
      throw error
    }
  }

  /**
   * Get admin dashboard statistics
   * @returns {Promise} Dashboard statistics
   */
  async getDashboardStats() {
    try {
      const response = await apiService.get('/api/v1/admin/dashboard')
      return response.data
    } catch (error) {
      console.error('Error getting dashboard stats:', error)
      throw error
    }
  }

  /**
   * Get admin recent activities
   * @returns {Promise} Recent activities data
   */
  async getRecentActivities() {
    try {
      const response = await apiService.get('/api/v1/admin/activities/recent')
      return response.data
    } catch (error) {
      console.error('Error getting recent activities:', error)
      throw error
    }
  }

  /**
   * Update admin profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} Updated profile data
   */
  async updateProfile(profileData) {
    try {
      const response = await apiService.put('/api/v1/admin/profile', profileData)
      return response.data
    } catch (error) {
      console.error('Error updating admin profile:', error)
      throw error
    }
  }
}

export default new ProfileService()

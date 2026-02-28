import apiService from './ApiService'

class StatisticsService {
  /**
   * Get public statistics untuk homepage
   * Endpoint: GET /api/v1/stats (tidak butuh auth)
   * Response: { totalUsers, totalDoctors, totalDiagnoses }
   */
  async getPublicStats() {
    try {
      const response = await apiService.get('/api/v1/stats')
      const responseData = response.data || response
      return responseData.data || responseData
    } catch (error) {
      console.error('Error getting public stats:', error)
      return { totalUsers: 0, totalDoctors: 0, totalDiagnoses: 0 }
    }
  }

  /**
   * Get admin statistics untuk dashboard admin
   * Endpoint: GET /api/v1/admin/stats (butuh auth admin/dokter)
   * Response: { totalVisits, todayVisits, monthlyVisits, totalUsers, totalDoctors, totalDiagnoses, dailyVisits }
   */
  async getAdminStats() {
    try {
      const response = await apiService.get('/api/v1/admin/stats')
      const responseData = response.data || response
      return responseData.data || responseData
    } catch (error) {
      console.error('Error getting admin stats:', error)
      return {
        totalVisits: 0,
        todayVisits: 0,
        monthlyVisits: 0,
        totalUsers: 0,
        totalDoctors: 0,
        totalDiagnoses: 0,
        dailyVisits: [],
      }
    }
  }

  /**
   * @deprecated gunakan getAdminStats() — untuk backward compat dengan accountAdmin.js
   */
  async getDiagnosisStats() {
    const stats = await this.getAdminStats()
    return {
      totalDiagnosis: stats.totalDiagnoses || 0,
      totalUsers: stats.totalUsers || 0,
    }
  }
}

export default new StatisticsService()

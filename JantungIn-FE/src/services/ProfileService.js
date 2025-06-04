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
      // Coba mengakses API profile
      try {
        console.log('Fetching admin profile...')
        const response = await apiService.get('/api/v1/admin/profile')
        console.log('Admin profile response:', response)
        return response
      } catch (apiError) {
        console.warn('API profile tidak tersedia, menggunakan data fallback:', apiError.message)

        // Fallback data jika API tidak tersedia atau error
        return {
          data: {
            statusCode: 200,
            message: 'Profil berhasil diambil (fallback)',
            data: {
              name: 'Dokter Baru',
              email: 'dokter.baru@jantungin.com',
              role: 'dokter',
              specialty: 'Cardiology',
              department: 'Cardiology',
              position: 'Senior Cardiologist',
              license: '1234567890',
              hospital: 'JantungIn Hospital',
              dateOfBirth: '1985-01-15',
              yearsOfExperience: 12,
              certifications: ['Board Certified Cardiologist', 'Medical Doctor'],
            },
          },
        }
      }
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
      try {
        console.log('Fetching dashboard stats...')
        const response = await apiService.get('/api/v1/admin/dashboard')
        console.log('Dashboard stats response:', response)
        return response
      } catch (apiError) {
        console.warn('API dashboard tidak tersedia, menggunakan data fallback:', apiError.message)

        // Fallback data jika API tidak tersedia atau error
        return {
          data: {
            users: {
              total: 120,
              newLastWeek: 8,
              active: 85,
            },
            diagnoses: {
              total: 450,
              newLastWeek: 24,
              monthlyTotal: 98,
              recentConsultations: 15,
              monthlyConsultations: 62,
              recentReviews: 7,
              monthlyReviews: 32,
            },
          },
        }
      }
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
      try {
        // Coba kesiapan endpoint untuk fitur baru
        console.log('Checking if activities endpoint available...')
        const response = await apiService.get('/api/v1/admin/activities/recent')
        console.log('Activities response:', response)
        return response
      } catch (apiError) {
        console.warn('API activities tidak tersedia, menggunakan data dummy:', apiError.message)

        // Return dummy data untuk sementara dengan format yang kompatibel dengan hasil dari axios
        return {
          data: {
            statusCode: 200,
            message: 'Data aktivitas berhasil diambil (fallback)',
            data: [
              {
                type: 'diagnosis',
                patientId: 'P-001',
                patientName: 'Ahmad Saputra',
                createdAt: new Date(Date.now() - 3600000).toISOString(),
                status: 'Completed',
              },
              {
                type: 'consultation',
                patientId: 'P-002',
                patientName: 'Budi Santoso',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                status: 'Scheduled',
              },
              {
                type: 'review',
                patientId: 'P-003',
                patientName: 'Citra Dewi',
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                status: 'Completed',
              },
            ],
          },
        }
      }
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
      console.log('Updating profile with data:', profileData)
      const response = await apiService.put('/api/v1/admin/profile', profileData)
      console.log('Profile update response:', response)
      return response
    } catch (error) {
      console.error('Error updating admin profile:', error)
      throw error
    }
  }
}

export default new ProfileService()

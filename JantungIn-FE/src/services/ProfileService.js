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
   * Data diambil dari endpoint diagnosa: /api/v1/admin/diagnosis/all
   * Hanya menampilkan 3 diagnosa terbaru sebagai aktivitas
   * @returns {Promise} Recent activities data (array of 3 most recent diagnoses)
   */
  async getRecentActivities() {
    try {
      try {
        // Import patientService untuk mengambil data pasien
        const patientService = (await import('./PatientService')).default

        // Ambil data diagnosa dari endpoint /api/v1/admin/diagnosis/all
        console.log('Fetching recent activities from diagnoses endpoint...')

        // Memanfaatkan endpoint diagnosis yang sudah tersedia
        const response = await apiService.get('/api/v1/admin/diagnosis/all')

        console.log('Diagnoses API response for activities:', response)

        // Ekstrak data diagnosa
        const responseData = response.data || response
        const diagnosesData = responseData.data || responseData

        if (!Array.isArray(diagnosesData)) {
          throw new Error('Invalid diagnoses data format')
        }

        // Urutkan berdasarkan tanggal terbaru
        const sortedDiagnoses = [...diagnosesData].sort((a, b) => {
          // Gunakan createdAt atau updatedAt untuk mengurutkan
          const dateA = new Date(a.createdAt || a.updatedAt || 0)
          const dateB = new Date(b.createdAt || b.updatedAt || 0)
          return dateB - dateA // Descending order (terbaru dulu)
        })

        // Ambil hanya 3 diagnosa terbaru
        const recentDiagnoses = sortedDiagnoses.slice(0, 3)

        // Format data untuk aktivitas dan tambahkan nama pasien
        const activities = []

        for (const diagnosis of recentDiagnoses) {
          const patientId = diagnosis.userId || diagnosis.patientId
          let patientName = diagnosis.patientName || 'Pasien Tidak Diketahui'

          // Coba ambil data pasien jika patientId tersedia
          if (patientId) {
            try {
              const patientData = await patientService.getPatientById(patientId)
              if (patientData && patientData.name) {
                patientName = patientData.name
              }
            } catch (err) {
              console.warn(`Could not fetch patient name for ID ${patientId}:`, err.message)
              // Jika gagal, gunakan nama yang ada di diagnosis atau default
            }
          }

          activities.push({
            type: 'diagnosis',
            patientId: patientId || 'Unknown',
            patientName: patientName,
            createdAt: diagnosis.createdAt || diagnosis.updatedAt || new Date().toISOString(),
            status: 'Completed',
          })
        }

        return {
          data: activities,
        }
      } catch (apiError) {
        console.warn(
          'API diagnoses tidak tersedia untuk aktivitas, menggunakan data dummy:',
          apiError.message,
        )

        // Return dummy data untuk sementara dengan format yang kompatibel dengan hasil dari axios
        return {
          data: [
            {
              type: 'diagnosis',
              patientId: 'P-001',
              patientName: 'Ahmad Saputra',
              createdAt: new Date(Date.now() - 3600000).toISOString(),
              status: 'Completed',
            },
            {
              type: 'diagnosis',
              patientId: 'P-002',
              patientName: 'Budi Santoso',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              status: 'Completed',
            },
            {
              type: 'diagnosis',
              patientId: 'P-003',
              patientName: 'Citra Dewi',
              createdAt: new Date(Date.now() - 172800000).toISOString(),
              status: 'Completed',
            },
          ],
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

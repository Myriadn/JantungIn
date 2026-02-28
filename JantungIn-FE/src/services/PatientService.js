/**
 * Service for patient data management and search operations
 */
import apiService from './ApiService'

class PatientService {
  /**
   * Search for patients by name or ID (NIK)
   * @param {string} query - Search query (name or NIK)
   * @returns {Promise<Array>} Patients matching the search criteria
   */
  async searchPatients(query) {
    try {
      console.log('Searching for patients with query:', query)

      if (!query || query.trim() === '') {
        console.warn('Empty search query provided')
        return []
      }

      // Call the admin patients search endpoint with query parameters
      const response = await apiService.get('/api/v1/admin/patients/search', {
        query: query.trim(),
      })

      console.log('Patient search response:', response)

      // Go API: { statusCode, message, data: [...] }
      const responseData = response.data || response
      const patients = responseData.data || responseData

      const patientArray = Array.isArray(patients) ? patients : []

      // Ensure we're caching the results for offline use
      if (patientArray.length > 0) {
        this.cachePatients(patientArray)
      }

      return patientArray
    } catch (error) {
      console.error('Error searching for patients:', error)

      // Try to return cached results if network request fails
      if (error.isNetworkError) {
        console.log('Network error, trying cached results')
        return this.searchCachedPatients(query)
      }

      throw error
    }
  }

  /**
   * Get all patients (with pagination)
   * @param {number} page - Page number
   * @param {number} limit - Records per page
   * @returns {Promise<Object>} Paginated patients list
   */
  async getAllPatients(page = 1, limit = 10) {
    try {
      const response = await apiService.get('/api/v1/admin/patients', {
        page,
        limit,
      })

      // Go API: { statusCode, message, data: [...] }
      const responseData = response.data || response
      const patients = responseData.data || responseData
      return Array.isArray(patients) ? patients : []
    } catch (error) {
      console.error('Error getting all patients:', error)
      throw error
    }
  }

  /**
   * Get patient by ID
   * @param {string} id - Patient ID
   * @returns {Promise<Object>} Patient data
   */
  async getPatientById(id) {
    try {
      if (!id) throw new Error('Patient ID is required')

      const response = await apiService.get(`/api/v1/admin/patients/${id}`)

      // Go API: { statusCode, message, data: {...} }
      const responseData = response.data || response
      return responseData.data || responseData || null
    } catch (error) {
      console.error(`Error getting patient with ID ${id}:`, error)
      throw error
    }
  }

  /**
   * Cache patient data for offline use
   * @param {Array} patients - Patient data to cache
   */
  cachePatients(patients) {
    try {
      if (!Array.isArray(patients) || patients.length === 0) return

      // Get existing cache
      let cachedPatients = []
      const cached = localStorage.getItem('jantungin_cached_patients')

      if (cached) {
        try {
          cachedPatients = JSON.parse(cached)
        } catch (e) {
          console.error('Error parsing cached patients:', e)
          cachedPatients = []
        }
      }

      // Create a map of existing patients by ID for quick lookup
      const existingMap = new Map(cachedPatients.map((p) => [p.id, p]))

      // Update cache with new patients
      patients.forEach((patient) => {
        existingMap.set(patient.id, patient)
      })

      // Convert map back to array and store
      const updatedCache = Array.from(existingMap.values())
      localStorage.setItem('jantungin_cached_patients', JSON.stringify(updatedCache))

      console.log(`Cached ${patients.length} patients, total cache size: ${updatedCache.length}`)
    } catch (error) {
      console.error('Error caching patients:', error)
    }
  }

  /**
   * Get cached patients
   * @returns {Array} Cached patient data
   */
  getCachedPatients() {
    try {
      const cached = localStorage.getItem('jantungin_cached_patients')
      if (cached) {
        return JSON.parse(cached)
      }
      return []
    } catch (error) {
      console.error('Error getting cached patients:', error)
      return []
    }
  }

  /**
   * Search in cached patients
   * @param {string} query - Search query
   * @returns {Array} Matching patients from cache
   */
  searchCachedPatients(query) {
    try {
      if (!query) return []

      const cachedPatients = this.getCachedPatients()
      if (cachedPatients.length === 0) return []

      // Convert query to lowercase for case-insensitive search
      const lowercaseQuery = query.toLowerCase()

      // Filter cached patients based on query
      return cachedPatients.filter((patient) => {
        return (
          (patient.name && patient.name.toLowerCase().includes(lowercaseQuery)) ||
          (patient.nik && patient.nik.includes(query)) ||
          (patient.id && patient.id.toString() === query)
        )
      })
    } catch (error) {
      console.error('Error searching cached patients:', error)
      return []
    }
  }
}

// Create and export a singleton instance
const patientService = new PatientService()
export default patientService

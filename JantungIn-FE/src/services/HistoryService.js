import apiService from './ApiService'
import { DiagnosisModel } from '@/models/DiagnosisModel'

/**
 * Service for managing user diagnosis history
 */
class HistoryService {
  /**
   * Get user's diagnosis history
   * @param {Object} params - Query parameters
   * @returns {Promise<Array<DiagnosisModel>>} User's diagnosis history
   */
  async getUserHistory(params = {}) {
    try {
      // Check if we're online
      if (navigator.onLine) {
        // Endpoint sesuai dengan API docs: GET /api/v1/diagnosis/history
        const response = await apiService.get('/api/v1/diagnosis/history', params)

        // Struktur response sesuai dengan API docs:
        // { statusCode: 200, message: "Diagnoses retrieved successfully", data: [...] }
        const responseData = response.data || response

        // Ekstrak array diagnoses dari response
        const historyData = responseData.data || responseData

        const historyItems = Array.isArray(historyData) ? DiagnosisModel.fromArray(historyData) : []

        // Cache for offline mode
        this.cacheHistoryForOffline(historyItems)

        return historyItems
      } else {
        // Use cached history for offline mode
        return this.getOfflineHistory()
      }
    } catch (error) {
      console.error('Error fetching history:', error)

      // Fallback to offline history if fetching fails
      return this.getOfflineHistory()
    }
  }

  /**
   * Get details of a specific diagnosis
   * @param {string|number} id - Diagnosis ID
   * @returns {Promise<DiagnosisModel>} Diagnosis details
   */
  async getDiagnosisById(id) {
    try {
      if (navigator.onLine) {
        // Endpoint sesuai dengan API docs: GET /api/v1/diagnosis/{id}
        const response = await apiService.get(`/api/v1/diagnosis/${id}`)

        // Struktur response sesuai dengan API docs:
        // { statusCode: 200, message: "Diagnosis retrieved successfully", data: {...} }
        const responseData = response.data || response
        const diagnosisData = responseData.data || responseData

        return new DiagnosisModel(diagnosisData)
      } else {
        // Try to find in offline cache
        return this.getOfflineDiagnosisById(id)
      }
    } catch (error) {
      console.error(`Error fetching diagnosis ${id}:`, error)

      // Fallback to offline diagnosis if fetching fails
      return this.getOfflineDiagnosisById(id)
    }
  }

  /**
   * Cache history items for offline use
   * @param {Array<DiagnosisModel>} historyItems - History items to cache
   */
  cacheHistoryForOffline(historyItems) {
    try {
      localStorage.setItem('jantungin_offline_history', JSON.stringify(historyItems))
    } catch (error) {
      console.error('Error caching history:', error)
    }
  }

  /**
   * Get history items from offline cache
   * @returns {Array<DiagnosisModel>} Cached history items
   */
  getOfflineHistory() {
    try {
      const cachedHistory = localStorage.getItem('jantungin_offline_history')

      if (cachedHistory) {
        const parsedHistory = JSON.parse(cachedHistory)
        return DiagnosisModel.fromArray(parsedHistory)
      } else {
        // Return empty array if nothing in cache
        return []
      }
    } catch (error) {
      console.error('Error getting offline history:', error)
      return []
    }
  }

  /**
   * Get a specific diagnosis from offline cache
   * @param {string|number} id - Diagnosis ID
   * @returns {DiagnosisModel|null} Diagnosis model or null
   */
  getOfflineDiagnosisById(id) {
    try {
      const allHistory = this.getOfflineHistory()
      const foundDiagnosis = allHistory.find((item) => item.id == id) // loose equality for string/number comparison

      return foundDiagnosis || null
    } catch (error) {
      console.error(`Error getting offline diagnosis ${id}:`, error)
      return null
    }
  }
}

// Create singleton instance
const historyService = new HistoryService()

export default historyService

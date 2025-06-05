import apiService from './ApiService'
import { DiagnosisModel } from '@/models/DiagnosisModel'

/**
 * Service for diagnosis functionality
 */
class DiagnosisService {
  /**
   * Submit diagnosis data for prediction
   * @param {Object} diagnosisData - User diagnosis data
   * @returns {Promise<DiagnosisModel>} Diagnosis result
   */
  async submitDiagnosis(diagnosisData) {
    try {
      if (!navigator.onLine) {
        throw new Error('Cannot submit diagnosis in offline mode')
      }

      // Make a copy of the diagnosis data to avoid modifying the original
      const diagnosisDataCopy = { ...diagnosisData }

      // Temporarily store patient name (for logs) but remove it from the API request
      if (diagnosisDataCopy.patientName) {
        const patientNameForLogs = diagnosisDataCopy.patientName
        console.log(
          `Processing diagnosis for patient: ${patientNameForLogs} (ID: ${diagnosisDataCopy.patientId})`,
        )
        delete diagnosisDataCopy.patientName
      }

      // Continue with the copied data
      diagnosisData = diagnosisDataCopy

      // Prepare diagnosis data according to API format
      const preparedData = this.prepareDiagnosisData(diagnosisData)

      console.log('Sending diagnosis data to API:', preparedData)

      // Endpoint sesuai dengan API docs: POST /api/v1/diagnosis
      const response = await apiService.post('/api/v1/diagnosis', preparedData)

      console.log('Raw API response:', response)

      // Struktur response sesuai dengan API docs:
      // { statusCode: 201, message: "Diagnosis created successfully", data: {...} }
      const responseData = response.data || response
      const diagnosisResult = responseData.data || responseData

      console.log('Processed diagnosis result:', diagnosisResult)

      const diagnosis = new DiagnosisModel(diagnosisResult)

      // Add to offline cache to make it available in history
      this.addToOfflineCache(diagnosis)

      return diagnosis
    } catch (error) {
      console.error('Error submitting diagnosis:', error)
      throw error
    }
  }

  /**
   * Prepare diagnosis data for API format
   * @param {Object} rawData - Raw diagnosis form data
   * @returns {Object} Prepared data in API format
   */
  prepareDiagnosisData(rawData) {
    // Validasi patient ID
    if (!rawData.patientId) {
      console.error('Missing patient ID in diagnosis data')
      throw new Error('ID pasien diperlukan untuk diagnosa')
    }

    // Validate the data type of patient ID
    if (typeof rawData.patientId !== 'string' && typeof rawData.patientId !== 'number') {
      console.error(`Invalid patient ID type: ${typeof rawData.patientId}`)
      throw new Error('Format ID pasien tidak valid')
    }

    // Convert to string if it's a number
    const patientId = String(rawData.patientId).trim()

    // Ensure it's not empty after trimming
    if (patientId === '') {
      console.error('Empty patient ID after trimming')
      throw new Error('ID pasien tidak boleh kosong')
    }

    console.log(`Validated patient ID for diagnosis: ${patientId}`)

    // Format the data according to API expectations
    // Store patient name locally for UI but don't send it to the API
    const patientName = rawData.patientName || 'Unknown'
    console.log(`Preparing diagnosis for patient: ${patientName} (ID: ${rawData.patientId})`)

    // Return formatted data WITHOUT patientName as the API doesn't accept it
    return {
      patientId: rawData.patientId, // Include only patient ID
      age: parseInt(rawData.age) || 50,
      sex: rawData.sex || 'Male',
      chestPainType: rawData.chestPainType || 'Typical angina',
      restingBloodPressure: parseInt(rawData.restingBloodPressure) || 120,
      serumCholesterol: parseInt(rawData.serumCholesterol) || 200,
      fastingBloodSugar:
        rawData.fastingBloodSugar === '1' || parseInt(rawData.fastingBloodSugar) === 1 ? 120 : 80,
      restingEcgResults: rawData.restingEcgResults || 'Normal',
      maximumHeartRate: parseInt(rawData.maximumHeartRate) || 150,
      exerciseInducedAngina: rawData.exerciseInducedAngina || 'No',
      stDepression: parseFloat(rawData.stDepression) || 1.0,
      stSegment: rawData.stSegment || 'Flat',
      majorVessels: parseInt(rawData.majorVessels) || 0,
      thalassemia: rawData.thalassemia || 'Normal',
    }
  }

  /**
   * Add a diagnosis result to offline cache
   * @param {DiagnosisModel} diagnosis - Diagnosis to cache
   */
  addToOfflineCache(diagnosis) {
    try {
      // Get existing history
      let existingHistory = []
      const cachedHistory = localStorage.getItem('jantungin_offline_history')

      if (cachedHistory) {
        existingHistory = JSON.parse(cachedHistory)
      }

      // Add new diagnosis to history
      existingHistory.unshift(diagnosis) // Add to beginning of array

      // Save back to cache
      localStorage.setItem('jantungin_offline_history', JSON.stringify(existingHistory))
    } catch (error) {
      console.error('Error adding diagnosis to cache:', error)
    }
  }

  /**
   * Get symptoms and form questions for diagnosis
   * @returns {Promise<Array>} List of symptom questions
   */
  async getSymptomQuestions() {
    try {
      if (navigator.onLine) {
        const response = await apiService.get('/diagnosis/symptoms')

        // Cache for offline use
        localStorage.setItem('jantungin_symptom_questions', JSON.stringify(response))

        return response
      } else {
        // Use cached questions
        const cachedQuestions = localStorage.getItem('jantungin_symptom_questions')
        if (cachedQuestions) {
          return JSON.parse(cachedQuestions)
        }

        // Fallback to predefined questions
        return this.getDefaultSymptomQuestions()
      }
    } catch (error) {
      console.error('Error getting symptom questions:', error)

      // Fallback to predefined questions
      return this.getDefaultSymptomQuestions()
    }
  }

  /**
   * Get default symptom questions for offline mode
   * @returns {Array} Default list of symptom questions
   */
  getDefaultSymptomQuestions() {
    // These should match the model's expected inputs
    return [
      {
        id: 'chest_pain',
        question: 'Apakah Anda mengalami nyeri dada?',
        type: 'boolean',
      },
      {
        id: 'shortness_of_breath',
        question: 'Apakah Anda mengalami sesak napas?',
        type: 'boolean',
      },
      {
        id: 'fatigue',
        question: 'Apakah Anda merasa lelah yang tidak normal?',
        type: 'boolean',
      },
      {
        id: 'dizziness',
        question: 'Apakah Anda mengalami pusing?',
        type: 'boolean',
      },
      // Add more default questions as needed
    ]
  }

  /**
   * Get user's diagnosis history
   * @returns {Promise<Array<DiagnosisModel>>} Array of diagnosis models
   */
  async getDiagnosisHistory() {
    try {
      if (navigator.onLine) {
        // Endpoint sesuai dengan API docs: GET /api/diagnosis/history
        const response = await apiService.get('/diagnosis/history')

        // Struktur response sesuai dengan API docs:
        // { statusCode: 200, message: "Diagnoses retrieved successfully", data: [...] }
        const diagnosisData = response.data || response
        const diagnosisHistory = Array.isArray(diagnosisData)
          ? diagnosisData.map((item) => new DiagnosisModel(item))
          : []

        // Cache for offline use
        localStorage.setItem('jantungin_offline_history', JSON.stringify(diagnosisHistory))

        return diagnosisHistory
      } else {
        // Use cached history for offline mode
        return this.getOfflineHistory()
      }
    } catch (error) {
      console.error('Error fetching diagnosis history:', error)

      // Fallback to offline history
      return this.getOfflineHistory()
    }
  }

  /**
   * Get a specific diagnosis by ID
   * @param {string} id - Diagnosis ID
   * @returns {Promise<DiagnosisModel>} Diagnosis model
   */
  async getDiagnosisById(id) {
    try {
      if (navigator.onLine) {
        // Endpoint sesuai dengan API docs: GET /api/diagnosis/{id}
        const response = await apiService.get(`/diagnosis/${id}`)

        // Struktur response sesuai dengan API docs:
        // { statusCode: 200, message: "Diagnosis retrieved successfully", data: {...} }
        const diagnosisData = response.data || response
        return new DiagnosisModel(diagnosisData)
      } else {
        // Try to find in offline cache
        return this.getOfflineDiagnosisById(id)
      }
    } catch (error) {
      console.error(`Error fetching diagnosis with ID ${id}:`, error)

      // Try to find in offline cache
      return this.getOfflineDiagnosisById(id)
    }
  }

  /**
   * Get offline diagnosis history from local storage
   * @returns {Array<DiagnosisModel>} Array of diagnosis models
   */
  getOfflineHistory() {
    try {
      const cachedHistory = localStorage.getItem('jantungin_offline_history')

      if (cachedHistory) {
        const historyData = JSON.parse(cachedHistory)
        return Array.isArray(historyData) ? historyData.map((item) => new DiagnosisModel(item)) : []
      }

      return []
    } catch (error) {
      console.error('Error getting offline history:', error)
      return []
    }
  }

  /**
   * Get offline diagnosis by ID from local storage
   * @param {string} id - Diagnosis ID
   * @returns {DiagnosisModel|null} Diagnosis model or null if not found
   */
  getOfflineDiagnosisById(id) {
    try {
      const cachedHistory = localStorage.getItem('jantungin_offline_history')

      if (cachedHistory) {
        const historyData = JSON.parse(cachedHistory)
        const diagnosis = Array.isArray(historyData)
          ? historyData.find((item) => item.id === id)
          : null

        return diagnosis ? new DiagnosisModel(diagnosis) : null
      }

      return null
    } catch (error) {
      console.error(`Error getting offline diagnosis with ID ${id}:`, error)
      return null
    }
  }
}

// Create singleton instance
const diagnosisService = new DiagnosisService()

export default diagnosisService

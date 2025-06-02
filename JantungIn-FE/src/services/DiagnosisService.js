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

      const response = await apiService.post('/diagnosis/submit', diagnosisData)
      const diagnosis = new DiagnosisModel(response.data || response)

      // Add to offline cache to make it available in history
      this.addToOfflineCache(diagnosis)

      return diagnosis
    } catch (error) {
      console.error('Error submitting diagnosis:', error)
      throw error
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
}

// Create singleton instance
const diagnosisService = new DiagnosisService()

export default diagnosisService

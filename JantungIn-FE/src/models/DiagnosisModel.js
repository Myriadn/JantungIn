/**
 * DiagnosisModel - Model representing diagnosis data
 */
export class DiagnosisModel {
  constructor(data = {}) {
    // Handle nested data structure from API response
    if (data.data && typeof data.data === 'object') {
      data = data.data
    }

    this.id = data.id || null
    this.userId = data.userId || null
    this.age = data.age || 0
    this.sex = data.sex || ''
    this.chestPainType = data.chestPainType || ''
    this.restingBP = data.restingBP || data.restingBloodPressure || 0
    this.serumCholesterol = data.serumCholesterol || 0
    this.fastingBloodSugar = data.fastingBloodSugar || 0
    this.restingEcgResults = data.restingEcgResults || ''
    this.maxHeartRate = data.maxHeartRate || data.maximumHeartRate || 0
    this.exerciseInducedAngina = data.exerciseInducedAngina || ''
    this.stDepression = data.stDepression || 0
    this.stSegment = data.stSegment || ''
    this.majorVessels = data.majorVessels || 0
    this.thalassemia = data.thalassemia || ''
    this.resultPercentage = data.resultPercentage || 0
    this.cardiovascularRisk = data.cardiovascularRisk || ''
    this.prediction = data.prediction || ''
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()
  }

  /**
   * Validates the diagnosis data
   * @returns {boolean} True if valid, false otherwise
   */
  isValid() {
    return this.age > 0 && this.sex && this.chestPainType
  }

  /**
   * Get formatted diagnosis date
   * @returns {string} Formatted date
   */
  getFormattedDate() {
    if (!this.createdAt) return ''

    try {
      const date = new Date(this.createdAt)
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return this.createdAt
    }
  }

  /**
   * Get the risk level based on the diagnosis result
   * @returns {string} Risk level (low, medium, high)
   */
  getRiskLevel() {
    if (this.cardiovascularRisk) {
      return this.cardiovascularRisk.toLowerCase()
    }

    if (this.resultPercentage) {
      const probability = parseFloat(this.resultPercentage) / 100

      if (probability < 0.3) return 'low'
      if (probability < 0.7) return 'medium'
      return 'high'
    }

    return 'unknown'
  }

  /**
   * Creates a collection of DiagnosisModel objects from array data
   * @param {Array} items - Array of diagnosis data
   * @returns {Array<DiagnosisModel>} Array of DiagnosisModel instances
   */
  static fromArray(items) {
    return Array.isArray(items) ? items.map((item) => new DiagnosisModel(item)) : []
  }
}

/**
 * DiagnosisModel - Model representing diagnosis data
 */
export class DiagnosisModel {
  constructor(data = {}) {
    this.id = data.id || null
    this.userId = data.userId || null
    this.patientNIK = data.patientNIK || ''
    this.dateCreated = data.dateCreated || new Date().toISOString()
    this.symptoms = data.symptoms || {}
    this.result = data.result || null
    this.doctorId = data.doctorId || null
    this.doctorNotes = data.doctorNotes || ''
    this.status = data.status || 'pending' // pending, reviewed, completed
  }

  /**
   * Validates the diagnosis data
   * @returns {boolean} True if valid, false otherwise
   */
  isValid() {
    return this.patientNIK && Object.keys(this.symptoms).length > 0
  }

  /**
   * Get formatted diagnosis date
   * @returns {string} Formatted date
   */
  getFormattedDate() {
    if (!this.dateCreated) return ''

    try {
      const date = new Date(this.dateCreated)
      return date.toLocaleDateString()
    } catch {
      return this.dateCreated
    }
  }

  /**
   * Get the risk level based on the diagnosis result
   * @returns {string} Risk level (low, medium, high)
   */
  getRiskLevel() {
    if (!this.result) return 'unknown'

    // Example logic - adjust based on your actual diagnosis criteria
    const probability = parseFloat(this.result)

    if (probability < 0.3) return 'low'
    if (probability < 0.7) return 'medium'
    return 'high'
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

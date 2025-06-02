/**
 * NewsModel - Model representing news article data
 */
export class NewsModel {
  constructor(data = {}) {
    this.id = data.id || null
    this.title = data.title || ''
    this.content = data.content || ''
    this.date = data.date || ''
    this.image = data.image || ''
    this.author = data.author || ''
    this.category = data.category || ''
  }

  /**
   * Validates the news data
   * @returns {boolean} True if valid, false otherwise
   */
  isValid() {
    return this.title && this.title.length > 0 && this.content && this.content.length > 0
  }

  /**
   * Format the date for display
   * @returns {string} Formatted date
   */
  getFormattedDate() {
    if (!this.date) return ''

    // You could use a library like date-fns here for better formatting
    return this.date
  }

  /**
   * Get a shortened preview of the content
   * @param {number} length - Maximum length of preview
   * @returns {string} Content preview
   */
  getContentPreview(length = 100) {
    if (!this.content) return ''

    if (this.content.length <= length) {
      return this.content
    }

    return this.content.substring(0, length) + '...'
  }

  /**
   * Creates a collection of NewsModel objects from array data
   * @param {Array} items - Array of news data
   * @returns {Array<NewsModel>} Array of NewsModel instances
   */
  static fromArray(items) {
    return Array.isArray(items) ? items.map((item) => new NewsModel(item)) : []
  }
}

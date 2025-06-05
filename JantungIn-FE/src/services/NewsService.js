import apiService from './ApiService'
import { NewsModel } from '@/models/NewsModel'

/**
 * News service for fetching and managing news articles
 */
class NewsService {
  /**
   * Get all news articles
   * @param {Object} params - Query parameters
   * @returns {Promise<Array<NewsModel>>} Array of news models
   */
  async getAllNews(params = {}) {
    try {
      // Check if we're online
      if (navigator.onLine) {
        // Endpoint sesuai dengan struktur API
        const response = await apiService.get('/news', params)

        // Struktur response sesuai dengan API docs:
        // { statusCode: 200, message: "News retrieved successfully", data: [...] }
        const newsData = response.data || response
        const newsItems = Array.isArray(newsData) ? NewsModel.fromArray(newsData) : []

        // Cache for offline mode
        this.cacheNewsForOffline(newsItems)

        return newsItems
      } else {
        // Use cached news for offline mode
        return this.getOfflineNews()
      }
    } catch (error) {
      console.error('Error fetching news:', error)

      // Fallback to offline news if fetching fails
      return this.getOfflineNews()
    }
  }

  /**
   * Get a specific news article by ID
   * @param {number|string} id - News article ID
   * @returns {Promise<NewsModel>} News model
   */
  async getNewsById(id) {
    try {
      if (navigator.onLine) {
        // Endpoint sesuai dengan struktur API
        const response = await apiService.get(`/news/${id}`)

        // Struktur response sesuai dengan API docs:
        // { statusCode: 200, message: "News retrieved successfully", data: {...} }
        const newsData = response.data || response
        return new NewsModel(newsData)
      } else {
        // Try to find in offline cache
        return this.getOfflineNewsById(id)
      }
    } catch (error) {
      console.error(`Error fetching news ${id}:`, error)

      // Fallback to offline news if fetching fails
      return this.getOfflineNewsById(id)
    }
  }

  /**
   * Cache news articles for offline use
   * @param {Array<NewsModel>} newsItems - News items to cache
   */
  cacheNewsForOffline(newsItems) {
    try {
      localStorage.setItem('jantungin_offline_news', JSON.stringify(newsItems))
    } catch (error) {
      console.error('Error caching news:', error)
    }
  }

  /**
   * Get news articles from offline cache
   * @returns {Array<NewsModel>} Cached news items
   */
  getOfflineNews() {
    try {
      const cachedNews = localStorage.getItem('jantungin_offline_news')

      if (cachedNews) {
        const parsedNews = JSON.parse(cachedNews)
        return NewsModel.fromArray(parsedNews)
      } else {
        // Fallback to sample data if nothing in cache
        return this.getSampleNewsData()
      }
    } catch (error) {
      console.error('Error getting offline news:', error)
      return this.getSampleNewsData()
    }
  }

  /**
   * Get a specific news article from offline cache
   * @param {number|string} id - News article ID
   * @returns {NewsModel} News model or null
   */
  getOfflineNewsById(id) {
    try {
      const allNews = this.getOfflineNews()
      const foundNews = allNews.find((news) => news.id == id) // loose equality for string/number comparison

      return foundNews || null
    } catch (error) {
      console.error(`Error getting offline news ${id}:`, error)
      return null
    }
  }

  /**
   * Get sample news data for offline fallback
   * @returns {Array<NewsModel>} Sample news models
   */
  getSampleNewsData() {
    // Sample data matching the existing app
    const sampleData = [
      {
        id: 1,
        title: 'Mewaspadai Tanda Awal Penyakit Jantung: Jangan Abaikan Nyeri Dada dan Sesak Napas',
        date: '10 May 2025',
        image: '/images/heart1.jpg',
        content:
          'Meningkatnya jumlah kasus penyakit jantung pada kelompok dewasa muda diakibatkan oleh berbagai faktor, mulai dari pola makan tidak sehat, jarang olahraga, kebiasaan merokok, hingga penyakit tertentu seperti kolesterol tinggi, diabetes, dan hipertensi.',
      },
      {
        id: 2,
        title: 'Mewaspadai Tanda Awal Penyakit Jantung: Jangan Abaikan Nyeri Dada dan Sesak Napas',
        date: '10 May 2025',
        image: '/images/heart2.jpg',
        content:
          'Meningkatnya jumlah kasus penyakit jantung pada kelompok dewasa muda diakibatkan oleh berbagai faktor, mulai dari pola makan tidak sehat, jarang olahraga, kebiasaan merokok, hingga penyakit tertentu seperti kolesterol tinggi, diabetes, dan hipertensi.',
      },
      {
        id: 3,
        title: 'Mewaspadai Tanda Awal Penyakit Jantung: Jangan Abaikan Nyeri Dada dan Sesak Napas',
        date: '10 May 2025',
        image: '/images/heart3.jpg',
        content:
          'Meningkatnya jumlah kasus penyakit jantung pada kelompok dewasa muda diakibatkan oleh berbagai faktor, mulai dari pola makan tidak sehat, jarang olahraga, kebiasaan merokok, hingga penyakit tertentu seperti kolesterol tinggi, diabetes, dan hipertensi.',
      },
    ]

    return NewsModel.fromArray(sampleData)
  }
}

// Create singleton instance
const newsService = new NewsService()

export default newsService

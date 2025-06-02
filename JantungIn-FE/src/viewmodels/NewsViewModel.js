import { ref, computed, onMounted } from 'vue'
import newsService from '@/services/NewsService'

/**
 * News ViewModel
 * Handles fetching and displaying news articles
 */
export function useNewsViewModel() {
  // State
  const newsItems = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const pageSize = ref(10)
  const isOfflineMode = ref(!navigator.onLine)

  // Computed properties
  const hasNews = computed(() => newsItems.value && newsItems.value.length > 0)
  const showLoadMore = computed(() => currentPage.value < totalPages.value)

  /**
   * Fetch news articles
   */
  const fetchNews = async (refresh = false) => {
    if (refresh) {
      currentPage.value = 1
      newsItems.value = []
    }

    try {
      isLoading.value = true
      error.value = null

      const params = {
        page: currentPage.value,
        limit: pageSize.value,
      }

      const result = await newsService.getAllNews(params)

      if (refresh) {
        newsItems.value = result
      } else {
        // Append to existing news
        newsItems.value = [...newsItems.value, ...result]
      }

      // In real implementation, get these from API response
      totalPages.value = Math.ceil(result.length / pageSize.value) || 1
    } catch (err) {
      console.error('Error fetching news:', err)
      error.value = 'Failed to load news. Please try again later.'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Load more news (pagination)
   */
  const loadMoreNews = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
      fetchNews(false)
    }
  }

  /**
   * Refresh news feed
   */
  const refreshNews = () => {
    fetchNews(true)
  }

  // Initialize news data
  onMounted(() => {
    fetchNews()

    // Monitor online status
    window.addEventListener('online', () => {
      isOfflineMode.value = false
      refreshNews()
    })

    window.addEventListener('offline', () => {
      isOfflineMode.value = true
    })
  })

  return {
    // State
    newsItems,
    isLoading,
    error,
    currentPage,
    totalPages,
    isOfflineMode,
    hasNews,
    showLoadMore,

    // Methods
    fetchNews,
    loadMoreNews,
    refreshNews,
  }
}

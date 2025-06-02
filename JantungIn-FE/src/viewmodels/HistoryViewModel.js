import { ref, computed, onMounted } from 'vue'
import historyService from '@/services/HistoryService'

/**
 * History ViewModel
 * Handles fetching and displaying user diagnosis history
 */
export function useHistoryViewModel() {
  // State
  const historyItems = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const pageSize = ref(10)
  const isOfflineMode = ref(!navigator.onLine)

  // Computed properties
  const hasHistory = computed(() => historyItems.value && historyItems.value.length > 0)
  const showLoadMore = computed(() => currentPage.value < totalPages.value)

  /**
   * Fetch user's diagnosis history
   */
  const fetchHistory = async (refresh = false) => {
    if (refresh) {
      currentPage.value = 1
      historyItems.value = []
    }

    try {
      isLoading.value = true
      error.value = null

      const params = {
        page: currentPage.value,
        limit: pageSize.value,
      }

      const result = await historyService.getUserHistory(params)

      if (refresh) {
        historyItems.value = result
      } else {
        // Append to existing history
        historyItems.value = [...historyItems.value, ...result]
      }

      // In real implementation, get these from API response
      totalPages.value = Math.ceil(result.length / pageSize.value) || 1
    } catch (err) {
      console.error('Error fetching history:', err)
      error.value = 'Failed to load history. Please try again later.'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get detailed view of a specific diagnosis
   * @param {string|number} id Diagnosis ID
   * @returns {Promise<DiagnosisModel>} Detailed diagnosis data
   */
  const getDiagnosisDetails = async (id) => {
    try {
      isLoading.value = true
      error.value = null
      return await historyService.getDiagnosisById(id)
    } catch (err) {
      console.error('Error fetching diagnosis details:', err)
      error.value = 'Failed to load diagnosis details. Please try again later.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Load more history items (pagination)
   */
  const loadMoreHistory = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
      fetchHistory(false)
    }
  }

  /**
   * Refresh history
   */
  const refreshHistory = () => {
    fetchHistory(true)
  }

  // Initialize history data
  onMounted(() => {
    fetchHistory()

    // Monitor online status
    window.addEventListener('online', () => {
      isOfflineMode.value = false
      refreshHistory()
    })

    window.addEventListener('offline', () => {
      isOfflineMode.value = true
    })
  })

  return {
    // State
    historyItems,
    isLoading,
    error,
    currentPage,
    totalPages,
    isOfflineMode,
    hasHistory,
    showLoadMore,

    // Methods
    fetchHistory,
    getDiagnosisDetails,
    loadMoreHistory,
    refreshHistory,
  }
}

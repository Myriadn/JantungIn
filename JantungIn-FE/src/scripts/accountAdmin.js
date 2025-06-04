// Importing required services and dependencies
import { ref, onMounted } from 'vue'
import profileService from '@/services/ProfileService'
import statisticsService from '@/services/StatisticsService'

/**
 * Account admin view model
 * @returns {Object} View model
 */
export const useAccountAdmin = () => {
  const fileInput = ref(null)
  const doctorPhotoUrl = ref(null)
  const showPhotoOptions = ref(false)
  const showNotification = ref(false)
  const notificationMessage = ref('')
  const notificationType = ref('success')

  // Data refs
  const profile = ref(null)
  const recentActivities = ref([])
  const stats = ref(null)
  const isLoading = ref(true)
  const error = ref(null)

  // Load data
  const loadProfileData = async () => {
    try {
      isLoading.value = true
      error.value = null

      // Load profile data
      profile.value = await profileService.getProfile()

      // Load recent activities
      recentActivities.value = await profileService.getRecentActivities()

      // Load statistics
      const dashboardStats = await profileService.getDashboardStats()
      const diagnosisStats = await statisticsService.getDiagnosisStats()

      stats.value = {
        thisWeek: {
          title: 'This Week',
          diagnoses: dashboardStats.lastWeekDiagnoses || 0,
          consultations: dashboardStats.lastWeekConsultations || 0,
          reviews: dashboardStats.lastWeekReviews || 0,
        },
        thisMonth: {
          title: 'This Month',
          diagnoses: dashboardStats.lastMonthDiagnoses || 0,
          consultations: dashboardStats.lastMonthConsultations || 0,
          reviews: dashboardStats.lastMonthReviews || 0,
        },
        total: {
          title: 'Total',
          diagnoses: diagnosisStats.totalDiagnosis || 0,
          patients: profile.value.totalPatients || 0,
        },
      }
    } catch (err) {
      console.error('Error loading profile data:', err)
      error.value = 'Failed to load profile data. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  // Photo handlers
  const togglePhotoOptions = () => {
    showPhotoOptions.value = !showPhotoOptions.value
  }

  const triggerFileInput = () => {
    fileInput.value.click()
    showPhotoOptions.value = false
  }

  const removePhoto = () => {
    doctorPhotoUrl.value = null
    localStorage.removeItem('doctorPhotoUrl')
    showNotification.value = true
    notificationMessage.value = 'Profile photo removed'
    notificationType.value = 'info'
    setTimeout(() => {
      showNotification.value = false
    }, 3000)
  }

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        doctorPhotoUrl.value = e.target.result
        localStorage.setItem('doctorPhotoUrl', e.target.result)
        showNotification.value = true
        notificationMessage.value = 'Profile photo updated'
        notificationType.value = 'success'
        setTimeout(() => {
          showNotification.value = false
        }, 3000)
      }
      reader.readAsDataURL(file)
    }
  }

  onMounted(() => {
    // Load saved photo if exists
    const savedPhoto = localStorage.getItem('doctorPhotoUrl')
    if (savedPhoto) {
      doctorPhotoUrl.value = savedPhoto
    }

    // Load profile data
    loadProfileData()
  })

  return {
    // UI state
    fileInput,
    doctorPhotoUrl,
    showPhotoOptions,
    showNotification,
    notificationMessage,
    notificationType,
    isLoading,
    error,

    // Photo handlers
    togglePhotoOptions,
    triggerFileInput,
    removePhoto,
    handlePhotoUpload,

    // Data
    profile,
    recentActivities,
    stats,
  }
}

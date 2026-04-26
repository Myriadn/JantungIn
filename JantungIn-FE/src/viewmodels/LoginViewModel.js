import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import authService from '@/services/AuthService'
import { useErrorHandler } from '@/utils/errorHandler'

/**
 * Login ViewModel
 * Handles login form state and authentication logic
 */
export function useLoginViewModel() {
  const router = useRouter()
  const { t } = useI18n()
  const { getErrorMessage } = useErrorHandler()

  // State
  const username = ref('')
  const password = ref('')
  const rememberMe = ref(false)
  const showPassword = ref(false)

  // UI state
  const isLoading = ref(false)
  const errorMessage = ref('')
  const isOfflineMode = ref(!navigator.onLine)

  /**
   * Computed property to check if form is valid
   */
  const isFormValid = computed(() => {
    return username.value.trim() !== '' && password.value.trim() !== ''
  })

  /**
   * Handle login form submission
   */
  const handleLogin = async () => {
    if (!isFormValid.value) {
      if (username.value.trim() === '') {
        errorMessage.value = t('errors.validation.requiredField')
      } else {
        errorMessage.value = t('errors.auth.missingFields')
      }
      return
    }

    try {
      isLoading.value = true
      errorMessage.value = ''

      const user = await authService.login(username.value, password.value)

      console.log('Login successful:', user)

      // Redirect to news page after successful login
      router.push('/home')
    } catch (error) {
      console.error('Login error:', error)

      // Use error handler to get localized error message
      errorMessage.value = getErrorMessage(error)

      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Navigate to register page
   */
  const goToRegister = () => {
    router.push('/register')
  }

  /**
   * Reset login form
   */
  const resetForm = () => {
    username.value = ''
    password.value = ''
    errorMessage.value = ''
  }

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
  }

  // Monitor online status
  window.addEventListener('online', () => {
    isOfflineMode.value = false
  })
  window.addEventListener('offline', () => {
    isOfflineMode.value = true
  })

  return {
    // State
    username,
    password,
    rememberMe,
    showPassword,
    isLoading,
    errorMessage,
    isOfflineMode,
    isFormValid,

    // Methods
    handleLogin,
    goToRegister,
    resetForm,
    togglePasswordVisibility,
  }
}

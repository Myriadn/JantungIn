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
  const nik = ref('')
  const email = ref('') // Add email for alternative login
  const password = ref('')
  const rememberMe = ref(false)
  const showPassword = ref(false)
  const loginMethod = ref('nik') // 'nik' or 'email'

  // UI state
  const isLoading = ref(false)
  const errorMessage = ref('')
  const isOfflineMode = ref(!navigator.onLine)

  /**
   * Computed property to check if form is valid
   */
  const isFormValid = computed(() => {
    if (loginMethod.value === 'nik') {
      // NIK must be 16 digits and password must not be empty
      return (
        nik.value.trim().length === 16 && /^\d+$/.test(nik.value) && password.value.trim() !== ''
      )
    } else {
      // Email must be in valid format and password must not be empty
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) && password.value.trim() !== ''
    }
  })

  /**
   * Handle login form submission
   */
  const handleLogin = async () => {
    if (!isFormValid.value) {
      if (loginMethod.value === 'nik') {
        if (nik.value.trim() === '') {
          errorMessage.value = t('errors.validation.requiredField')
        } else if (nik.value.trim().length !== 16) {
          errorMessage.value = t('errors.validation.nikFormat')
        } else if (!/^\d+$/.test(nik.value)) {
          errorMessage.value = t('errors.validation.nikFormat')
        } else {
          errorMessage.value = t('errors.auth.missingFields')
        }
      } else {
        if (email.value.trim() === '') {
          errorMessage.value = t('errors.validation.requiredField')
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
          errorMessage.value = t('errors.validation.emailFormat')
        } else {
          errorMessage.value = t('errors.auth.missingFields')
        }
      }
      return
    }

    try {
      isLoading.value = true
      errorMessage.value = ''

      let user
      if (loginMethod.value === 'nik') {
        user = await authService.login(nik.value, password.value)
      } else {
        user = await authService.loginWithEmail(email.value, password.value)
      }

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
   * Toggle login method between NIK and email
   */
  const toggleLoginMethod = () => {
    loginMethod.value = loginMethod.value === 'nik' ? 'email' : 'nik'
    // Reset fields when changing login method
    errorMessage.value = ''
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
    nik.value = ''
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
    nik,
    email,
    password,
    rememberMe,
    showPassword,
    isLoading,
    errorMessage,
    isOfflineMode,
    isFormValid,
    loginMethod,

    // Methods
    handleLogin,
    goToRegister,
    resetForm,
    togglePasswordVisibility,
    toggleLoginMethod,
  }
}

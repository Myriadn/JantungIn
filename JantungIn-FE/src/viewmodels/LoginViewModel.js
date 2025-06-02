import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/AuthService'

/**
 * Login ViewModel
 * Handles login form state and authentication logic
 */
export function useLoginViewModel() {
  const router = useRouter()

  // Form state
  const nik = ref('')
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
    return nik.value.trim() !== '' && password.value.trim() !== ''
  })

  /**
   * Handle login form submission
   */
  const handleLogin = async () => {
    if (!isFormValid.value) {
      errorMessage.value = 'Please fill in all required fields'
      return
    }

    try {
      isLoading.value = true
      errorMessage.value = ''

      await authService.login(nik.value, password.value)

      // Redirect to news page after successful login
      router.push('/news')
    } catch (error) {
      console.error('Login error:', error)
      errorMessage.value = error.message || 'Login failed. Please check your credentials.'
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

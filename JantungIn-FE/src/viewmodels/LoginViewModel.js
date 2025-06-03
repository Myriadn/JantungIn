import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/AuthService'

/**
 * Login ViewModel
 * Handles login form state and authentication logic
 */
export function useLoginViewModel() {
  const router = useRouter()

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
      return nik.value.trim() !== '' && password.value.trim() !== ''
    } else {
      return email.value.trim() !== '' && password.value.trim() !== ''
    }
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

      let user
      if (loginMethod.value === 'nik') {
        user = await authService.login(nik.value, password.value)
      } else {
        user = await authService.loginWithEmail(email.value, password.value)
      }

      console.log('Login successful:', user)

      // Redirect to news page after successful login
      router.push('/news')
    } catch (error) {
      console.error('Login error:', error)
      errorMessage.value = error.message || 'Login failed. Please check your credentials.'
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

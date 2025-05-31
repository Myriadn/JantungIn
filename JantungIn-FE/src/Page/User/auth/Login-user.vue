<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const nik = ref('')
const password = ref('')
const isOfflineMode = ref(false)
const errorMessage = ref('')
const offlineCredentials = ref(null)

// Check if we're online
const checkOnlineStatus = () => {
  return navigator.onLine
}

// Load cached credentials if offline
const tryLoadOfflineCredentials = () => {
  try {
    const savedCredentials = localStorage.getItem('jantungin_offline_user')
    if (savedCredentials) {
      offlineCredentials.value = JSON.parse(savedCredentials)
    }
  } catch (error) {
    console.error('Error loading offline credentials:', error)
  }
}

onMounted(() => {
  isOfflineMode.value = !checkOnlineStatus()
  if (isOfflineMode.value) {
    tryLoadOfflineCredentials()
  }
  
  // Listen for online/offline events
  window.addEventListener('online', () => { isOfflineMode.value = false })
  window.addEventListener('offline', () => { isOfflineMode.value = true })
})

const navigateToRegister = () => {
  router.push('/')
}

const handleLogin = () => {
  errorMessage.value = ''
  
  // Check if offline
  if (isOfflineMode.value) {
    // If offline, check against cached credentials
    if (offlineCredentials.value && 
        offlineCredentials.value.nik === nik.value && 
        offlineCredentials.value.password === password.value) {
      router.push('/news')
    } else {
      errorMessage.value = 'Offline login failed. Please check credentials or connect to the internet.'
    }
    return
  }
  
  // Online login flow
  console.log('Login attempt with:', { nik: nik.value, password: password.value })
  
  // TODO: Implement actual login API call here
  // For demo, simulate successful login and cache credentials for offline use
  const userCredentials = {
    nik: nik.value,
    password: password.value,
    username: 'User_' + nik.value.substring(0, 5)
  }
  
  // Store credentials for offline login
  localStorage.setItem('jantungin_offline_user', JSON.stringify(userCredentials))
  
  // Navigate to home after login
  router.push('/news')
}

const handleResetPassword = () => {
  if (isOfflineMode.value) {
    errorMessage.value = 'Password reset is not available in offline mode'
    return
  }
  
  // TODO: Implement password reset functionality
  console.log('Password reset requested')
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Login as Patient</h1>
      
      <!-- Offline Mode Indicator -->
      <div v-if="isOfflineMode" class="offline-mode-banner">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5 inline">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m-3.536-3.536a5 5 0 010-7.072M13 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
        <span>Offline Mode</span>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="nik">NIK</label>
          <input id="nik" v-model="nik" type="text" class="form-control" required />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password" class="form-control" required />
        </div>

        <button type="submit" class="btn-primary">
          {{ isOfflineMode ? 'Login Offline' : 'Login' }}
        </button>

        <div class="links">
          <p class="text-center">
            Don't have an account?
            <a href="#" @click.prevent="navigateToRegister" class="text-link" :class="{ 'disabled-link': isOfflineMode }">Register</a>
          </p>
          <p class="text-center">
            Can't remember your password?
            <a href="#" @click.prevent="handleResetPassword" class="text-link" :class="{ 'disabled-link': isOfflineMode }">Reset Password</a>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(to bottom, #3b82f6, #4f46e5);
  padding: 2rem;
}

.login-card {
  background-color: white;
  border-radius: 0.5rem;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.login-title {
  font-size: 1.5rem;
  color: #3b82f6;
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  margin-bottom: 0.375rem;
}

.form-control {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.btn-primary {
  width: 100%;
  padding: 0.625rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  font-weight: 500;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.links {
  font-size: 0.875rem;
  margin-top: 1rem;
  color: #6b7280;
}

.text-link {
  color: #3b82f6;
  text-decoration: none;
}

.text-link:hover {
  text-decoration: underline;
}

.text-center {
  text-align: center;
  margin-bottom: 0.5rem;
}

.offline-mode-banner {
  background-color: #f59e0b;
  color: white;
  padding: 0.5rem;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.error-message {
  background-color: #ef4444;
  color: white;
  padding: 0.5rem;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 0.875rem;
}

.disabled-link {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>

<script setup>
// Implement MVVM pattern by using the ViewModel
import { useLoginViewModel } from '@/viewmodels/LoginViewModel'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

// Get vue-router instance
const router = useRouter()

// Get all reactive state and methods from the ViewModel
const {
  nik,
  email,
  password,
  showPassword,
  errorMessage,
  isOfflineMode,
  isLoading,
  loginMethod,
  handleLogin,
  toggleLoginMethod,

  goToRegister: navigateToRegister,
  togglePasswordVisibility,
} = useLoginViewModel()

// Function to navigate to doctor login page
const navigateToDoctorLogin = () => {
  router.push('/admin')
}

// Handle login submission
const submitLogin = async () => {
  try {
    await handleLogin()
    // Router navigation is handled inside the handleLogin function
  } catch (error) {
    console.error('Login submission error:', error)
  }
}

// PWA installation
const deferredPrompt = ref(null)
const showInstallButton = ref(false)

onMounted(() => {
  // Prevent scrolling on body
  document.body.style.overflow = 'hidden'
  document.body.style.margin = '0'
  document.body.style.padding = '0'

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome from automatically showing the prompt
    e.preventDefault()
    // Stash the event so it can be triggered later
    deferredPrompt.value = e
    // Show the install button
    showInstallButton.value = true
    console.log('PWA install prompt available on login page')
  })
})

onUnmounted(() => {
  // Restore scrolling when component is destroyed
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="login-container">
    <div class="login-content">
      <!-- Left side with illustration -->
      <div class="login-illustration">
        <div class="illustration-content">
          <h1 class="illustration-title">JantungIn</h1>
          <p class="illustration-tagline">Your Heart Health Companion</p>

          <!-- Health Tips Section -->
          <div class="health-tip-card">
            <div class="tip-header">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="tip-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Heart Health Tip</span>
            </div>
            <p class="tip-text">
              Regular physical activity can lower your blood pressure, reduce bad cholesterol, and
              decrease stress - all factors that reduce your risk of heart disease.
            </p>
          </div>

          <div class="features-section">
            <div class="feature-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="feature-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>Safe & Secure</span>
            </div>
            <div class="feature-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="feature-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
              <span>Access Offline</span>
            </div>
            <div class="feature-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="feature-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span>Health Records</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right side with login form -->
      <div class="login-form-section">
        <div class="login-form-container">
          <!-- Heart Icon Logo -->
          <div class="logo-container">
            <svg
              class="heart-logo"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              @click="navigateToDoctorLogin"
              style="cursor: pointer"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 class="login-title">Welcome Back</h2>
          <p class="login-subtitle">Sign in to access your health dashboard</p>

          <!-- Offline Mode Indicator -->
          <div v-if="isOfflineMode" class="offline-mode-banner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="offline-icon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18.364 5.636a9 9 0 010 12.728m-3.536-3.536a5 5 0 010-7.072M13 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
              />
            </svg>
            <span>You're currently in offline mode</span>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="error-message">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="error-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{{ errorMessage }}</span>
          </div>

          <form class="login-form" @submit.prevent="submitLogin">
            <!-- Login Method Toggle -->

            <!-- NIK Input Field (shown when loginMethod is 'nik') -->
            <div v-if="loginMethod === 'nik'" class="form-group">
              <label for="nik">NIK (National ID)</label>
              <div class="input-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="input-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                  />
                </svg>
                <input
                  id="nik"
                  v-model="nik"
                  type="text"
                  class="form-control"
                  placeholder="Enter your NIK"
                  required
                />
              </div>
            </div>

            <!-- Email Input Field (shown when loginMethod is 'email') -->
            <div v-if="loginMethod === 'email'" class="form-group">
              <label for="email">Email</label>
              <div class="input-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="input-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  class="form-control"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <div class="input-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="input-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  placeholder="Enter your password"
                  required
                />
                <button type="button" class="toggle-password" @click="togglePasswordVisibility">
                  <svg
                    v-if="showPassword"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div class="remember-forgot">
              <label class="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
            </div>

            <button type="button" class="btn-primary" @click="submitLogin" :disabled="isLoading">
              <div v-if="isLoading" class="loading-spinner"></div>
              <span>{{ isOfflineMode ? 'Login (Offline)' : 'Login' }}</span>
            </button>

            <div class="login-divider">
              <span>Don't have an account?</span>
            </div>

            <button
              type="button"
              @click="navigateToRegister"
              class="btn-secondary"
              :disabled="isOfflineMode"
              :class="{ 'btn-disabled': isOfflineMode }"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #f0f9ff 0%, #e1f5fe 100%);
  font-family: 'Inter', 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

.login-content {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  flex: 1;
}

/* Left side - illustration */
.login-illustration {
  display: none; /* Hidden on mobile */
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%);
  color: white;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.illustration-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.logo-container {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;
}

.heart-logo {
  position: relative;
  width: 3rem;
  height: 3rem;
  color: #f43f5e;
  filter: drop-shadow(0 0 8px rgba(244, 63, 94, 0.5));
  transition:
    transform 0.3s ease,
    filter 0.3s ease;
}

.heart-logo:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 0 12px rgba(244, 63, 94, 0.8));
}

.illustration-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.illustration-tagline {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

/* Health Tips Card */
.health-tip-card {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.tip-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.tip-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
}

.tip-text {
  font-size: 0.95rem;
  line-height: 1.5;
}

.features-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: auto;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-size: 0.875rem;
}

.feature-icon {
  width: 1.75rem;
  height: 1.75rem;
  margin-bottom: 0.5rem;
}

/* Right side - login form */
.login-form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1.5rem 0 1.5rem; /* Menghilangkan padding bawah */
}

.login-form-container {
  width: 100%;
  max-width: 450px;
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.login-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  text-align: center;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  color: #64748b;
  font-size: 0.95rem;
  text-align: center;
  margin-bottom: 2rem;
}

.offline-mode-banner {
  background-color: #f59e0b;
  color: white;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.offline-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.error-message {
  background-color: #f87171;
  color: white;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.error-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #334155;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  height: 1.25rem;
  width: 1.25rem;
  color: #94a3b8;
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
  background-color: #f8fafc;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
  background-color: white;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-password:hover {
  color: #64748b;
}

.remember-forgot {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.remember-me {
  display: flex;
  align-items: center;
  color: #334155;
  cursor: pointer;
}

.remember-me input {
  margin-right: 0.5rem;
}

.btn-primary {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-1px);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  margin-right: 0.5rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.login-divider {
  position: relative;
  text-align: center;
  margin-bottom: 1.5rem;
}

.login-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #e2e8f0;
}

.login-divider span {
  position: relative;
  background-color: white;
  padding: 0 1rem;
  color: #64748b;
  font-size: 0.875rem;
}

.btn-secondary {
  width: 100%;
  padding: 0.875rem;
  background-color: transparent;
  color: #1e40af;
  border: 1px solid #3b82f6;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover:not(.btn-disabled) {
  background-color: rgba(59, 130, 246, 0.05);
  transform: translateY(-1px);
}

.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.disabled-link {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Login method toggle styling */
.login-toggle {
  display: flex;
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.toggle-btn {
  flex: 1;
  padding: 0.75rem;
  background-color: #f8fafc;
  border: none;
  color: #64748b;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn.active {
  background-color: #3b82f6;
  color: white;
}

.toggle-btn:hover:not(.active) {
  background-color: #e2e8f0;
}

/* Responsive design */
@media (min-width: 1024px) {
  .login-content {
    flex-direction: row;
    height: 100vh; /* Tetapkan tinggi penuh pada layar desktop */
  }

  .login-illustration {
    display: flex;
    flex: 1;
    height: 100vh; /* Pastikan tinggi penuh */
  }

  .login-form-section {
    flex: 1;
    height: 100vh; /* Pastikan tinggi penuh */
    overflow-y: auto; /* Tambahkan scroll jika konten terlalu panjang */
  }
}

/* Animations for illustration background */
.login-illustration::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: rotate 30s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Install App Button Styles */
.install-app-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  margin: 0 auto;
  transition: all 0.2s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.install-app-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.install-icon {
  width: 20px;
  height: 20px;
}
</style>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import FooterComponent from '@/components/Footer-component.vue'
import LazyImage from '@/components/LazyImage.vue'
import apiService from '@/services/ApiService'
import authService from '@/services/AuthService'
import LoadingComponent from '@/components/LoadingComponent.vue'
import NetworkErrorComponent from '@/components/NetworkErrorComponent.vue'

defineOptions({
  name: 'AccountPage',
})

const router = useRouter()
const fileInput = ref(null)
const userPhotoUrl = ref(null)
const isLoading = ref(true)
const error = ref(null)

// User information from API
const user = ref({
  name: '',
  nik: '',
  email: '',
  lastLogin: (() => {
    const date = new Date()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const day = date.getDate()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}, ${hours}.${minutes}`
  })(),
  healthStatus: 'Good',
  profileCompleted: 85,
})

// Computed property to check if user data is loaded
const isUserDataLoaded = computed(() => {
  return user.value.name !== '' && user.value.nik !== ''
})

// Notification system
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref('success') // 'success', 'error', 'info'

// Function to toggle photo options menu
const showPhotoOptions = ref(false)

const togglePhotoOptions = () => {
  showPhotoOptions.value = !showPhotoOptions.value
}

// Function to open file input dialog
const triggerFileInput = () => {
  fileInput.value.click()
  showPhotoOptions.value = false
}

// Function to remove profile photo
const removePhoto = () => {
  userPhotoUrl.value = null
  localStorage.removeItem('userPhotoUrl')

  showNotification.value = true
  notificationMessage.value = 'Foto profil telah dihapus'
  notificationType.value = 'info'
  setTimeout(() => {
    showNotification.value = false
  }, 3000)

  showPhotoOptions.value = false
}

// Handle file upload
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type.match('image.*')) {
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification.value = true
      notificationMessage.value = 'File terlalu besar. Maksimal ukuran 5MB.'
      notificationType.value = 'error'
      setTimeout(() => {
        showNotification.value = false
      }, 3000)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      userPhotoUrl.value = e.target.result
      // In a real application, you would upload this to a server
      // and store the URL or reference in the user's profile

      // Update profile completion
      if (user.value.profileCompleted < 100) {
        user.value.profileCompleted += 5
        if (user.value.profileCompleted > 100) {
          user.value.profileCompleted = 100
        }
      }

      // Save to localStorage for persistence between page loads
      localStorage.setItem('userPhotoUrl', userPhotoUrl.value)

      // Show success notification
      showNotification.value = true
      notificationMessage.value = 'Foto profil berhasil diperbarui!'
      notificationType.value = 'success'
      setTimeout(() => {
        showNotification.value = false
      }, 3000)
    }
    reader.readAsDataURL(file)
  } else if (file) {
    // Wrong file type
    showNotification.value = true
    notificationMessage.value = 'Format file tidak didukung. Gunakan file gambar.'
    notificationType.value = 'error'
    setTimeout(() => {
      showNotification.value = false
    }, 3000)
  }
}

// Load profile photo from localStorage if available
onMounted(() => {
  const savedPhotoUrl = localStorage.getItem('userPhotoUrl')
  if (savedPhotoUrl) {
    userPhotoUrl.value = savedPhotoUrl
  }

  // Load user data from API
  loadUserData()
})

// Fetch user data from API
const loadUserData = async () => {
  try {
    isLoading.value = true
    error.value = null

    // Get current user from auth service
    const currentUser = authService.getCurrentUser()

    if (currentUser) {
      // Use user data from local storage if available
      user.value = {
        ...user.value,
        name: currentUser.name || 'User',
        nik: currentUser.nik || '',
        email: currentUser.email || '',
      }

      // Try to fetch fresh data from API if online
      if (navigator.onLine) {
        const response = await apiService.get('/api/v1/auth/profile')
        const userData = response.data || response

        if (userData && userData.data) {
          // Update user data with fresh data from API
          user.value = {
            ...user.value,
            name: userData.data.name || user.value.name,
            email: userData.data.email || user.value.email,
            // NIK is stored locally as it's not returned by the API for security
          }
        }
      }
    } else {
      // No authenticated user found, redirect to login
      router.push('/')
    }
  } catch (err) {
    console.error('Error loading user data:', err)
    error.value = {
      title: 'Failed to load profile',
      message: err.message || 'Could not load your profile data. Please try again.',
    }
  } finally {
    isLoading.value = false
  }
}

// Logout function
const logout = () => {
  try {
    // Clear authentication data
    authService.logout()
    // Show notification before redirecting
    showNotification.value = true
    notificationMessage.value = 'Logged out successfully'
    notificationType.value = 'info'

    // Redirect after a short delay
    setTimeout(() => {
      router.push('/') // Redirect to login page
    }, 1500)
  } catch (error) {
    console.error('Logout error:', error)
    showNotification.value = true
    notificationMessage.value = 'Error during logout'
    notificationType.value = 'error'
  }
}

// Navigate to history page
const goToHistory = () => {
  router.push('/history')
}

// Mock health data for the dashboard
const healthData = ref([
  { icon: 'heart', label: 'Heart Rate', value: '72 bpm', trend: 'stable' },
  { icon: 'pressure', label: 'Blood Pressure', value: '120/80', trend: 'improved' },
  { icon: 'activity', label: 'Activity', value: '6.2k steps', trend: 'decreased' },
])
</script>

<template>
  <div class="account-page">
    <!-- Notification component -->
    <div
      v-if="showNotification"
      class="fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-y-0 opacity-100"
      :class="{
        'bg-green-100 border-l-4 border-green-500 text-green-700': notificationType === 'success',
        'bg-red-100 border-l-4 border-red-500 text-red-700': notificationType === 'error',
        'bg-blue-100 border-l-4 border-blue-500 text-blue-700': notificationType === 'info',
      }"
    >
      <div class="flex items-center">
        <!-- Success icon -->
        <div v-if="notificationType === 'success'" class="mr-3">
          <svg
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <!-- Error icon -->
        <div v-if="notificationType === 'error'" class="mr-3">
          <svg
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <!-- Info icon -->
        <div v-if="notificationType === 'info'" class="mr-3">
          <svg
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <p class="font-medium">{{ notificationMessage }}</p>
      </div>
    </div>

    <!-- Main section with gradient background -->
    <div
      class="relative bg-gradient-to-b from-blue-500 via-blue-600 to-indigo-700 min-h-screen overflow-hidden"
    >
      <!-- Floating elements for modern background -->
      <div class="absolute inset-0 z-0">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
      </div>

      <div class="container max-w-5xl mx-auto py-12 px-4 relative z-10">
        <!-- Loading component -->
        <LoadingComponent
          :is-loading="isLoading"
          message="Loading your profile..."
          :full-page="false"
        />

        <!-- Error component -->
        <NetworkErrorComponent
          v-if="error && !isLoading"
          :title="error.title"
          :message="error.message"
          :retry-action="loadUserData"
        />

        <!-- Page header with welcome message -->
        <div class="mb-8 text-center" v-if="!isLoading && !error">
          <div
            class="inline-block px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-400/20 text-blue-100 text-sm mb-4"
          >
            User Profile
          </div>
          <h1 class="text-4xl font-bold text-white mb-2 tracking-tight">
            Welcome, {{ user.name }}
          </h1>
          <p class="text-blue-100/80">Manage your account and view your health information</p>
        </div>

        <!-- Main content with two columns on larger screens -->
        <div
          class="grid grid-cols-1 lg:grid-cols-3 gap-6"
          v-if="!isLoading && !error && isUserDataLoaded"
        >
          <!-- Left column: Profile card -->
          <div class="lg:col-span-1">
            <div
              class="bg-white/95 backdrop-blur-md rounded-xl shadow-lg overflow-hidden transform hover:translate-y-[-5px] transition-all duration-300"
            >
              <!-- Profile header -->
              <div class="relative">
                <div
                  class="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-90"
                ></div>
                <div class="relative z-10 p-6 text-center">
                  <!-- Profile photo with upload overlay -->
                  <div class="relative inline-block mb-3">
                    <div
                      v-if="userPhotoUrl"
                      class="h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto"
                    >
                      <img
                        :src="userPhotoUrl"
                        alt="Profile Photo"
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <div
                      v-else
                      class="h-24 w-24 flex items-center justify-center bg-white rounded-full p-4 border-4 border-white shadow-lg mx-auto"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-14 w-14 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.5"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>

                    <!-- Upload overlay and input -->
                    <div
                      class="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 p-1.5 rounded-full cursor-pointer border-2 border-white shadow-md transition-all duration-200 group"
                      @click="togglePhotoOptions"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <input
                        type="file"
                        ref="fileInput"
                        accept="image/*"
                        class="hidden"
                        @change="handleFileUpload"
                      />
                    </div>

                    <!-- Photo options menu -->
                    <div
                      v-if="showPhotoOptions"
                      class="absolute bottom-8 right-0 bg-white rounded-md shadow-lg overflow-hidden z-20 min-w-[180px]"
                    >
                      <div class="py-1">
                        <button
                          @click="triggerFileInput"
                          class="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 mr-2 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Upload Foto
                        </button>

                        <button
                          v-if="userPhotoUrl"
                          @click="removePhoto"
                          class="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 mr-2 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Hapus Foto
                        </button>
                      </div>
                    </div>
                  </div>
                  <h2 class="text-2xl font-bold text-white mb-1">{{ user.name }}</h2>
                  <p class="text-blue-100 text-sm">
                    Member since {{ user.lastLogin.split(',')[0] }}
                  </p>
                </div>

                <!-- Profile completion indicator -->
                <div class="bg-white/10 backdrop-blur-sm px-6 py-3">
                  <div class="flex items-center justify-between text-white">
                    <span class="text-xs font-medium">Profile completed</span>
                    <span class="text-xs font-bold">{{ user.profileCompleted }}%</span>
                  </div>
                  <div class="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                      :style="{ width: user.profileCompleted + '%' }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Profile details -->
              <div class="p-6">
                <div class="space-y-4">
                  <div
                    class="health-status-card bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100"
                  >
                    <div class="flex justify-between items-center mb-2">
                      <h3 class="font-medium text-gray-700">Health Status</h3>
                      <span class="health-badge">{{ user.healthStatus }}</span>
                    </div>
                    <p class="text-sm text-gray-500">
                      Your health data is regularly monitored by our system
                    </p>
                  </div>

                  <div>
                    <label class="flex items-center text-gray-700 text-sm font-medium mb-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-1 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Full Name
                    </label>
                    <div class="form-field">{{ user.name }}</div>
                  </div>

                  <div>
                    <label class="flex items-center text-gray-700 text-sm font-medium mb-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-1 text-gray-500"
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
                      NIK
                    </label>
                    <div class="form-field font-mono">{{ user.nik }}</div>
                  </div>

                  <div>
                    <label class="flex items-center text-gray-700 text-sm font-medium mb-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-1 text-gray-500"
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
                      Email
                    </label>
                    <div class="form-field text-blue-600">{{ user.email }}</div>
                  </div>

                  <div>
                    <label class="flex items-center text-gray-700 text-sm font-medium mb-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-1 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Last Login
                    </label>
                    <div class="form-field">{{ user.lastLogin }}</div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="mt-8">
                  <button
                    @click="logout"
                    class="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-5 rounded-md transition-all duration-200 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right column: Health overview and quick actions -->
          <div class="lg:col-span-2">
            <!-- Health snapshot card -->
            <div
              class="bg-white/95 backdrop-blur-md rounded-xl shadow-lg overflow-hidden mb-6 transform hover:translate-y-[-5px] transition-all duration-300"
            >
              <div class="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-5">
                <h3 class="text-xl font-bold text-white flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Health Snapshot
                </h3>
              </div>

              <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div v-for="(item, index) in healthData" :key="index" class="health-data-card">
                    <div class="health-data-icon" :class="'icon-' + item.icon">
                      <svg
                        v-if="item.icon === 'heart'"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <svg
                        v-if="item.icon === 'pressure'"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6"
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
                      <svg
                        v-if="item.icon === 'activity'"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <div class="mt-2">
                      <div class="text-sm text-gray-500">{{ item.label }}</div>
                      <div class="text-xl font-bold text-gray-800">{{ item.value }}</div>
                    </div>
                    <div class="mt-2 flex items-center">
                      <span class="trend-indicator" :class="'trend-' + item.trend">
                        <svg
                          v-if="item.trend === 'improved'"
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                          />
                        </svg>
                        <svg
                          v-if="item.trend === 'decreased'"
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                        <svg
                          v-if="item.trend === 'stable'"
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 12h14"
                          />
                        </svg>
                      </span>
                      <span
                        class="text-xs ml-1"
                        :class="{
                          'text-green-600': item.trend === 'improved',
                          'text-red-600': item.trend === 'decreased',
                          'text-gray-500': item.trend === 'stable',
                        }"
                        >{{
                          item.trend === 'improved'
                            ? 'Improved'
                            : item.trend === 'decreased'
                              ? 'Decreased'
                              : 'Stable'
                        }}</span
                      >
                    </div>
                  </div>
                </div>

                <div class="mt-6">
                  <button @click="goToHistory" class="view-history-btn">
                    View Complete Health History
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Component -->
    <FooterComponent />
  </div>
</template>

<style scoped>
.account-page {
  margin-top: -1rem;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

/* Floating shapes for modern background */
.floating-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  filter: blur(40px);
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: 10%;
  left: 5%;
  animation: float-animation 15s infinite ease-in-out alternate;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: 20%;
  right: 10%;
  animation: float-animation 20s infinite ease-in-out alternate-reverse;
}

.shape-3 {
  width: 150px;
  height: 150px;
  bottom: 30%;
  left: 15%;
  animation: float-animation 17s infinite ease-in-out alternate;
}

@keyframes float-animation {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(40px, 20px);
  }
  100% {
    transform: translate(10px, 40px);
  }
}

/* Form field styling */
.form-field {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.9rem;
  color: #374151;
}

/* Health status badge */
.health-badge {
  background: linear-gradient(90deg, #34d399, #10b981);
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

/* Health data card styling */
.health-data-card {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  padding: 1.25rem;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.health-data-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  background-color: white;
}

.health-data-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
}

.icon-heart {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.icon-pressure {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.icon-activity {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

/* Trend indicator styling */
.trend-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
}

.trend-improved {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.trend-decreased {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.trend-stable {
  background-color: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

/* Action card styling */
.action-card {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  padding: 1.25rem;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.action-card:hover {
  background-color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
}

.action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  color: #4b5563;
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: #e5e7eb;
  color: #1f2937;
  transform: translateY(-1px);
}

/* View history button */
.view-history-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: linear-gradient(90deg, #3b82f6, #4f46e5);
  color: white;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.view-history-btn:hover {
  background: linear-gradient(90deg, #2563eb, #4338ca);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.25);
}

/* Profile photo styles */
.profile-photo-container {
  position: relative;
  display: inline-block;
  transition: all 0.3s ease;
}

.profile-photo-container:hover .photo-overlay {
  opacity: 1;
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 9999px;
}

.upload-icon-button {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* Notification animation */
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .health-data-card {
    padding: 1rem;
  }

  .action-card {
    padding: 1rem;
  }
}
</style>

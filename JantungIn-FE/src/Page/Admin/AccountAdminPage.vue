<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FooterComponent from '@/components/Footer-component.vue'
import LazyImage from '@/components/LazyImage.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import NetworkErrorComponent from '@/components/NetworkErrorComponent.vue'
import profileService from '@/services/ProfileService'

defineOptions({
  name: 'AccountPageAdmin',
})

const router = useRouter()
const fileInput = ref(null)
const doctorPhotoUrl = ref(null)
const showPhotoOptions = ref(false)
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref('success')
const isLoading = ref(true)
const error = ref(null)

// Initialize default user data
const user = ref({
  name: '',
  yearsofexperience: 0,
  license: '',
  dateofbirth: '',
  email: '',
  Hospital: '',
  department: '',
  position: '',
  specialty: '',
  patients: 0,
  diagnoses: 0,
  certifications: [],
})

// Initialize empty activities
const recentActivities = ref([])

// Initialize empty stats
const stats = ref([
  { title: 'This Week', diagnoses: 0, consultations: 0, reviews: 0 },
  { title: 'This Month', diagnoses: 0, consultations: 0, reviews: 0 },
  { title: 'Total', diagnoses: 0, patients: 0 },
])

// Function to load profile data
const loadProfileData = async () => {
  try {
    isLoading.value = true
    error.value = null

    // Load profile data
    const profileResponse = await profileService.getProfile()

    // Format respons bisa berbeda-beda, jadi kita coba beberapa variasi path
    // 1. data.data.data - standar dari API yang dikemas dalam axios full response
    // 2. data.data - untuk data yang dikemas dalam "data" field
    // 3. data - untuk respons yang langsung berisi data
    const profileResponseData = profileResponse?.data?.data || profileResponse?.data || {}
    const profileData = profileResponseData?.data || profileResponseData

    console.log('Profile response structure:', {
      hasDataData: !!profileResponse?.data?.data,
      hasData: !!profileResponse?.data,
      profileData,
    })

    if (profileData) {
      console.log('Profile data loaded:', profileData)
      user.value = {
        ...user.value,
        name: profileData.name || '',
        email: profileData.email || '',
        specialty: profileData.specialty || 'Cardiology',
        department: profileData.department || 'Cardiology',
        position: profileData.position || 'Senior Cardiologist',
        license: profileData.license || '1234567890',
        Hospital: profileData.hospital || 'JantungIn Hospital',
        dateofbirth: profileData.dateOfBirth,
        yearsofexperience: profileData.yearsOfExperience || 5,
        certifications: profileData.certifications || ['Board Certified Cardiologist'],
      }
    } else {
      console.warn('No profile data found in response')
    }

    // Load dashboard stats
    const statsResponse = await profileService.getDashboardStats()

    // Format respons bisa berbeda-beda, seperti pada profile
    const statsResponseData = statsResponse?.data?.data || statsResponse?.data || {}
    const statsData = statsResponseData?.data || statsResponseData

    console.log('Stats response structure:', {
      hasDataData: !!statsResponse?.data?.data,
      hasData: !!statsResponse?.data,
      statsData,
    })

    if (statsData) {
      console.log('Dashboard stats loaded:', statsData)
      const { users = {}, diagnoses = {} } = statsData
      stats.value = [
        {
          title: 'This Week',
          diagnoses: diagnoses?.newLastWeek || 0,
          consultations: diagnoses?.recentConsultations || 0,
          reviews: diagnoses?.recentReviews || 0,
        },
        {
          title: 'This Month',
          diagnoses: diagnoses?.monthlyTotal || 0,
          consultations: diagnoses?.monthlyConsultations || 0,
          reviews: diagnoses?.monthlyReviews || 0,
        },
        {
          title: 'Total',
          diagnoses: diagnoses?.total || 0,
          patients: users?.total || 0,
        },
      ]
    } else {
      console.warn('No dashboard stats found in response')
    }

    // Load activities
    const activitiesResponse = await profileService.getRecentActivities()
    // Data langsung dalam format array dari hasil implementasi baru
    const activitiesData = activitiesResponse.data

    if (Array.isArray(activitiesData)) {
      console.log('Activities loaded from diagnosis data:', activitiesData)
      recentActivities.value = activitiesData.map((activity) => ({
        type: activity.type,
        patientId: activity.patientId,
        patientName: activity.patientName,
        date: new Date(activity.createdAt).toLocaleDateString('id-ID'),
        time: new Date(activity.createdAt).toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'Completed', // Semua aktivitas diagnosis memiliki status Completed
      }))
    } else {
      console.warn('No activities found in response or invalid format')
    }
  } catch (err) {
    console.error('Error loading profile data:', err)
    error.value = {
      title: 'Failed to load profile',
      message: err.message || 'Could not load your profile data. Please try again.',
    }
  } finally {
    isLoading.value = false
  }
}

// Function to toggle photo options
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
  doctorPhotoUrl.value = null
  localStorage.removeItem('doctorPhotoUrl')

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
      doctorPhotoUrl.value = e.target.result
      // In a real application, you would upload this to a server
      // and store the URL or reference in the doctor's profile

      // Save to localStorage for persistence between page loads
      localStorage.setItem('doctorPhotoUrl', doctorPhotoUrl.value)

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

// Logout function
const logout = async () => {
  try {
    // Clear auth data
    router.push('/admin')
  } catch (err) {
    console.error('Logout error:', err)
    showNotification.value = true
    notificationMessage.value = 'Error during logout'
    notificationType.value = 'error'
  }
}

// Load profile photo from localStorage if available
onMounted(() => {
  // Load saved photo from localStorage
  const savedPhotoUrl = localStorage.getItem('doctorPhotoUrl')
  if (savedPhotoUrl) {
    doctorPhotoUrl.value = savedPhotoUrl
  }

  // Load profile data from API
  loadProfileData()
})
</script>

<template>
  <div class="account-page-admin mt-16">
    <!-- Notification -->
    <div
      v-if="showNotification"
      class="fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300"
      :class="{
        'bg-green-100 border-l-4 border-green-500 text-green-700': notificationType === 'success',
        'bg-red-100 border-l-4 border-red-500 text-red-700': notificationType === 'error',
        'bg-blue-100 border-l-4 border-blue-500 text-blue-700': notificationType === 'info',
      }"
    >
      <div class="flex items-center">
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
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
      class="relative bg-gradient-to-b from-blue-600 via-indigo-700 to-indigo-900 min-h-screen overflow-hidden"
    >
      <div class="absolute inset-0 z-0">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
        <div class="bg-dot-pattern absolute inset-0 opacity-10"></div>
      </div>

      <div class="container max-w-7xl mx-auto py-12 px-4 relative z-10">
        <!-- Loading Component -->
        <LoadingComponent v-if="isLoading" message="Loading your profile..." :full-page="false" />

        <!-- Error Component -->
        <NetworkErrorComponent
          v-else-if="error"
          :title="error.title"
          :message="error.message"
          :retry-action="loadProfileData"
        />

        <!-- Content when data is loaded -->
        <div v-else>
          <!-- Page header -->
          <div class="mb-8 text-center">
            <div
              class="inline-block px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-400/20 text-blue-100 text-sm mb-4"
            >
              Medical Staff ID: MD-{{ user.license }}
            </div>
            <h1 class="text-4xl font-bold text-white mb-2 tracking-tight">Doctor Dashboard</h1>
            <p class="text-blue-100/80">Welcome back, Dr. {{ user.name }}</p>
          </div>

          <!-- Main content grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Left column -->
            <div class="lg:col-span-1">
              <!-- Profile card -->
              <div
                class="bg-white/95 backdrop-blur-md rounded-xl shadow-lg overflow-hidden transform hover:translate-y-[-5px] transition-all duration-300 mb-6"
              >
                <div class="relative">
                  <div
                    class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90"
                  ></div>
                  <div class="relative z-10 p-6 text-center">
                    <!-- Profile photo -->
                    <div class="relative inline-block mb-3">
                      <div
                        v-if="doctorPhotoUrl"
                        class="h-28 w-28 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto"
                      >
                        <img
                          :src="doctorPhotoUrl"
                          alt="Doctor Profile Photo"
                          class="h-full w-full object-cover"
                        />
                      </div>
                      <div
                        v-else
                        class="h-28 w-28 flex items-center justify-center bg-white rounded-full p-4 border-4 border-white shadow-lg mx-auto"
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
                    </div>
                    <h2 class="text-2xl font-bold text-white mb-1">Dr. {{ user.name }}</h2>
                    <p class="text-blue-100 text-sm">{{ user.position }}</p>
                  </div>
                </div>

                <!-- Profile details -->
                <div class="p-6">
                  <div class="flex flex-wrap gap-2 mb-4">
                    <span class="badge badge-specialty">{{ user.specialty }}</span>
                    <span class="badge badge-department">{{ user.department }}</span>
                  </div>
                  <div class="space-y-4 mt-6">
                    <div class="detail-row">
                      <div class="detail-label">
                        <svg
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
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div class="detail-value">{{ user.yearsofexperience }} years</div>
                    </div>

                    <div class="detail-row">
                      <div class="detail-label">
                        <svg
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
                            d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div class="detail-value font-mono">{{ user.license }}</div>
                    </div>

                    <div class="detail-row">
                      <div class="detail-label">
                        <svg
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div class="detail-value">{{ user.dateofbirth }}</div>
                    </div>

                    <div class="detail-row">
                      <div class="detail-label">
                        <svg
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
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div class="detail-value text-blue-600">{{ user.email }}</div>
                    </div>

                    <div class="detail-row">
                      <div class="detail-label">
                        <svg
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
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <div class="detail-value">{{ user.Hospital }}</div>
                    </div>

                    <div class="detail-row">
                      <div class="detail-label">
                        <svg
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div class="detail-value">{{ user.lastLogin }}</div>
                    </div>
                  </div>

                  <!-- Certifications -->
                  <div class="mt-6">
                    <h4 class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                      Certifications
                    </h4>
                    <ul class="space-y-1">
                      <li
                        v-for="(cert, index) in user.certifications"
                        :key="index"
                        class="flex items-center"
                      >
                        <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        <span class="text-sm text-gray-600">{{ cert }}</span>
                      </li>
                    </ul>
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

              <!-- Empty space to remove Statistics card from this location -->
            </div>

            <!-- Right column: Activities and actions -->
            <div class="lg:col-span-2">
              <!-- Recent activities card -->
              <div
                class="bg-white/95 backdrop-blur-md rounded-xl shadow-lg overflow-hidden mb-6 transform hover:translate-y-[-5px] transition-all duration-300"
              >
                <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
                  <h3 class="text-xl font-bold text-white flex items-center">Recent Activities</h3>
                </div>

                <div class="p-6">
                  <div v-if="recentActivities.length === 0" class="text-center py-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-12 w-12 mx-auto text-gray-400 mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 class="text-gray-600 font-medium">Belum Ada Aktivitas</h3>
                    <p class="text-gray-500 text-sm mt-1">
                      Aktivitas diagnosis akan muncul di sini
                    </p>
                  </div>
                  <div v-else class="space-y-4">
                    <div
                      v-for="(activity, index) in recentActivities"
                      :key="index"
                      class="activity-item"
                    >
                      <div class="activity-icon bg-blue-100 text-blue-600">
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
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                      <div class="flex-grow">
                        <div class="flex justify-between">
                          <h5 class="font-medium text-gray-800">
                            {{ activity.patientName }}
                            <span class="text-sm font-normal text-gray-500">{{
                              activity.patientId
                            }}</span>
                          </h5>
                          <span class="text-sm text-gray-500"
                            >{{ activity.date }}, {{ activity.time }}</span
                          >
                        </div>
                        <p class="text-sm text-gray-600 mt-1">Performed diagnosis</p>
                      </div>
                      <div class="ml-2">
                        <span class="status-badge bg-green-100 text-green-800"> Completed </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Statistics card -->
              <div
                class="bg-white/95 backdrop-blur-md rounded-xl shadow-lg overflow-hidden transform hover:translate-y-[-5px] transition-all duration-300"
              >
                <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
                  <h3 class="text-xl font-bold text-white flex items-center">Statistics</h3>
                </div>

                <div class="p-6">
                  <div class="space-y-5">
                    <div v-for="(stat, index) in stats" :key="index" class="stat-group">
                      <h4 class="text-sm font-semibold text-gray-600 mb-3">{{ stat.title }}</h4>
                      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div v-if="stat.diagnoses" class="stat-card">
                          <div class="stat-number">{{ stat.diagnoses }}</div>
                          <div class="stat-label">Diagnoses</div>
                        </div>
                        <div v-if="stat.consultations" class="stat-card">
                          <div class="stat-number">{{ stat.consultations }}</div>
                          <div class="stat-label">Consultations</div>
                        </div>
                        <div v-if="stat.reviews" class="stat-card">
                          <div class="stat-number">{{ stat.reviews }}</div>
                          <div class="stat-label">Reviews</div>
                        </div>
                        <div v-if="stat.patients" class="stat-card">
                          <div class="stat-number">{{ stat.patients }}</div>
                          <div class="stat-label">Patients</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <FooterComponent />
  </div>
</template>

<style scoped>
/* Base page styling */
.account-page-admin {
  margin-top: -1rem;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

/* Badge styling */
.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
}

.badge-specialty {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.badge-department {
  background-color: rgba(99, 102, 241, 0.1);
  color: #6366f1;
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

/* Dot pattern background */
.bg-dot-pattern {
  background-image: radial-gradient(circle, #ffffff 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Detail row styling */
.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  display: flex;
  align-items: center;
  color: #6b7280;
  font-size: 0.875rem;
}

.detail-label svg {
  margin-right: 0.5rem;
}

.detail-value {
  font-weight: 500;
  color: #111827;
}

/* Activity item styling */
.activity-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #f9fafb;
  transition: all 0.3s ease;
}

.activity-item:hover {
  background-color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.activity-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  margin-right: 0.75rem;
}

/* Stats styling */
.stat-group {
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.stat-group:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.stat-card {
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  background-color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .activity-item {
    padding: 0.75rem;
  }

  .stat-card {
    padding: 0.75rem;
  }

  .stat-number {
    font-size: 1.25rem;
  }
}
</style>

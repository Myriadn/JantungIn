<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FooterComponent from '@/components/Footer-component.vue'
import LazyImage from '@/components/LazyImage.vue'

defineOptions({
  name: 'AccountPageAdmin',
})

const router = useRouter()
const fileInput = ref(null)
const doctorPhotoUrl = ref(null)
const showPhotoOptions = ref(false)
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref('success') // 'success', 'error', 'info'

// User information (mock data)
const user = ref({
  name: 'Bener Dzero',
  yearsofexperience: 5,
  license: '1234567890',
  dateofbirth: '01/01/1990',
  email: 'bener.dzero@example.com',
  Hospital: 'RS Bhayangkara',
  department: 'Cardiology',
  position: 'Senior Cardiologist',
  specialty: 'Cardiovascular Disease',
  patients: 1240,
  diagnoses: 3567,
  certifications: ['Board Certified Cardiologist', 'Advanced Cardiac Life Support'],
  lastLogin: (() => {
    const date = new Date()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const day = date.getDate()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}, ${hours}.${minutes}`
  })(),
})

// Mock data for recent activities
const recentActivities = ref([
  {
    type: 'diagnosis',
    patientId: 'PT-78945',
    patientName: 'Ahmad Farhan',
    date: '31/05/2025',
    time: '09:35',
    status: 'completed',
  },
  {
    type: 'review',
    patientId: 'PT-78254',
    patientName: 'Siti Nurhaliza',
    date: '30/05/2025',
    time: '14:20',
    status: 'completed',
  }
])

// Stats for the dashboard
const stats = ref([
  { title: 'This Week', diagnoses: 27, consultations: 18, reviews: 12 },
  { title: 'This Month', diagnoses: 116, consultations: 94, reviews: 67 },
  { title: 'Total', diagnoses: user.value.diagnoses, patients: user.value.patients },
])

// Function to toggle photo options menu
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
const logout = () => {
  // In a real app, you would clear tokens or session data here
  router.push('/admin') // Redirect to login page
}

// Load profile photo from localStorage if available
onMounted(() => {
  const savedPhotoUrl = localStorage.getItem('doctorPhotoUrl')
  if (savedPhotoUrl) {
    doctorPhotoUrl.value = savedPhotoUrl
  }
})
</script>

<template>
  <div class="account-page-admin mt-16">
    <!-- Notification component -->
    <div 
      v-if="showNotification" 
      class="fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-y-0 opacity-100"
      :class="{
        'bg-green-100 border-l-4 border-green-500 text-green-700': notificationType === 'success',
        'bg-red-100 border-l-4 border-red-500 text-red-700': notificationType === 'error',
        'bg-blue-100 border-l-4 border-blue-500 text-blue-700': notificationType === 'info'
      }"
    >
      <div class="flex items-center">
        <!-- Success icon -->
        <div v-if="notificationType === 'success'" class="mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <!-- Error icon -->
        <div v-if="notificationType === 'error'" class="mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <!-- Info icon -->
        <div v-if="notificationType === 'info'" class="mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <p class="font-medium">{{ notificationMessage }}</p>
      </div>
    </div>
    
    <!-- Added mt-16 for navbar spacing -->
    <!-- Main section with gradient background -->
    <div
      class="relative bg-gradient-to-b from-blue-600 via-indigo-700 to-indigo-900 min-h-screen overflow-hidden"
    >
      <!-- Floating elements for modern background -->
      <div class="absolute inset-0 z-0">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
        <div class="bg-dot-pattern absolute inset-0 opacity-10"></div>
      </div>

      <div class="container max-w-7xl mx-auto py-12 px-4 relative z-10">
        <!-- Page header with title -->
        <div class="mb-8 text-center">
          <div
            class="inline-block px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-400/20 text-blue-100 text-sm mb-4"
          >
            Medical Staff ID: MD-{{ user.license }}
          </div>
          <h1 class="text-4xl font-bold text-white mb-2 tracking-tight">Doctor Dashboard</h1>
          <p class="text-blue-100/80">Welcome back, Dr. {{ user.name }}</p>
        </div>

        <!-- Main content grid layout -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left column: Profile and stats -->
          <div class="lg:col-span-1">
            <!-- Doctor profile card -->
            <div
              class="bg-white/95 backdrop-blur-md rounded-xl shadow-lg overflow-hidden transform hover:translate-y-[-5px] transition-all duration-300 mb-6"
            >
              <div class="relative">
                <div
                  class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90"
                ></div>
                <div class="relative z-10 p-6 text-center">
                  <!-- Profile photo with upload overlay -->
                  <div class="relative inline-block mb-3">
                    <div v-if="doctorPhotoUrl" class="h-28 w-28 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                      <img :src="doctorPhotoUrl" alt="Doctor Profile Photo" class="h-full w-full object-cover" />
                    </div>
                    <div v-else class="h-28 w-28 flex items-center justify-center bg-white rounded-full p-4 border-4 border-white shadow-lg mx-auto">
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
                      class="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 p-2 rounded-full cursor-pointer border-2 border-white shadow-md transition-all duration-200 group"
                      @click="togglePhotoOptions"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
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
                      class="absolute bottom-12 right-0 bg-white rounded-md shadow-lg overflow-hidden z-20 min-w-[180px]"
                    >
                      <div class="py-1">
                        <button 
                          @click="triggerFileInput" 
                          class="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Upload Foto
                        </button>
                        
                        <button 
                          v-if="doctorPhotoUrl"
                          @click="removePhoto" 
                          class="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Hapus Foto
                        </button>
                      </div>
                    </div>
                  </div>
                  <h2 class="text-2xl font-bold text-white mb-1">Dr. {{ user.name }}</h2>
                  <p class="text-blue-100 text-sm">{{ user.position }}</p>
                </div>
              </div>

              <div class="p-6">
                <!-- Specialty and department badges -->
                <div class="flex flex-wrap gap-2 mb-4">
                  <span class="badge badge-specialty">{{ user.specialty }}</span>
                  <span class="badge badge-department">{{ user.department }}</span>
                </div>

                <!-- Doctor details -->
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
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Experience
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
                      License No.
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
                      Date of Birth
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
                      Email
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
                      Hospital
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
                      Last Login
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Recent Activities
                </h3>
              </div>

              <div class="p-6">
                <div class="mb-6">
                  <div class="flex items-center justify-between mb-4">
                    <h4 class="text-gray-700 font-medium">Latest Patient Interactions</h4>
                    <button class="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                      View All
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>

                  <div class="space-y-4">
                    <div
                      v-for="(activity, index) in recentActivities"
                      :key="index"
                      class="activity-item"
                    >
                      <div
                        class="activity-icon"
                        :class="{
                          'bg-blue-100 text-blue-600': activity.type === 'diagnosis',
                          'bg-purple-100 text-purple-600': activity.type === 'review',
                        }"
                      >
                        <svg
                          v-if="activity.type === 'diagnosis'"
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
                        <svg
                          v-if="activity.type === 'review'"
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
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
                        <p class="text-sm text-gray-600 mt-1">
                          {{
                            activity.type === 'diagnosis'
                              ? 'Performed diagnosis'
                              : 'Medical record review'
                          }}
                        </p>
                      </div>
                      <div class="ml-2">
                        <span
                          class="status-badge"
                          :class="{
                            'bg-green-100 text-green-800': activity.status === 'completed',
                            'bg-blue-100 text-blue-800': activity.status === 'scheduled',
                          }"
                        >
                          {{ activity.status }}
                        </span>
                      </div>
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Statistics
                </h3>
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

    <!-- Footer Component -->
    <FooterComponent />
  </div>
</template>

<style scoped>
.account-page-admin {
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
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

/* Badge styling */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-specialty {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-department {
  background-color: #e0e7ff;
  color: #4338ca;
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

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  text-transform: capitalize;
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
  transform: translateY(-3px);
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

/* Resource button styling */
.resource-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  color: #4b5563;
  font-weight: 500;
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.resource-btn:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
  color: #1f2937;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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

/* Profile photo upload styling */
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
  .activity-item {
    padding: 0.75rem;
  }

  .action-card {
    padding: 1rem;
  }

  .stat-card {
    padding: 0.75rem;
  }

  .stat-number {
    font-size: 1.25rem;
  }
}
</style>

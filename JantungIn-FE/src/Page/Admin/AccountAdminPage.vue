<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import FooterComponent from '@/components/Footer-component.vue'

defineOptions({
  name: 'AccountPageAdmin',
})

const router = useRouter()

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
    status: 'completed'
  },
  {
    type: 'review',
    patientId: 'PT-78254',
    patientName: 'Siti Nurhaliza',
    date: '30/05/2025',
    time: '14:20',
    status: 'completed'
  },
  {
    type: 'consultation',
    patientId: 'PT-77645',
    patientName: 'Budi Santoso',
    date: '29/05/2025',
    time: '11:15',
    status: 'scheduled'
  }
])

// Stats for the dashboard
const stats = ref([
  { title: 'This Week', diagnoses: 27, consultations: 18, reviews: 12 },
  { title: 'This Month', diagnoses: 116, consultations: 94, reviews: 67 },
  { title: 'Total', diagnoses: user.value.diagnoses, patients: user.value.patients }
])

// Logout function
const logout = () => {
  // In a real app, you would clear tokens or session data here
  router.push('/admin') // Redirect to login page
}
</script>

<template>
  <div class="account-page-admin">
    <!-- Main section with gradient background -->
    <div class="relative bg-gradient-to-b from-blue-600 via-indigo-700 to-indigo-900 min-h-screen overflow-hidden">
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
          <div class="inline-block px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-400/20 text-blue-100 text-sm mb-4">
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
            <div class="bg-white/95 backdrop-blur-md rounded-xl shadow-lg overflow-hidden transform hover:translate-y-[-5px] transition-all duration-300 mb-6">
              <div class="relative">
                <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90"></div>
                <div class="relative z-10 p-6 text-center">
                  <div class="inline-block bg-white rounded-full p-4 mb-3 shadow-lg">
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
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Experience
                    </div>
                    <div class="detail-value">{{ user.yearsofexperience }} years</div>
                  </div>

                  <div class="detail-row">
                    <div class="detail-label">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      License No.
                    </div>
                    <div class="detail-value font-mono">{{ user.license }}</div>
                  </div>

                  <div class="detail-row">
                    <div class="detail-label">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Date of Birth
                    </div>
                    <div class="detail-value">{{ user.dateofbirth }}</div>
                  </div>

                  <div class="detail-row">
                    <div class="detail-label">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email
                    </div>
                    <div class="detail-value text-blue-600">{{ user.email }}</div>
                  </div>

                  <div class="detail-row">
                    <div class="detail-label">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Hospital
                    </div>
                    <div class="detail-value">{{ user.Hospital }}</div>
                  </div>

                  <div class="detail-row">
                    <div class="detail-label">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Last Login
                    </div>
                    <div class="detail-value">{{ user.lastLogin }}</div>
                  </div>
                </div>

                <!-- Certifications -->
                <div class="mt-6">
                  <h4 class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Certifications
                  </h4>
                  <ul class="space-y-1">
                    <li v-for="(cert, index) in user.certifications" :key="index" class="flex items-center">
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
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>

            <!-- Statistics card -->
            <div class="bg-white/95 backdrop-blur-md rounded-xl shadow-lg overflow-hidden transform hover:translate-y-[-5px] transition-all duration-300">
              <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
                <h3 class="text-xl font-bold text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Statistics
                </h3>
              </div>

              <div class="p-6">
                <div class="space-y-5">
                  <div v-for="(stat, index) in stats" :key="index" class="stat-group">
                    <h4 class="text-sm font-semibold text-gray-600 mb-3">{{ stat.title }}</h4>
                    <div class="grid grid-cols-2 gap-3">
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

          <!-- Right column: Activities and actions -->
          <div class="lg:col-span-2">
            <!-- Recent activities card -->
            <div class="bg-white/95 backdrop-blur-md rounded-xl shadow-lg overflow-hidden mb-6 transform hover:translate-y-[-5px] transition-all duration-300">
              <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
                <h3 class="text-xl font-bold text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  
                  <div class="space-y-4">
                    <div v-for="(activity, index) in recentActivities" :key="index" 
                        class="activity-item">
                      <div class="activity-icon" :class="{
                        'bg-blue-100 text-blue-600': activity.type === 'diagnosis',
                        'bg-green-100 text-green-600': activity.type === 'consultation',
                        'bg-purple-100 text-purple-600': activity.type === 'review'
                      }">
                        <svg v-if="activity.type === 'diagnosis'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <svg v-if="activity.type === 'consultation'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <svg v-if="activity.type === 'review'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div class="flex-grow">
                        <div class="flex justify-between">
                          <h5 class="font-medium text-gray-800">
                            {{ activity.patientName }}
                            <span class="text-sm font-normal text-gray-500">{{ activity.patientId }}</span>
                          </h5>
                          <span class="text-sm text-gray-500">{{ activity.date }}, {{ activity.time }}</span>
                        </div>
                        <p class="text-sm text-gray-600 mt-1">
                          {{ activity.type === 'diagnosis' ? 'Performed diagnosis' : 
                             activity.type === 'consultation' ? 'Patient consultation' : 
                             'Medical record review' }}
                        </p>
                      </div>
                      <div class="ml-2">
                        <span class="status-badge" :class="{
                          'bg-green-100 text-green-800': activity.status === 'completed',
                          'bg-blue-100 text-blue-800': activity.status === 'scheduled'
                        }">
                          {{ activity.status }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick actions card -->
            <div class="bg-white/95 backdrop-blur-md rounded-xl shadow-lg overflow-hidden transform hover:translate-y-[-5px] transition-all duration-300">
              <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
                <h3 class="text-xl font-bold text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Actions
                </h3>
              </div>

              <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Action 1 -->
                  <div class="action-card">
                    <div class="flex items-start">
                      <div class="action-icon bg-indigo-100 text-indigo-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </div>
                      <div class="ml-4">
                        <h4 class="text-gray-800 font-semibold">New Diagnosis</h4>
                        <p class="text-gray-500 text-sm mt-1">Create a new heart diagnosis for a patient</p>
                        <button class="action-btn mt-3">
                          Start Diagnosis
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Action 2 -->
                  <div class="action-card">
                    <div class="flex items-start">
                      <div class="action-icon bg-blue-100 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div class="ml-4">
                        <h4 class="text-gray-800 font-semibold">View Patient Records</h4>
                        <p class="text-gray-500 text-sm mt-1">Access your patients' health history</p>
                        <button class="action-btn mt-3">
                          View Records
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Action 3 -->
                  <div class="action-card">
                    <div class="flex items-start">
                      <div class="action-icon bg-purple-100 text-purple-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div class="ml-4">
                        <h4 class="text-gray-800 font-semibold">Consultation Schedule</h4>
                        <p class="text-gray-500 text-sm mt-1">Manage your upcoming patient consultations</p>
                        <button class="action-btn mt-3">
                          View Schedule
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Action 4 -->
                  <div class="action-card">
                    <div class="flex items-start">
                      <div class="action-icon bg-green-100 text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                        </svg>
                      </div>
                      <div class="ml-4">
                        <h4 class="text-gray-800 font-semibold">Analytics</h4>
                        <p class="text-gray-500 text-sm mt-1">View statistics and diagnosis accuracy</p>
                        <button class="action-btn mt-3">
                          View Analytics
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-6">
                  <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                      <div class="w-full border-t border-gray-300"></div>
                    </div>
                    <div class="relative flex justify-center">
                      <span class="bg-white px-3 text-sm text-gray-500">Medical Resources</span>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <button class="resource-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Heart Disease Guidelines
                    </button>
                    
                    <button class="resource-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10m2 2h-8m8 0l-4-4m4 4l-4 4" />
                      </svg>
                      Download Latest Research
                    </button>
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

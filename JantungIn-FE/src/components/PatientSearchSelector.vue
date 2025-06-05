<template>
  <div>
    <!-- Patient Search Field -->
    <div class="relative">
      <input
        v-model="patientName"
        type="text"
        class="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
        placeholder="Klik untuk mencari pasien..."
        readonly
        @click="openModal"
      />
      <button
        @click="openModal"
        type="button"
        class="absolute right-2 top-2.5 bg-blue-500 p-1 rounded text-white hover:bg-blue-600"
      >
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>

    <!-- Hidden field for patientId -->
    <input type="hidden" v-model="patientId" />

    <!-- Patient Selector Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-medium text-gray-900">Select Patient</h3>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-800">
            <svg
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="mb-4">
          <div class="flex">
            <input
              v-model="searchQuery"
              type="text"
              ref="searchInputRef"
              placeholder="Cari pasien berdasarkan nama atau NIK"
              class="flex-1 border border-gray-300 px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              @keyup.enter="searchPatient"
            />
            <button
              @click="searchPatient"
              class="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
              :disabled="isSearching"
            >
              <svg
                v-if="isSearching"
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span v-else>Cari</span>
            </button>
          </div>
        </div>
        <div class="max-h-64 overflow-y-auto">
          <!-- Loading indicator -->
          <div v-if="initialLoading" class="text-center py-10">
            <svg
              class="animate-spin h-8 w-8 text-blue-500 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p class="mt-2 text-gray-600">Loading patient data...</p>
          </div>

          <!-- Recent patients -->
          <div v-else-if="recentPatients.length > 0 && patients.length === 0" class="mb-4">
            <h4 class="text-sm font-medium text-gray-700 px-3 py-2 bg-gray-100">Pasien Terakhir</h4>
            <div
              v-for="patient in recentPatients"
              :key="patient.id"
              @click="selectPatient(patient)"
              class="border-b border-gray-200 last:border-0 p-3 hover:bg-blue-50 cursor-pointer"
            >
              <div class="font-medium text-gray-900">{{ patient.name }}</div>
              <div class="text-sm text-gray-500 flex justify-between">
                <span>ID: {{ patient.id }}</span>
              </div>
            </div>
          </div>

          <!-- Search results -->
          <div
            v-else-if="patients.length === 0 && !recentPatients.length && !initialLoading"
            class="text-center py-4 text-gray-500"
          >
            No patients found. Try a different search term.
          </div>
          <div v-else-if="patients.length > 0">
            <h4 class="text-sm font-medium text-gray-700 px-3 py-2 bg-gray-100">
              Hasil Pencarian ({{ patients.length }} pasien)
            </h4>
            <div
              v-for="patient in patients"
              :key="patient.id"
              @click="selectPatient(patient)"
              class="border-b border-gray-200 last:border-0 p-3 hover:bg-blue-50 cursor-pointer"
            >
              <div class="font-medium text-gray-900">{{ patient.name }}</div>
              <div class="text-sm text-gray-500">ID: {{ patient.id }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import patientService from '@/services/PatientService'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ id: '', name: '' }),
  },
})

const emit = defineEmits(['update:modelValue'])

// Local state
const patientId = ref(props.modelValue.id || '')
const patientName = ref(props.modelValue.name || '')
const searchQuery = ref('')
const showModal = ref(false)
const isSearching = ref(false)
const initialLoading = ref(false)
const patients = ref([])
const recentPatients = ref([])

// Watch for external changes
watch(
  () => props.modelValue,
  (newValue) => {
    patientId.value = newValue.id || ''
    patientName.value = newValue.name || ''
  },
  { deep: true },
)

// Watch for internal changes and emit update
watch(
  [patientId, patientName],
  () => {
    emit('update:modelValue', {
      id: patientId.value,
      name: patientName.value,
    })
  },
  { deep: true },
)

// Methods
const openModal = () => {
  showModal.value = true
  // Reset search when opening modal
  searchQuery.value = ''
  patients.value = []
  initialLoading.value = true

  // Load recent patients
  loadRecentPatients()

  // Initial loading of popular/recent patients
  setTimeout(() => {
    initialLoading.value = false
  }, 500)

  // Focus on search input after modal opens
  setTimeout(() => {
    if (document.querySelector('input[ref="searchInputRef"]')) {
      document.querySelector('input[ref="searchInputRef"]').focus()
    }
  }, 100)
}

const loadRecentPatients = () => {
  try {
    const recentPatientsJson = localStorage.getItem('jantungin_recent_patients')
    if (recentPatientsJson) {
      recentPatients.value = JSON.parse(recentPatientsJson)
    } else {
      recentPatients.value = []
    }
  } catch (error) {
    console.error('Error loading recent patients:', error)
    recentPatients.value = []
  }
}

const closeModal = () => {
  showModal.value = false
}

const searchPatient = async () => {
  if (!searchQuery.value) return

  // Validate search query length
  if (searchQuery.value.trim().length < 3) {
    alert('Mohon masukkan minimal 3 karakter untuk pencarian')
    return
  }

  try {
    isSearching.value = true
    console.log('Searching for patients with query:', searchQuery.value)

    // First try to search in cached patients for faster response
    const cachedResults = patientService.searchCachedPatients(searchQuery.value)
    if (cachedResults.length > 0) {
      console.log('Found patients in cache:', cachedResults.length)
      patients.value = cachedResults
      isSearching.value = false
      return
    }

    // If no cached results, search from API
    const results = await patientService.searchPatients(searchQuery.value)

    // Check if we received a valid response
    if (results && Array.isArray(results)) {
      console.log('Patient search results from API:', results.length)

      // Update the patients list
      patients.value = results

      // Cache the results for future searches
      if (results.length > 0) {
        patientService.cachePatients(results)
      }
    } else {
      console.warn('Invalid search results format:', results)
      patients.value = []

      // Show warning if results are not in expected format
      alert('Format data pasien tidak valid. Silakan coba lagi.')
    }
  } catch (error) {
    console.error('Error searching for patient:', error)

    // Show different error messages based on error type
    if (error.isNetworkError) {
      alert('Tidak dapat terhubung ke server. Menggunakan data cache jika tersedia.')

      // Try to search in cached patients as fallback
      const cachedResults = patientService.searchCachedPatients(searchQuery.value)
      if (cachedResults.length > 0) {
        console.log('Using cached results due to network error:', cachedResults.length)
        patients.value = cachedResults
      }
    } else if (error.status === 401 || error.status === 403) {
      alert('Sesi Anda telah berakhir atau tidak memiliki akses. Silakan login kembali.')
    } else {
      alert('Terjadi kesalahan saat mencari pasien. Silakan coba lagi.')
    }

    // Clear patients if there was an error and no cached results
    if (patients.value.length === 0) {
      patients.value = []
    }
  } finally {
    isSearching.value = false
  }
}

const selectPatient = (patient) => {
  patientId.value = patient.id
  patientName.value = patient.name

  // Save to recent patients
  saveToRecentPatients(patient)

  closeModal()
}

const saveToRecentPatients = (patient) => {
  try {
    // Get existing recent patients
    let recentList = []
    const recentJson = localStorage.getItem('jantungin_recent_patients')

    if (recentJson) {
      recentList = JSON.parse(recentJson)
    }

    // Check if patient already exists in the list
    const existingIndex = recentList.findIndex((p) => p.id === patient.id)

    // Remove if exists
    if (existingIndex >= 0) {
      recentList.splice(existingIndex, 1)
    }

    // Add to beginning of list
    recentList.unshift({
      id: patient.id,
      name: patient.name,
      timestamp: new Date().toISOString(),
    })

    // Keep only the most recent 10
    if (recentList.length > 10) {
      recentList = recentList.slice(0, 10)
    }

    // Save back to localStorage
    localStorage.setItem('jantungin_recent_patients', JSON.stringify(recentList))
  } catch (error) {
    console.error('Error saving recent patient:', error)
  }
}
</script>

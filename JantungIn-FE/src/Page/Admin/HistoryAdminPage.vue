<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import FooterComponent from '@/components/Footer-component.vue'
import LazyBackground from '@/components/LazyBackground.vue'
import LazyImage from '@/components/LazyImage.vue'
import ImagePreloader from '@/components/ImagePreloader.vue'

defineOptions({
  name: 'HistoryPageAdmin',
})

const router = useRouter()

// State for patients and their diagnoses
const patientDiagnoses = ref({})
const isLoading = ref(true)
const selectedNik = ref(null)
const selectedDiagnosis = ref(null)
const searchQuery = ref('') // New state for search functionality

// Send to Patient functionality
const showSendDialog = ref(false)
const sendPatientNik = ref('')
const sendPatientName = ref('')
const sendNikError = ref('')
const sendNameError = ref('')
const isSending = ref(false)

// Load saved diagnoses from localStorage
onMounted(() => {
  setTimeout(() => {
    try {
      const savedData = localStorage.getItem('savedDiagnoses')
      if (savedData) {
        patientDiagnoses.value = JSON.parse(savedData)
      }
    } catch (error) {
      console.error('Error loading saved diagnoses:', error)
    } finally {
      isLoading.value = false
    }
  }, 500) // Simulate loading
})

// Format functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getStatusClass = (percentage) => {
  const numPercentage = parseFloat(percentage)
  if (numPercentage < 20) return 'bg-green-500'
  if (numPercentage < 50) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getStatusText = (percentage) => {
  const numPercentage = parseFloat(percentage)
  if (numPercentage < 20) return 'LOW RISK'
  if (numPercentage < 50) return 'MEDIUM RISK'
  return 'HIGH RISK'
}

// Patient list computed property with search filter
const patientList = computed(() => {
  const list = Object.keys(patientDiagnoses.value).map((nik) => {
    const diagnoses = patientDiagnoses.value[nik]
    const latestDiagnosis = diagnoses[diagnoses.length - 1]

    return {
      nik,
      patientName: latestDiagnosis.patientName,
      diagnosesCount: diagnoses.length,
      latestDate: new Date(latestDiagnosis.savedAt),
      latestResult: latestDiagnosis.resultPercentage,
    }
  })

  // Apply search filter if search query exists
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    return list.filter(
      (patient) =>
        patient.patientName.toLowerCase().includes(query) ||
        patient.nik.toLowerCase().includes(query),
    )
  }

  return list.sort((a, b) => b.latestDate - a.latestDate) // Sort by date descending
})

// Clear search
const clearSearch = () => {
  searchQuery.value = ''
}

// Handle folder click
const openPatientFolder = (nik) => {
  selectedNik.value = nik
  selectedDiagnosis.value = null
}

// Handle diagnosis click
const viewDiagnosis = (diagnosis) => {
  selectedDiagnosis.value = diagnosis
}

// Close selected diagnosis view
const closeDiagnosisView = () => {
  selectedDiagnosis.value = null
}

// Handle sending to patient
const openSendDialog = (nik, name) => {
  sendPatientNik.value = nik
  sendPatientName.value = name
  sendNikError.value = ''
  sendNameError.value = ''
  showSendDialog.value = true
}

// Validate and send to patient
const sendToPatient = () => {
  // Reset errors
  sendNikError.value = ''
  sendNameError.value = ''

  // Basic validation
  let isValid = true
  if (!sendPatientNik.value) {
    sendNikError.value = 'Patient identifier is required'
    isValid = false
  }
  if (!sendPatientName.value) {
    sendNameError.value = 'Patient name is required'
    isValid = false
  }

  if (isValid) {
    isSending.value = true

    // Simulate sending
    setTimeout(() => {
      isSending.value = false
      showSendDialog.value = false

      // Show success toast or notification
      alert(`Successfully shared with ${sendPatientName.value}`)
    }, 1500)
  }
}

// Delete patient record
const deletePatientRecord = (nik) => {
  if (
    confirm('Are you sure you want to delete this patient record? This action cannot be undone.')
  ) {
    try {
      if (patientDiagnoses.value[nik]) {
        delete patientDiagnoses.value[nik]

        // Update localStorage
        localStorage.setItem('savedDiagnoses', JSON.stringify(patientDiagnoses.value))

        if (selectedNik.value === nik) {
          selectedNik.value = null
          selectedDiagnosis.value = null
        }
      }
    } catch (error) {
      console.error('Error deleting patient record:', error)
    }
  }
}
</script>

<template>
  <div class="history-page mt-10">
    <!-- Preload critical images -->
    <ImagePreloader :images="[
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1504813184591-01572f98c85f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      '/images/hostipal.jpg',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      '/images/ike.jpg'
    ]" />
    
    <!-- Added mt-16 for navbar spacing -->
    <!-- Hero Banner with Medical Background -->
    <section class="relative">
      <LazyBackground
        class="absolute inset-0"
        src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        placeholder="/images/loading-placeholder.svg"
        :style="{ filter: 'brightness(0.4)' }"
      />
      <div class="relative z-10 py-20 px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Patient Diagnosis History</h1>
        <p class="text-xl text-blue-100 max-w-3xl mx-auto">
          View and manage patient cardiovascular health records
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <div class="bg-gradient-to-b from-blue-700 to-indigo-900 py-10 px-4 min-h-screen">
      <div class="max-w-7xl mx-auto">
        <!-- Search and Actions Bar -->
        <div
          class="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div class="relative w-full md:w-100">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search patients by name or ID..."
              class="w-full px-4 py-3 pl-10 rounded-lg bg-white/20 text-white border border-white/30 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-white/70 absolute left-3 top-3.5"
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
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-3 top-3.5 text-white/70 hover:text-white"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div v-if="isLoading" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        </div>
        <div v-else-if="Object.keys(patientDiagnoses).length === 0" class="text-center py-20">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto">
            <h2 class="text-2xl font-bold text-white mb-2">No Patient Records</h2>
            <div class="flex flex-col items-center text-center">
              <div class="bg-blue-50 rounded-full p-5 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-16 w-16 text-blue-500"
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
            </div>
            <p class="text-white/80 mb-6">
              There are no patient diagnosis records in the system yet. Create a new diagnosis to
              start building your patient database.
            </p>
            <button
              @click="router.push('/diagnose-admin')"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all"
            >
              Start New Diagnosis
            </button>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Left Column: Patient List -->
          <div class="bg-white/10 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
            <div class="p-4 border-b border-white/20">
              <h2 class="text-xl font-semibold text-white">
                Patients
                <span v-if="patientList.length" class="text-sm font-normal text-white/60 ml-2"
                  >({{ patientList.length }})</span
                >
              </h2>
            </div>

            <div class="max-h-[70vh] overflow-y-auto">
              <div v-if="patientList.length === 0" class="p-6 text-center text-white/70">
                No matching patients found.
              </div>

              <div
                v-for="patient in patientList"
                :key="patient.nik"
                @click="openPatientFolder(patient.nik)"
                :class="`p-4 border-b border-white/10 cursor-pointer transition-colors hover:bg-white/5 ${selectedNik === patient.nik ? 'bg-white/20' : ''}`"
              >
                <div class="flex justify-between items-start mb-1">
                  <h3 class="text-lg font-medium text-white">{{ patient.patientName }}</h3>
                  <div
                    :class="`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(patient.latestResult)}`"
                  >
                    {{ getStatusText(patient.latestResult) }}
                  </div>
                </div>
                <div class="text-sm text-white/70 mb-1">ID: {{ patient.nik }}</div>
                <div class="flex justify-between items-center text-xs mt-2">
                  <div class="text-white/60">
                    {{ formatDate(patient.latestDate) }}
                  </div>
                  <div class="text-white/60">
                    {{ patient.diagnosesCount }}
                    {{ patient.diagnosesCount > 1 ? 'records' : 'record' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Middle Column: Patient Records -->
          <div
            v-if="selectedNik"
            class="bg-white/10 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden"
          >
            <div class="p-4 border-b border-white/20 flex justify-between items-center">
              <h2 class="text-xl font-semibold text-white">
                {{ patientDiagnoses[selectedNik][0].patientName }}'s Records
              </h2>
              <div class="flex gap-2">
                <button
                  @click="openSendDialog(selectedNik, patientDiagnoses[selectedNik][0].patientName)"
                  class="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
                  title="Share with patient"
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
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                </button>
                <button
                  @click="deletePatientRecord(selectedNik)"
                  class="p-2 text-red-400 hover:text-red-300 hover:bg-white/10 rounded-lg"
                  title="Delete patient record"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div class="max-h-[70vh] overflow-y-auto">
              <div
                v-for="(diagnosis, index) in patientDiagnoses[selectedNik]"
                :key="`${selectedNik}-${index}`"
                @click="viewDiagnosis(diagnosis)"
                :class="`p-4 border-b border-white/10 cursor-pointer transition-colors hover:bg-white/5
                  ${selectedDiagnosis === diagnosis ? 'bg-white/20' : ''}`"
              >
                <div class="flex justify-between items-center mb-2">
                  <div class="text-sm text-white/70">
                    {{ formatDate(diagnosis.savedAt) }}
                  </div>
                  <div
                    :class="`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(diagnosis.resultPercentage)}`"
                  >
                    {{ getStatusText(diagnosis.resultPercentage) }}
                  </div>
                </div>

                <div class="flex items-center justify-between mt-2">
                  <div class="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-white/60 mr-2"
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
                    <span class="text-white">Risk: {{ diagnosis.resultPercentage }}%</span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-white/60"
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
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Selected Diagnosis Details -->
          <div
            v-if="selectedDiagnosis"
            class="bg-white/10 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden"
          >
            <div class="p-4 border-b border-white/20 flex justify-between items-center">
              <h2 class="text-xl font-semibold text-white">Diagnosis Details</h2>
              <button @click="closeDiagnosisView" class="text-white/70 hover:text-white">
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
              </button>
            </div>

            <div class="p-5">
              <!-- Risk Indicator -->
              <div class="mb-6 flex flex-col items-center">
                <div
                  :class="`h-24 w-24 rounded-full flex items-center justify-center text-2xl font-bold text-white
                  ${getStatusClass(selectedDiagnosis.resultPercentage)}`"
                >
                  {{ selectedDiagnosis.resultPercentage }}%
                </div>
                <div class="mt-2 text-center">
                  <h3 class="text-lg font-semibold text-white">
                    {{ getStatusText(selectedDiagnosis.resultPercentage) }}
                  </h3>
                  <p class="text-white/70 text-sm">
                    Diagnosis Date: {{ formatDate(selectedDiagnosis.savedAt) }}
                  </p>
                </div>
              </div>

              <!-- Patient Information Section -->
              <div class="mb-6">
                <h3
                  class="text-white text-sm font-medium uppercase tracking-wider mb-3 border-b border-white/20 pb-2"
                >
                  Patient Information
                </h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-white/70 text-sm">Name</p>
                    <p class="text-white">{{ selectedDiagnosis.patientName }}</p>
                  </div>
                  <div>
                    <p class="text-white/70 text-sm">Age</p>
                    <p class="text-white">{{ selectedDiagnosis.age }} years</p>
                  </div>
                  <div>
                    <p class="text-white/70 text-sm">Sex</p>
                    <p class="text-white">{{ selectedDiagnosis.sex }}</p>
                  </div>
                </div>
              </div>

              <!-- Clinical Data Section -->
              <div class="mb-6">
                <h3
                  class="text-white text-sm font-medium uppercase tracking-wider mb-3 border-b border-white/20 pb-2"
                >
                  Clinical Assessment
                </h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-white/70 text-sm">Chest Pain Type</p>
                    <p class="text-white">{{ selectedDiagnosis.chestPainType }}</p>
                  </div>
                  <div>
                    <p class="text-white/70 text-sm">Resting BP</p>
                    <p class="text-white">{{ selectedDiagnosis.restingBloodPressure }} mm Hg</p>
                  </div>
                  <div>
                    <p class="text-white/70 text-sm">Cholesterol</p>
                    <p class="text-white">{{ selectedDiagnosis.serumCholesterol }} mg/dl</p>
                  </div>
                  <div>
                    <p class="text-white/70 text-sm">Blood Sugar</p>
                    <p class="text-white">{{ selectedDiagnosis.fastingBloodSugar }}</p>
                  </div>
                  <div>
                    <p class="text-white/70 text-sm">ECG Results</p>
                    <p class="text-white">{{ selectedDiagnosis.restingEcgResults }}</p>
                  </div>
                  <div>
                    <p class="text-white/70 text-sm">Max Heart Rate</p>
                    <p class="text-white">{{ selectedDiagnosis.maxHeartRate }} bpm</p>
                  </div>
                </div>
              </div>

              <!-- Additional Data Section -->
              <div>
                <h3
                  class="text-white text-sm font-medium uppercase tracking-wider mb-3 border-b border-white/20 pb-2"
                >
                  Additional Data
                </h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-white/70 text-sm">Exercise Angina</p>
                    <p class="text-white">{{ selectedDiagnosis.exerciseInducedAngina }}</p>
                  </div>
                  <div>
                    <p class="text-white/70 text-sm">ST Depression</p>
                    <p class="text-white">{{ selectedDiagnosis.stDepression }}</p>
                  </div>
                  <div>
                    <p class="text-white/70 text-sm">ST Slope</p>
                    <p class="text-white">{{ selectedDiagnosis.stSlope }}</p>
                  </div>
                  <div>
                    <p class="text-white/70 text-sm">Major Vessels</p>
                    <p class="text-white">{{ selectedDiagnosis.numberOfMajorVessels }}</p>
                  </div>
                  <div>
                    <p class="text-white/70 text-sm">Thalassemia</p>
                    <p class="text-white">{{ selectedDiagnosis.thalassemia }}</p>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="mt-8 flex justify-between">
                <button
                  @click="router.push('/result-admin')"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all flex items-center"
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
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  View Full Report
                </button>
                <button
                  @click="openSendDialog(selectedNik, selectedDiagnosis.patientName)"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all flex items-center"
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
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  Send to Patient
                </button>
              </div>
            </div>
          </div>

          <!-- Middle Column (No Selection) -->
          <div
            v-if="!selectedNik && Object.keys(patientDiagnoses).length > 0"
            class="md:col-span-2"
          >
            <div
              class="bg-white/10 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden h-full flex items-center justify-center p-10"
            >
              <div class="text-center max-w-lg">
                <img
                  src="https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Select patient"
                  class="w-32 h-32 object-cover rounded-full mx-auto mb-6"
                />
                <h2 class="text-2xl font-bold text-white mb-2">Select a Patient</h2>
                <p class="text-white/80 mb-6">
                  Select a patient from the list on the left to view their diagnosis history and
                  details.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Share with Patient Modal -->
        <div
          v-if="showSendDialog"
          class="fixed inset-0 flex items-center justify-center z-50 bg-black/70"
        >
          <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-gray-800">Share with Patient</h2>
              <button @click="showSendDialog = false" class="text-gray-500 hover:text-gray-700">
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
              <label class="block text-gray-700 text-sm font-medium mb-2" for="sendPatientNik">
                Patient ID/NIK
              </label>
              <input
                id="sendPatientNik"
                v-model="sendPatientNik"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter patient ID"
                :disabled="isSending"
              />
              <p v-if="sendNikError" class="text-red-500 text-xs mt-1">{{ sendNikError }}</p>
            </div>

            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-medium mb-2" for="sendPatientName">
                Patient Name
              </label>
              <input
                id="sendPatientName"
                v-model="sendPatientName"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter patient name"
                :disabled="isSending"
              />
              <p v-if="sendNameError" class="text-red-500 text-xs mt-1">{{ sendNameError }}</p>
            </div>

            <div class="flex justify-end gap-3">
              <button
                @click="showSendDialog = false"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                :disabled="isSending"
              >
                Cancel
              </button>
              <button
                @click="sendToPatient"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                :disabled="isSending"
              >
                <svg
                  v-if="isSending"
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                <span>{{ isSending ? 'Sending...' : 'Share' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Medical Images Section -->
        <div class="mt-16 grid grid-cols-1 md:grid-cols-4 gap-4">
          <LazyImage
            src="https://images.unsplash.com/photo-1504813184591-01572f98c85f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            alt="Hospital corridor"
            class="rounded-lg shadow-lg w-full h-40 object-cover"
            loadingClass="animate-pulse bg-blue-200"
            placeholder="/images/loading-placeholder.svg"
            errorPlaceholder="/images/error-placeholder.svg"
          />
          <LazyImage
            src="/images/hostipal.jpg"
            alt="Hospital"
            class="rounded-lg shadow-lg w-full h-40 object-cover"
            loadingClass="animate-pulse bg-blue-200"
            placeholder="/images/loading-placeholder.svg"
            errorPlaceholder="/images/error-placeholder.svg"
          />
          <LazyImage
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            alt="Medical equipment"
            class="rounded-lg shadow-lg w-full h-40 object-cover"
            loadingClass="animate-pulse bg-blue-200"
            placeholder="/images/loading-placeholder.svg"
            errorPlaceholder="/images/error-placeholder.svg"
          />
          <LazyImage
            src="/images/ike.jpg"
            alt="Hospital staff"
            class="rounded-lg shadow-lg w-full h-40 object-cover"
            loadingClass="animate-pulse bg-blue-200"
            placeholder="/images/loading-placeholder.svg"
            errorPlaceholder="/images/error-placeholder.svg"
          />
        </div>
      </div>
    </div>

    <FooterComponent />
  </div>
</template>

<style scoped>
/* Custom animations and styles */
.history-page {
  min-height: 100vh;
  padding-top: 1rem; /* Additional padding to ensure content isn't hidden */
}

/* Animated elements */
@keyframes pulse {
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s infinite ease-in-out;
}

/* Line clamp for truncating text */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Dropdown styling to ensure visible text */
select option {
  background-color: #fff;
  color: #333;
}

/* Print styles */
@media print {
  .bg-gradient-to-b,
  .bg-white\/10,
  .backdrop-blur-sm,
  .bg-cover,
  .relative {
    background: white !important;
    color: black !important;
    filter: none !important;
  }

  .text-white,
  .text-white\/70,
  .text-white\/80,
  .text-blue-100 {
    color: #111 !important;
  }

  button,
  .fixed,
  section.relative,
  [class*='hover:'] {
    display: none !important;
  }

  .max-h-\[70vh\] {
    max-height: none !important;
  }

  .shadow-xl {
    box-shadow: none !important;
    border: 1px solid #ddd !important;
  }
}
</style>

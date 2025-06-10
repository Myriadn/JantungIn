<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import FooterComponent from '@/components/Footer-component.vue'
import LazyBackground from '@/components/LazyBackground.vue'
import LazyImage from '@/components/LazyImage.vue'
import ImagePreloader from '@/components/ImagePreloader.vue'
import diagnosisService from '@/services/DiagnosisService'
import patientService from '@/services/PatientService'

defineOptions({
  name: 'HistoryPageAdmin',
})

const router = useRouter()

// State for patients and their diagnoses
const allDiagnoses = ref([])
const patientDiagnoses = ref({})
const isLoading = ref(true)
const errorMessage = ref(null)
const selectedNik = ref(null)
const selectedDiagnosis = ref(null)
const searchQuery = ref('') // State for search functionality

// Send to Patient functionality
const showSendDialog = ref(false)
const sendPatientNik = ref('')
const sendPatientName = ref('')
const sendNikError = ref('')
const sendNameError = ref('')
const isSending = ref(false)

// Load diagnoses from API
onMounted(async () => {
  try {
    isLoading.value = true
    errorMessage.value = null

    // Fetch all diagnoses from admin API
    console.log('Fetching all diagnoses from API')
    const diagnoses = await diagnosisService.getAllDiagnoses()

    if (!diagnoses || diagnoses.length === 0) {
      console.warn('No diagnoses found or empty response from API')
      isLoading.value = false
      return
    }

    // Store all diagnoses for reference
    allDiagnoses.value = diagnoses
    console.log(`Retrieved ${diagnoses.length} diagnoses from API`)

    // Group diagnoses by patient ID
    const groupedDiagnoses = {}

    // Process each diagnosis
    for (const diagnosis of diagnoses) {
      const patientId = diagnosis.userId || diagnosis.patientId
      if (!patientId) continue

      if (!groupedDiagnoses[patientId]) {
        groupedDiagnoses[patientId] = []

        // Try to get patient info if not already available
        try {
          const patientInfo = await patientService.getPatientById(patientId)
          if (patientInfo) {
            // Enrich diagnosis with patient info
            diagnosis.patientName = patientInfo.name
            diagnosis.patientNik = patientInfo.nik
          }
        } catch (patientError) {
          console.error(`Error fetching info for patient ${patientId}:`, patientError)
          // Continue even if patient info fetch fails
        }
      }

      // Add to grouped diagnoses
      groupedDiagnoses[patientId].push(diagnosis)
    }

    // Update the reactive reference
    patientDiagnoses.value = groupedDiagnoses
    console.log('Grouped diagnoses by patient:', Object.keys(groupedDiagnoses).length)
  } catch (error) {
    console.error('Error loading diagnoses from API:', error)
    errorMessage.value = 'Gagal memuat data diagnosis. Silakan coba lagi.'
  } finally {
    isLoading.value = false
  }
})

// Format functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'

  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

const getStatusClass = (percentage) => {
  const numPercentage = parseFloat(percentage)
  if (numPercentage < 50) return 'bg-green-500'
  return 'bg-red-500'
}

const getStatusText = (percentage) => {
  const numPercentage = parseFloat(percentage)
  if (numPercentage < 50) return 'RISIKO RENDAH'
  return 'RISIKO TINGGI'
}

// Patient list computed property with search filter
const patientList = computed(() => {
  const patientIds = Object.keys(patientDiagnoses.value)

  if (patientIds.length === 0) {
    return []
  }

  const list = patientIds
    .map((patientId) => {
      const diagnoses = patientDiagnoses.value[patientId]
      if (!diagnoses || diagnoses.length === 0) return null

      // Get the latest diagnosis for this patient
      const latestDiagnosis = [...diagnoses].sort(
        (a, b) =>
          new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0),
      )[0]

      // If no valid diagnosis is found, skip this patient
      if (!latestDiagnosis) return null

      return {
        id: patientId,
        nik: latestDiagnosis.patientNik || patientId,
        patientName: latestDiagnosis.patientName || 'Pasien Tidak Diketahui',
        diagnosesCount: diagnoses.length,
        latestDate: new Date(latestDiagnosis.createdAt || latestDiagnosis.updatedAt || Date.now()),
        latestResult: latestDiagnosis.resultPercentage || 0,
        latestDiagnosis,
      }
    })
    .filter(Boolean) // Remove null entries

  // Apply search filter if search query exists
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    return list.filter(
      (patient) =>
        patient.patientName.toLowerCase().includes(query) ||
        patient.nik.toString().toLowerCase().includes(query),
    )
  }

  return list.sort((a, b) => b.latestDate - a.latestDate) // Sort by date descending
})

// Clear search
const clearSearch = () => {
  searchQuery.value = ''
}

// Handle folder click to view patient diagnoses
const openPatientFolder = (patientId) => {
  selectedNik.value = patientId
  selectedDiagnosis.value = null
}

// Handle diagnosis click to view details
const viewDiagnosis = (diagnosis) => {
  selectedDiagnosis.value = diagnosis
}

// View detailed diagnosis report
const viewDetailedReport = (diagnosisId) => {
  if (!diagnosisId) {
    console.error('No diagnosis ID provided for detailed report')
    return
  }

  // Navigate to result page with diagnosis ID as query parameter
  router.push({
    path: '/result-admin',
    query: { id: diagnosisId },
  })
}

// Close selected diagnosis view
const closeDiagnosisView = () => {
  selectedDiagnosis.value = null
}

// Reload diagnoses from API
const reloadDiagnoses = async () => {
  try {
    isLoading.value = true
    errorMessage.value = null

    // Fetch all diagnoses from admin API
    console.log('Reloading all diagnoses from API')
    const diagnoses = await diagnosisService.getAllDiagnoses()

    if (!diagnoses || diagnoses.length === 0) {
      console.warn('No diagnoses found or empty response from API')
      patientDiagnoses.value = {}
      isLoading.value = false
      return
    }

    // Store all diagnoses for reference
    allDiagnoses.value = diagnoses

    // Group diagnoses by patient ID
    const groupedDiagnoses = {}

    // Process each diagnosis
    for (const diagnosis of diagnoses) {
      const patientId = diagnosis.userId || diagnosis.patientId
      if (!patientId) continue

      if (!groupedDiagnoses[patientId]) {
        groupedDiagnoses[patientId] = []

        // Try to get patient info if not already available
        try {
          const patientInfo = await patientService.getPatientById(patientId)
          if (patientInfo) {
            diagnosis.patientName = patientInfo.name
            diagnosis.patientNik = patientInfo.nik
          }
        } catch (patientError) {
          console.error(`Error fetching info for patient ${patientId}:`, patientError)
        }
      }

      groupedDiagnoses[patientId].push(diagnosis)
    }

    patientDiagnoses.value = groupedDiagnoses
  } catch (error) {
    console.error('Error reloading diagnoses from API:', error)
    errorMessage.value = 'Gagal memuat data diagnosis. Silakan coba lagi.'
  } finally {
    isLoading.value = false
  }
}

// Handle sending to patient
const openSendDialog = (patientId, name) => {
  // Cari diagnosis untuk pasien ini
  const patientDiagnosisList = patientDiagnoses.value[patientId] || []

  if (patientDiagnosisList.length > 0) {
    const latestDiagnosis = patientDiagnosisList[0]
    sendPatientNik.value = latestDiagnosis.patientNik || ''
    sendPatientName.value = name || latestDiagnosis.patientName || ''
  } else {
    sendPatientNik.value = ''
    sendPatientName.value = name || ''
  }

  sendNikError.value = ''
  sendNameError.value = ''
  showSendDialog.value = true
}

// Validate and send to patient
const sendToPatient = async () => {
  // Reset errors
  sendNikError.value = ''
  sendNameError.value = ''

  // Basic validation
  let isValid = true
  if (!sendPatientNik.value) {
    sendNikError.value = 'NIK pasien diperlukan'
    isValid = false
  }
  if (!sendPatientName.value) {
    sendNameError.value = 'Nama pasien diperlukan'
    isValid = false
  }

  if (isValid) {
    isSending.value = true

    try {
      // Prepare data for sending
      // This would typically call an API endpoint to send the diagnosis to the patient
      // For example: await apiService.post('/api/v1/diagnosis/share', { ... })

      // For now, we'll simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      isSending.value = false
      showSendDialog.value = false

      // Show success message
      alert(`Hasil diagnosis berhasil dibagikan ke ${sendPatientName.value}`)
    } catch (error) {
      console.error('Error sending diagnosis to patient:', error)
      alert('Gagal mengirim diagnosis ke pasien. Silakan coba lagi.')
      isSending.value = false
    }
  }
}

// Delete patient record (for future API implementation)
const deletePatientRecord = async (patientId) => {
  if (
    confirm(
      'Apakah Anda yakin ingin menghapus rekam medis pasien ini? Tindakan ini tidak dapat dibatalkan.',
    )
  ) {
    try {
      isLoading.value = true

      // In a real implementation, you would call an API to delete the patient record:
      // await apiService.delete(`/api/v1/admin/patient/${patientId}`)

      // For now, we'll just remove from our local state
      if (patientDiagnoses.value[patientId]) {
        const newPatientDiagnoses = { ...patientDiagnoses.value }
        delete newPatientDiagnoses[patientId]
        patientDiagnoses.value = newPatientDiagnoses

        if (selectedNik.value === patientId) {
          selectedNik.value = null
          selectedDiagnosis.value = null
        }

        // Reload diagnoses to ensure data is in sync
        await reloadDiagnoses()
      }
    } catch (error) {
      console.error('Error deleting patient record:', error)
      alert('Gagal menghapus rekam medis pasien. Silakan coba lagi.')
    } finally {
      isLoading.value = false
    }
  }
}
</script>

<template>
  <div class="history-page mt-10">
    <!-- Preload critical images -->
    <ImagePreloader
      :images="[
        'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1504813184591-01572f98c85f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        '/images/hostipal.jpg',
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        '/images/ike.jpg',
      ]"
    />

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
              placeholder="Cari pasien berdasarkan nama atau NIK..."
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

          <!-- Reload Button -->
          <button
            @click="reloadDiagnoses"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            :disabled="isLoading"
          >
            <svg
              v-if="isLoading"
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
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>{{ isLoading ? 'Memuat...' : 'Muat Ulang' }}</span>
          </button>
        </div>
        <div v-if="isLoading" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        </div>
        <div v-else-if="errorMessage" class="text-center py-20">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto">
            <h2 class="text-2xl font-bold text-white mb-2">Terjadi Kesalahan</h2>
            <p class="text-white/80 mb-6">{{ errorMessage }}</p>
            <button
              @click="reloadDiagnoses"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all"
            >
              Coba Lagi
            </button>
          </div>
        </div>
        <div v-else-if="Object.keys(patientDiagnoses).length === 0" class="text-center py-20">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto">
            <h2 class="text-2xl font-bold text-white mb-2">Tidak Ada Rekam Medis Pasien</h2>
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
              Belum ada rekam diagnosis pasien di sistem. Buat diagnosis baru untuk mulai membangun
              database pasien Anda.
            </p>
            <button
              @click="router.push('/diagnose-admin')"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all"
            >
              Mulai Diagnosis Baru
            </button>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Left Column: Patient List -->
          <div class="bg-white/10 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
            <div class="p-4 border-b border-white/20">
              <h2 class="text-xl font-semibold text-white">
                Pasien
                <span v-if="patientList.length" class="text-sm font-normal text-white/60 ml-2"
                  >({{ patientList.length }})</span
                >
              </h2>
            </div>

            <div class="max-h-[70vh] overflow-y-auto">
              <div v-if="patientList.length === 0" class="p-6 text-center text-white/70">
                Tidak ada pasien yang sesuai dengan pencarian.
              </div>

              <div
                v-for="patient in patientList"
                :key="patient.id"
                @click="openPatientFolder(patient.id)"
                :class="`p-4 border-b border-white/10 cursor-pointer transition-colors hover:bg-white/5 ${selectedNik === patient.id ? 'bg-white/20' : ''}`"
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
                    {{ patient.diagnosesCount > 1 ? 'hasil diagnosa' : 'hasil diagnosa' }}
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
                Riwayat {{ patientDiagnoses[selectedNik][0]?.patientName || 'Pasien' }}
              </h2>
              <div class="flex gap-2">
                <button
                  @click="
                    openSendDialog(selectedNik, patientDiagnoses[selectedNik][0]?.patientName)
                  "
                  class="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
                  title="Bagikan ke pasien"
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
                  title="Hapus riwayat pasien"
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
                    {{ formatDate(diagnosis.createdAt) }}
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
                    <span class="text-white">Risiko: {{ diagnosis.resultPercentage || 0 }}%</span>
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
              <h2 class="text-xl font-semibold text-white">Detail Diagnosis</h2>
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
                  {{ selectedDiagnosis.resultPercentage || 0 }}%
                </div>
                <div class="mt-2 text-center">
                  <h3 class="text-lg font-semibold text-white">
                    {{ getStatusText(selectedDiagnosis.resultPercentage) }}
                  </h3>
                  <p class="text-white/70 text-sm">
                    Tanggal Diagnosis: {{ formatDate(selectedDiagnosis.createdAt) }}
                  </p>
                </div>
              </div>

              <!-- Patient Information Section -->
              <div class="mb-6">
                <h3
                  class="text-white text-sm font-medium uppercase tracking-wider mb-3 border-b border-white/20 pb-2"
                >
                  Informasi Pasien
                </h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-white/70 text-sm">Nama</p>
                    <p class="text-white">
                      {{ selectedDiagnosis.patientName || 'Tidak diketahui' }}
                    </p>
                  </div>
                  <div>
                    <p class="text-white/70 text-sm">Usia</p>
                    <p class="text-white">{{ selectedDiagnosis.age || 'N/A' }} tahun</p>
                  </div>
                  <div>
                    <p class="text-white/70 text-sm">Jenis Kelamin</p>
                    <p class="text-white">
                      {{
                        selectedDiagnosis.sex === 'Male'
                          ? 'Laki-laki'
                          : selectedDiagnosis.sex === 'Female'
                            ? 'Perempuan'
                            : 'N/A'
                      }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Clinical Data Section -->
              <div class="mb-6">
                <h3
                  class="text-white text-sm font-medium uppercase tracking-wider mb-3 border-b border-white/20 pb-2"
                >
                  Penilaian Klinis
                </h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-white/70 text-sm">Tipe Nyeri Dada</p>
                    <p class="text-white">{{ selectedDiagnosis.chestPainType || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-white/70 text-sm">Tekanan Darah Istirahat</p>
                    <p class="text-white">
                      {{
                        selectedDiagnosis.restingBP ||
                        selectedDiagnosis.restingBloodPressure ||
                        'N/A'
                      }}
                      mm Hg
                    </p>
                  </div>
                  <div>
                    <p class="text-white/70 text-sm">Kolesterol</p>
                    <p class="text-white">
                      {{
                        selectedDiagnosis.serumCholesterol || selectedDiagnosis.cholesterol || 'N/A'
                      }}
                      mg/dl
                    </p>
                  </div>
                  <div>
                    <p class="text-white/70 text-sm">Gula Darah</p>
                    <p class="text-white">{{ selectedDiagnosis.fastingBloodSugar || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-white/70 text-sm">Hasil ECG</p>
                    <p class="text-white">{{ selectedDiagnosis.restingEcgResults || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-white/70 text-sm">Detak Jantung Maksimum</p>
                    <p class="text-white">
                      {{
                        selectedDiagnosis.maxHeartRate ||
                        selectedDiagnosis.maximumHeartRate ||
                        'N/A'
                      }}
                      bpm
                    </p>
                  </div>
                </div>
              </div>

              <!-- Additional Data Section -->
              <div>
                <h3
                  class="text-white text-sm font-medium uppercase tracking-wider mb-3 border-b border-white/20 pb-2"
                >
                  Data Tambahan
                </h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-white/70 text-sm">Angina Akibat Olahraga</p>
                    <p class="text-white">
                      {{
                        selectedDiagnosis.exerciseInducedAngina === 'Yes'
                          ? 'Ya'
                          : selectedDiagnosis.exerciseInducedAngina === 'No'
                            ? 'Tidak'
                            : 'N/A'
                      }}
                    </p>
                  </div>
                  <div>
                    <p class="text-white/70 text-sm">Depresi ST</p>
                    <p class="text-white">{{ selectedDiagnosis.stDepression || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-white/70 text-sm">Kemiringan ST</p>
                    <p class="text-white">
                      {{ selectedDiagnosis.stSegment || selectedDiagnosis.stSlope || 'N/A' }}
                    </p>
                  </div>
                  <div>
                    <p class="text-white/70 text-sm">Pembuluh Utama</p>
                    <p class="text-white">
                      {{
                        selectedDiagnosis.majorVessels ||
                        selectedDiagnosis.numberOfMajorVessels ||
                        'N/A'
                      }}
                    </p>
                  </div>
                  <div>
                    <p class="text-white/70 text-sm">Talasemia</p>
                    <p class="text-white">{{ selectedDiagnosis.thalassemia || 'N/A' }}</p>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="mt-8 flex justify-between">
                <button
                  @click="viewDetailedReport(selectedDiagnosis.id)"
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
                  Lihat Laporan Lengkap
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
                  Kirim ke Pasien
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
                  alt="Pilih pasien"
                  class="w-32 h-32 object-cover rounded-full mx-auto mb-6"
                />
                <h2 class="text-2xl font-bold text-white mb-2">Pilih Pasien</h2>
                <p class="text-white/80 mb-6">
                  Pilih pasien dari daftar di sebelah kiri untuk melihat riwayat dan detail
                  diagnosis mereka.
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
              <h2 class="text-xl font-bold text-gray-800">Bagikan ke Pasien</h2>
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
                NIK Pasien
              </label>
              <input
                id="sendPatientNik"
                v-model="sendPatientNik"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan NIK pasien"
                :disabled="isSending"
              />
              <p v-if="sendNikError" class="text-red-500 text-xs mt-1">{{ sendNikError }}</p>
            </div>

            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-medium mb-2" for="sendPatientName">
                Nama Pasien
              </label>
              <input
                id="sendPatientName"
                v-model="sendPatientName"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan nama pasien"
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
                Batal
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
                <span>{{ isSending ? 'Mengirim...' : 'Bagikan' }}</span>
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

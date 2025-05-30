<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import FooterComponent from '@/components/Footer-component.vue'

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
const openDiagnosis = (diagnosis) => {
  selectedDiagnosis.value = diagnosis
}

// Handle view details button
const viewDiagnosisDetails = (diagnosis) => {
  router.push({
    name: 'resultPage',
    params: {
      patientName: diagnosis.patientName,
      resultPercentage: diagnosis.resultPercentage,
      predictionResult: diagnosis.resultText.toLowerCase(),
    },
  })
}

// Clear selection
const goBack = () => {
  if (selectedDiagnosis.value) {
    selectedDiagnosis.value = null
  } else if (selectedNik.value) {
    selectedNik.value = null
  }
}

// Format risk percentage display
const formatRiskLabel = (percentage) => {
  const numPercentage = parseFloat(percentage)
  if (numPercentage < 20) return 'Low Risk'
  if (numPercentage < 50) return 'Medium Risk'
  return 'High Risk'
}
</script>

<template>
  <div class="history-page">
    <!-- Main section with blue background -->
    <div class="bg-gradient-to-b from-blue-500 via-blue-600 to-indigo-700 min-h-screen">
      <div class="max-w-5xl mx-auto py-8 px-4">
        <!-- Page Title -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-white text-3xl font-bold">
            {{
              selectedNik && !selectedDiagnosis
                ? `Patient: ${patientDiagnoses[selectedNik][0].patientName} (NIK: ${selectedNik})`
                : selectedDiagnosis
                  ? 'Diagnosis Details'
                  : 'Patient Records'
            }}
          </h1>

          <!-- Back button -->
          <button
            v-if="selectedNik || selectedDiagnosis"
            @click="goBack"
            class="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 flex items-center transition-colors"
          >
            <svg
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
        </div>

        <!-- Search Bar Component - Only shown on main patient list -->
        <div v-if="!selectedNik && !selectedDiagnosis" class="mb-6">
          <div class="relative flex items-center">
            <!-- Search Input with icon -->
            <div class="relative flex-grow">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-white"
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
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari berdasarkan nama pasien atau NIK..."
                class="w-full bg-white/20 backdrop-blur-sm py-3 pl-12 pr-10 rounded-xl text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-white hover:text-blue-100"
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

            <!-- Search Button -->
            <button
              @click="searchQuery ? clearSearch() : null"
              class="ml-3 px-6 py-3 bg-white text-blue-600 font-medium rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5"
            >
              <span v-if="searchQuery">Reset</span>
              <span v-else class="flex items-center">
                <svg
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Cari
              </span>
            </button>
          </div>

          <!-- Search Results Indicator -->
          <div v-if="searchQuery" class="mt-3">
            <div
              v-if="patientList.length === 0"
              class="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-12 w-12 mx-auto text-white mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p class="text-white text-lg font-bold">Tidak ada hasil yang ditemukan</p>
              <p class="text-white/80 mt-1">
                Tidak ada pasien yang sesuai dengan pencarian "{{ searchQuery }}"
              </p>
            </div>
            <div
              v-else
              class="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 inline-block text-white"
            >
              <span class="font-medium">{{ patientList.length }}</span> pasien ditemukan untuk
              pencarian "{{ searchQuery }}"
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="bg-white rounded-lg shadow-md p-8 text-center">
          <div class="animate-pulse flex flex-col items-center">
            <div class="rounded-full bg-blue-100 h-14 w-14 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8 text-blue-500"
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
            <p class="text-gray-700 text-lg">Loading patient records...</p>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="Object.keys(patientDiagnoses).length === 0"
          class="bg-white rounded-lg shadow-md p-8 text-center"
        >
          <div class="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m-6-8h6M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
              />
            </svg>
            <h2 class="text-xl font-semibold mb-2">No Records Found</h2>
            <p class="text-gray-600 mb-4">No diagnosis records have been saved yet.</p>
            <router-link
              to="/diagnose-admin"
              class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Start New Diagnosis
            </router-link>
          </div>
        </div>

        <!-- Main Content based on view state -->
        <div v-else>
          <!-- View 1: All Patients List -->
          <div v-if="!selectedNik && !selectedDiagnosis" class="grid grid-cols-1 gap-4">
            <!-- Patients grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div
                v-for="patient in patientList"
                :key="patient.nik"
                @click="openPatientFolder(patient.nik)"
                class="bg-white rounded-lg shadow-md p-4 cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg"
              >
                <div class="flex items-center">
                  <div class="bg-blue-100 p-2 rounded-full mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div class="flex-grow">
                    <div class="font-medium truncate">{{ patient.patientName }}</div>
                    <div class="text-xs text-gray-500">NIK: {{ patient.nik }}</div>
                  </div>
                </div>

                <div class="flex justify-between mt-3">
                  <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {{ patient.diagnosesCount }} Records
                  </span>
                  <span class="text-xs"> Latest: {{ formatDate(patient.latestDate) }} </span>
                </div>

                <div class="mt-3 flex items-center">
                  <div class="flex-grow h-2 bg-gray-200 rounded-full">
                    <div
                      :class="getStatusClass(patient.latestResult)"
                      class="h-2 rounded-full"
                      :style="{ width: `${patient.latestResult}%` }"
                    ></div>
                  </div>
                  <span
                    class="text-xs ml-2 font-medium"
                    :class="{
                      'text-green-600': patient.latestResult < 20,
                      'text-yellow-600': patient.latestResult >= 20 && patient.latestResult < 50,
                      'text-red-600': patient.latestResult >= 50,
                    }"
                    >{{ patient.latestResult }}%</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- View 2: Single Patient Diagnosis List -->
          <div v-else-if="selectedNik && !selectedDiagnosis">
            <div class="bg-white rounded-lg shadow-md p-6 mb-4">
              <div class="flex items-center mb-4">
                <div
                  class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-blue-500"
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
                </div>
                <div>
                  <h2 class="text-xl font-semibold">
                    {{ patientDiagnoses[selectedNik][0].patientName }}
                  </h2>
                  <p class="text-sm text-gray-500">
                    NIK: {{ selectedNik }} • {{ patientDiagnoses[selectedNik].length }} Records
                  </p>
                </div>
              </div>

              <!-- Timeline of diagnosis records -->
              <div class="mt-6">
                <div
                  v-for="(diagnosis, index) in [...patientDiagnoses[selectedNik]].sort(
                    (a, b) => new Date(b.savedAt) - new Date(a.savedAt),
                  )"
                  :key="index"
                  class="mb-4 last:mb-0"
                >
                  <div class="flex items-start border-l-2 border-blue-200 pl-4 pb-6 relative">
                    <!-- Timeline dot -->
                    <div
                      :class="getStatusClass(diagnosis.resultPercentage)"
                      class="absolute -left-[9px] h-4 w-4 rounded-full"
                    ></div>

                    <!-- Diagnosis card -->
                    <div
                      @click="openDiagnosis(diagnosis)"
                      class="bg-gray-50 rounded-lg p-4 w-full cursor-pointer hover:bg-blue-50 transition-colors"
                    >
                      <div class="flex justify-between items-center">
                        <div class="text-sm text-gray-500">{{ formatDate(diagnosis.savedAt) }}</div>
                        <div
                          :class="{
                            'bg-green-100 text-green-800': diagnosis.resultPercentage < 20,
                            'bg-yellow-100 text-yellow-800':
                              diagnosis.resultPercentage >= 20 && diagnosis.resultPercentage < 50,
                            'bg-red-100 text-red-800': diagnosis.resultPercentage >= 50,
                          }"
                          class="px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {{ getStatusText(diagnosis.resultPercentage) }} -
                          {{ diagnosis.resultPercentage }}%
                        </div>
                      </div>
                      <div class="mt-2">
                        <div class="font-semibold">Heart Disease Risk Assessment</div>
                        <p class="text-sm text-gray-600 mt-1 line-clamp-2">
                          {{ formatRiskLabel(diagnosis.resultPercentage) }} of heart disease
                          detected. Key factors: {{ diagnosis.age }} years, {{ diagnosis.sex }}, BP:
                          {{ diagnosis.restingBP }} mmHg.
                        </p>
                      </div>

                      <div class="flex justify-between items-center mt-3">
                        <div class="flex items-center text-blue-600 text-sm">
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View Details
                        </div>
                        <button
                          @click.stop="viewDiagnosisDetails(diagnosis)"
                          class="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors"
                        >
                          Full Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- View 3: Individual Diagnosis Detail View -->
          <div v-else-if="selectedDiagnosis" class="bg-white rounded-lg shadow-md p-6">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 class="text-xl font-semibold mb-1">Diagnosis Report</h2>
                <p class="text-gray-500">{{ formatDate(selectedDiagnosis.savedAt) }}</p>
              </div>
              <div
                :class="{
                  'bg-green-100 text-green-800': selectedDiagnosis.resultPercentage < 20,
                  'bg-yellow-100 text-yellow-800':
                    selectedDiagnosis.resultPercentage >= 20 &&
                    selectedDiagnosis.resultPercentage < 50,
                  'bg-red-100 text-red-800': selectedDiagnosis.resultPercentage >= 50,
                }"
                class="px-3 py-1.5 rounded-full text-sm font-medium mt-2 md:mt-0"
              >
                {{ getStatusText(selectedDiagnosis.resultPercentage) }} -
                {{ selectedDiagnosis.resultPercentage }}%
              </div>
            </div>

            <!-- Risk assessment card -->
            <div class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div class="flex items-center mb-4">
                <div
                  :class="{
                    'bg-green-100 text-green-700': selectedDiagnosis.resultPercentage < 20,
                    'bg-yellow-100 text-yellow-700':
                      selectedDiagnosis.resultPercentage >= 20 &&
                      selectedDiagnosis.resultPercentage < 50,
                    'bg-red-100 text-red-700': selectedDiagnosis.resultPercentage >= 50,
                  }"
                  class="p-2 rounded-full mr-3"
                >
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-lg">Risk Assessment</h3>
                  <p class="text-sm text-gray-600">
                    Based on medical parameters and predictive analysis
                  </p>
                </div>
              </div>

              <div class="mt-1">
                <div class="h-4 bg-gray-200 rounded-full">
                  <div
                    :class="getStatusClass(selectedDiagnosis.resultPercentage)"
                    class="h-4 rounded-full"
                    :style="{ width: `${selectedDiagnosis.resultPercentage}%` }"
                  ></div>
                </div>
                <div class="flex justify-between text-xs mt-1">
                  <span>Low Risk</span>
                  <span>Medium Risk</span>
                  <span>High Risk</span>
                </div>
              </div>

              <div class="mt-4 pt-4 border-t border-gray-200">
                <h4 class="font-medium mb-2">Risk Interpretation:</h4>
                <p v-if="selectedDiagnosis.resultPercentage < 20" class="text-sm text-gray-700">
                  Low risk of cardiovascular disease. Continue maintaining healthy lifestyle and
                  regular check-ups.
                </p>
                <p
                  v-else-if="selectedDiagnosis.resultPercentage < 50"
                  class="text-sm text-gray-700"
                >
                  Moderate risk of cardiovascular disease. Consider lifestyle modifications and
                  consult with healthcare provider.
                </p>
                <p v-else class="text-sm text-gray-700">
                  High risk of cardiovascular disease. Immediate consultation with cardiologist
                  recommended.
                </p>
              </div>
            </div>

            <!-- Patient data grid -->
            <div class="mb-6">
              <h3 class="font-semibold mb-3">Patient Data</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="bg-gray-50 p-2 rounded">
                  <div class="text-xs text-gray-500">Age</div>
                  <div>{{ selectedDiagnosis.age }} years</div>
                </div>
                <div class="bg-gray-50 p-2 rounded">
                  <div class="text-xs text-gray-500">Sex</div>
                  <div>{{ selectedDiagnosis.sex }}</div>
                </div>
                <div class="bg-gray-50 p-2 rounded">
                  <div class="text-xs text-gray-500">Chest Pain Type</div>
                  <div>{{ selectedDiagnosis.chestPainType }}</div>
                </div>
                <div class="bg-gray-50 p-2 rounded">
                  <div class="text-xs text-gray-500">Resting BP</div>
                  <div>{{ selectedDiagnosis.restingBP }} mmHg</div>
                </div>
                <div class="bg-gray-50 p-2 rounded">
                  <div class="text-xs text-gray-500">Cholesterol</div>
                  <div>{{ selectedDiagnosis.cholesterol }} mg/dl</div>
                </div>
                <div class="bg-gray-50 p-2 rounded">
                  <div class="text-xs text-gray-500">Fasting Blood Sugar</div>
                  <div>{{ selectedDiagnosis.fastingBS > 120 ? '> 120 mg/dl' : '≤ 120 mg/dl' }}</div>
                </div>
                <div class="bg-gray-50 p-2 rounded">
                  <div class="text-xs text-gray-500">Resting ECG</div>
                  <div>{{ selectedDiagnosis.restingECG }}</div>
                </div>
                <div class="bg-gray-50 p-2 rounded">
                  <div class="text-xs text-gray-500">Max Heart Rate</div>
                  <div>{{ selectedDiagnosis.maxHR }} bpm</div>
                </div>
                <div class="bg-gray-50 p-2 rounded">
                  <div class="text-xs text-gray-500">Exercise Angina</div>
                  <div>{{ selectedDiagnosis.exerciseAngina }}</div>
                </div>
                <div class="bg-gray-50 p-2 rounded">
                  <div class="text-xs text-gray-500">Old Peak</div>
                  <div>{{ selectedDiagnosis.oldpeak }}</div>
                </div>
                <div class="bg-gray-50 p-2 rounded">
                  <div class="text-xs text-gray-500">ST Slope</div>
                  <div>{{ selectedDiagnosis.stSlope }}</div>
                </div>
                <div class="bg-gray-50 p-2 rounded">
                  <div class="text-xs text-gray-500">CA</div>
                  <div>{{ selectedDiagnosis.caCount }}</div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-center mt-8">
              <button
                @click="viewDiagnosisDetails(selectedDiagnosis)"
                class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg mr-4 flex items-center transition-colors"
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
                class="border border-blue-600 text-blue-600 hover:bg-blue-50 px-5 py-2 rounded-lg flex items-center transition-colors"
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
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print Diagnosis
              </button>
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
.history-page {
  margin-top: -1rem;
}

.progress-circle {
  transition: stroke-dashoffset 1s ease;
}

/* Timeline styling */
.border-l-2 {
  position: relative;
}

.border-l-2::before {
  content: '';
  position: absolute;
  height: calc(100% - 10px);
  width: 2px;
  background-color: #e2e8f0;
  left: -2px;
  z-index: 0;
}

.border-l-2:last-child::before {
  display: none;
}
</style>

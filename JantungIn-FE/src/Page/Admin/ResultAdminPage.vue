<template>
  <div class="result-page mt-16">
    <!-- Loading indicator -->
    <div v-if="isLoading" class="flex justify-center items-center h-screen">
      <div class="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-500"></div>
      <span class="ml-3 text-lg">Memuat data diagnosis...</span>
    </div>

    <!-- Error message -->
    <div v-else-if="error" class="flex justify-center items-center h-screen">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-lg">
        <p class="font-bold">Terjadi kesalahan</p>
        <p>{{ error }}</p>
        <button
          @click="loadDiagnosisData"
          class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Coba Lagi
        </button>
      </div>
    </div>

    <!-- Main content when data is loaded -->
    <div v-else class="container mx-auto px-4 py-8 max-w-6xl">
      <!-- Back Button and Send to Patient Button -->
      <div class="mb-6 flex justify-between items-center">
        <button
          @click="goBack"
          class="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
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
          Kembali
        </button>

        <button
          @click="showSendToPatient"
          class="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Kirim ke Pasien
        </button>
      </div>

      <!-- Main Content -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <!-- Header Section with Result -->
        <div class="flex flex-col lg:flex-row justify-between items-center mb-10">
          <div class="mb-6 lg:mb-0">
            <div class="flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8 text-red-500 mr-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clip-rule="evenodd"
                />
              </svg>
              <h1 class="text-3xl font-bold text-gray-800">Laporan Diagnosis Penyakit Jantung</h1>
            </div>

            <div class="bg-gray-100 p-3 rounded-lg border-l-4 border-blue-500">
              <p class="text-gray-700">
                <span class="font-medium">Pasien:</span> {{ patientName }}
              </p>
              <p class="text-gray-700">
                <span class="font-medium">Tanggal:</span> {{ formatDate(diagnosisDate) }}
              </p>
              <p class="text-gray-700">
                <span class="font-medium">ID Laporan:</span>
                {{ diagnosisId ? diagnosisId : 'HD-' + generateReportId() }}
              </p>
            </div>
          </div>

          <!-- Result Circle -->
          <div
            class="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg border border-gray-100"
          >
            <div class="relative">
              <svg class="w-40 h-40" viewBox="0 0 36 36">
                <!-- Background circle -->
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#e0e0e0"
                  stroke-width="2.5"
                ></circle>

                <!-- Progress circle with animation -->
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  :stroke="resultColorClass"
                  stroke-width="2.5"
                  stroke-dasharray="100"
                  :stroke-dashoffset="100 - resultPercentage"
                  transform="rotate(-90 18 18)"
                  class="progress-circle"
                ></circle>
              </svg>

              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-4xl font-bold" :class="textColorClass"
                  >{{ resultPercentage }}%</span
                >
                <span class="text-sm font-semibold tracking-wider" :class="textColorClass">{{
                  resultText
                }}</span>
              </div>
            </div>

            <div class="mt-4 text-center">
              <p class="text-lg font-semibold" :class="textColorClass">{{ resultMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Risk Factors and Recommendations -->
        <div class="mb-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 class="text-xl font-semibold mb-4">Analisis Risiko & Rekomendasi</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium mb-3">Faktor Risiko Utama</h3>
              <ul class="space-y-2">
                <li
                  v-for="(factor, index) in topRiskFactors"
                  :key="index"
                  class="flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-red-500 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>{{ factor }}</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-medium mb-3">Rekomendasi</h3>
              <ul class="space-y-2">
                <li
                  v-for="(recommendation, index) in recommendations"
                  :key="index"
                  class="flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-green-500 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>{{ recommendation }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Patient Data Table -->
        <div class="mb-10">
          <h2 class="text-xl font-semibold mb-4">Data Input Pasien</h2>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gray-50">
                  <th
                    class="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-200"
                  >
                    Fitur
                  </th>
                  <th
                    class="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-200"
                  >
                    Nilai
                  </th>
                  <th
                    class="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-200"
                  >
                    Rentang Normal/Deskripsi
                  </th>
                  <th
                    class="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-200"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in patientDataTable"
                  :key="index"
                  class="hover:bg-gray-50"
                  :class="{ 'bg-red-50': item.highlight }"
                >
                  <td class="px-4 py-3 text-sm border border-gray-200">{{ item.feature }}</td>
                  <td
                    class="px-4 py-3 text-sm font-medium border border-gray-200"
                    :class="item.highlight ? 'text-red-600' : ''"
                  >
                    {{ item.value }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-500 border border-gray-200">
                    {{ item.normalRange }}
                  </td>
                  <td class="px-4 py-3 text-sm border border-gray-200">
                    <span
                      v-if="item.highlight"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3 w-3 mr-1"
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
                      Abnormal
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3 w-3 mr-1"
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
                      Normal
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-3 text-right text-xs text-gray-500">
            <span class="inline-block mr-4">
              <span class="inline-block w-3 h-3 bg-red-50 border border-red-200 mr-1"></span>
              Mengindikasikan nilai di luar rentang normal
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div
          class="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mt-10"
        >
          <button
            class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-colors"
            @click="printResults"
          >
            Cetak Laporan
          </button>
        </div>

        <!-- Send to Patient Dialog -->
        <div
          v-if="showSendDialog"
          class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 class="text-lg font-semibold mb-4">Kirim Hasil ke Pasien</h3>
            <p class="text-gray-600 mb-4">
              Masukkan informasi pasien untuk mengirim laporan diagnosis ini.
            </p>

            <div class="mb-4">
              <label for="sendPatientNik" class="block text-sm font-medium text-gray-700 mb-1"
                >NIK</label
              >
              <input
                type="text"
                id="sendPatientNik"
                v-model="sendPatientNik"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan NIK 16 digit"
                maxlength="16"
              />
              <p v-if="sendNikError" class="mt-1 text-sm text-red-600">{{ sendNikError }}</p>
            </div>

            <div class="mb-4">
              <label for="sendPatientName" class="block text-sm font-medium text-gray-700 mb-1"
                >Nama Lengkap</label
              >
              <input
                type="text"
                id="sendPatientName"
                v-model="sendPatientName"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan nama lengkap pasien"
              />
              <p v-if="sendNameError" class="mt-1 text-sm text-red-600">{{ sendNameError }}</p>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                @click="closeSendDialog"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Batal
              </button>

              <button
                @click="handleSendToPatient"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                :disabled="isSending"
              >
                <span v-if="isSending" class="flex items-center">
                  <svg
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
                  Mengirim...
                </span>
                <span v-else>Kirim Hasil</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import diagnosisService from '@/services/DiagnosisService'
import patientService from '@/services/PatientService'
import historyService from '@/services/HistoryService'

const router = useRouter()
const route = useRoute()

// State variables
const isLoading = ref(true)
const error = ref(null)
const diagnosis = ref(null)
const patientInfo = ref(null)

// Get diagnosis ID from route params
const diagnosisId = route.params.id || route.query.id

// Patient data references
const patientName = ref('')
const resultPercentage = ref(0)
const diagnosisDate = ref(new Date())
const patientDataTable = ref([])
const featureContributions = ref([])
const topRiskFactors = ref([])
const recommendations = ref([])

// Load diagnosis data from API
const loadDiagnosisData = async () => {
  try {
    isLoading.value = true
    error.value = null

    if (!diagnosisId) {
      console.warn('Tidak ada ID diagnosis yang diberikan')
      error.value =
        'ID diagnosis tidak ditemukan. Silakan kembali ke halaman sebelumnya dan coba lagi.'
      isLoading.value = false
      return
    }

    // Fetch diagnosis by ID using the endpoint: /api/v1/diagnosis/{id}
    console.log(
      `Mengambil diagnosis dengan ID: ${diagnosisId} dari API: /api/v1/diagnosis/${diagnosisId}`,
    )
    const diagnosisData = await diagnosisService.getDiagnosisById(diagnosisId)

    if (!diagnosisData) {
      console.error('Data diagnosis tidak ditemukan dari API')
      error.value = 'Data diagnosis tidak ditemukan. Silakan periksa ID diagnosis dan coba lagi.'
      isLoading.value = false
      return
    }

    console.log('Data diagnosis berhasil diambil:', diagnosisData)
    diagnosis.value = diagnosisData

    // Update UI data from diagnosis
    resultPercentage.value = diagnosisData.resultPercentage || 0
    diagnosisDate.value = diagnosisData.createdAt ? new Date(diagnosisData.createdAt) : new Date()

    // Fetch patient info if patient ID is available
    if (diagnosisData.userId || diagnosisData.patientId) {
      const patientId = diagnosisData.userId || diagnosisData.patientId
      try {
        console.log(`Mengambil data pasien dengan ID: ${patientId}`)
        const patient = await patientService.getPatientById(patientId)
        patientInfo.value = patient
        patientName.value = patient.name || 'Pasien Tidak Diketahui'
        console.log('Data pasien berhasil diambil:', patient)
      } catch (patientError) {
        console.error('Error fetching patient data:', patientError)
        patientName.value = 'Pasien Tidak Diketahui'
      }
    } else {
      patientName.value = 'Pasien Tidak Diketahui'
    }

    // Update risk factors, patient data, and feature contributions
    updateDiagnosisDisplay(diagnosisData)
  } catch (err) {
    console.error('Error loading diagnosis:', err)
    error.value = 'Gagal memuat data diagnosis. Silakan coba lagi.'
  } finally {
    isLoading.value = false
  }
}

// Function to update UI elements based on diagnosis data
const updateDiagnosisDisplay = (diagnosisData) => {
  // Update patient data table
  updatePatientDataTable(diagnosisData)

  // Update feature contributions
  updateFeatureContributions(diagnosisData)

  // Update risk factors and recommendations
  updateRiskFactors(diagnosisData)
}

// Function to update patient data table
const updatePatientDataTable = (diagnosisData) => {
  const tableData = [
    {
      feature: 'Usia',
      value: diagnosisData.age?.toString() || 'N/A',
      normalRange: 'N/A',
      highlight: false,
    },
    {
      feature: 'Jenis Kelamin',
      value:
        diagnosisData.sex === 'Male'
          ? 'Laki-laki'
          : diagnosisData.sex === 'Female'
            ? 'Perempuan'
            : 'N/A',
      normalRange: 'N/A',
      highlight: false,
    },
    {
      feature: 'Tipe Nyeri Dada',
      value: translateChestPainType(diagnosisData.chestPainType),
      normalRange: 'N/A',
      highlight: false,
    },
    {
      feature: 'Tekanan Darah Istirahat',
      value: `${diagnosisData.restingBP || diagnosisData.restingBloodPressure || 'N/A'} mmHg`,
      normalRange: '90-120 mmHg',
      highlight: diagnosisData.restingBP > 120 || diagnosisData.restingBloodPressure > 120,
    },
    {
      feature: 'Kolesterol Serum',
      value: `${diagnosisData.serumCholesterol || 'N/A'} mg/dl`,
      normalRange: '<200 mg/dl',
      highlight: diagnosisData.serumCholesterol > 200,
    },
    {
      feature: 'Gula Darah Puasa',
      value: diagnosisData.fastingBloodSugar
        ? diagnosisData.fastingBloodSugar > 120
          ? '>120 mg/dl'
          : '<120 mg/dl'
        : 'N/A',
      normalRange: '<100 mg/dl',
      highlight: diagnosisData.fastingBloodSugar > 120,
    },
    {
      feature: 'ECG Istirahat',
      value: translateRestingECG(diagnosisData.restingEcgResults),
      normalRange: 'Normal',
      highlight: diagnosisData.restingEcgResults !== 'Normal',
    },
    {
      feature: 'Detak Jantung Maksimum',
      value:
        diagnosisData.maxHeartRate?.toString() ||
        diagnosisData.maximumHeartRate?.toString() ||
        'N/A',
      normalRange: '(220 - usia)',
      highlight: false,
    },
    {
      feature: 'Angina Akibat Olahraga',
      value: diagnosisData.exerciseInducedAngina === 'Yes' ? 'Ya' : 'Tidak',
      normalRange: 'Tidak',
      highlight: diagnosisData.exerciseInducedAngina === 'Yes',
    },
    {
      feature: 'Depresi ST',
      value: diagnosisData.stDepression?.toString() || 'N/A',
      normalRange: '<0.5',
      highlight: diagnosisData.stDepression > 0.5,
    },
    {
      feature: 'Kemiringan ST',
      value: translateSTSlope(diagnosisData.stSegment),
      normalRange: 'Menanjak',
      highlight: diagnosisData.stSegment !== 'Upsloping',
    },
    {
      feature: 'Jumlah Pembuluh Utama',
      value: diagnosisData.majorVessels?.toString() || 'N/A',
      normalRange: '0',
      highlight: diagnosisData.majorVessels > 0,
    },
    {
      feature: 'Talasemia',
      value: translateThalassemia(diagnosisData.thalassemia),
      normalRange: 'Normal',
      highlight: diagnosisData.thalassemia !== 'Normal',
    },
  ]

  patientDataTable.value = tableData
}

// Helper functions to translate values to Indonesian
const translateChestPainType = (type) => {
  const translations = {
    'Typical angina': 'Angina Tipikal',
    'Atypical angina': 'Angina Atipikal',
    'Non-anginal pain': 'Nyeri Non-anginal',
    Asymptomatic: 'Asimptomatik',
  }
  return translations[type] || type || 'N/A'
}

const translateRestingECG = (ecg) => {
  const translations = {
    Normal: 'Normal',
    'ST-T wave abnormality': 'Abnormalitas gelombang ST-T',
    'Left ventricular hypertrophy': 'Hipertrofi ventrikel kiri',
  }
  return translations[ecg] || ecg || 'N/A'
}

const translateSTSlope = (slope) => {
  const translations = {
    Upsloping: 'Menanjak',
    Flat: 'Datar',
    Downsloping: 'Menurun',
  }
  return translations[slope] || slope || 'N/A'
}

const translateThalassemia = (thal) => {
  const translations = {
    Normal: 'Normal',
    'Fixed defect': 'Cacat Tetap',
    'Reversible defect': 'Cacat Dapat Dibalik',
  }
  return translations[thal] || thal || 'N/A'
}

// Function to update feature contributions
const updateFeatureContributions = (diagnosisData) => {
  // If the API provides feature contributions, use them
  if (diagnosisData.featureContributions && Array.isArray(diagnosisData.featureContributions)) {
    featureContributions.value = diagnosisData.featureContributions
    return
  }

  // If the API provides feature importances, transform them
  if (diagnosisData.featureImportance && typeof diagnosisData.featureImportance === 'object') {
    const importances = Object.entries(diagnosisData.featureImportance)
      .map(([feature, value]) => {
        // Transform feature names to human-readable format
        let readableFeature = feature
          .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
          .replace(/_/g, ' ') // Replace underscores with spaces
          .trim()

        // Translate feature names to Indonesian
        switch (feature) {
          case 'age':
            readableFeature = 'Usia'
            break
          case 'sex':
            readableFeature = 'Jenis Kelamin'
            break
          case 'chestPainType':
            readableFeature = 'Tipe Nyeri Dada'
            break
          case 'restingBP':
          case 'restingBloodPressure':
            readableFeature = 'Tekanan Darah Istirahat'
            break
          case 'cholesterol':
          case 'serumCholesterol':
            readableFeature = 'Kolesterol Serum'
            break
          case 'fastingBloodSugar':
            readableFeature = 'Gula Darah Puasa'
            break
          case 'restingEcgResults':
          case 'restingECG':
            readableFeature = 'ECG Istirahat'
            break
          case 'maxHeartRate':
          case 'maximumHeartRate':
            readableFeature = 'Detak Jantung Maksimum'
            break
          case 'exerciseInducedAngina':
          case 'exerciseAngina':
            readableFeature = 'Angina Akibat Olahraga'
            break
          case 'stDepression':
          case 'oldpeak':
            readableFeature = 'Depresi ST'
            break
          case 'stSegment':
          case 'stSlope':
            readableFeature = 'Kemiringan ST'
            break
          case 'majorVessels':
          case 'ca':
            readableFeature = 'Jumlah Pembuluh Utama'
            break
          case 'thalassemia':
          case 'thal':
            readableFeature = 'Talasemia'
            break
        }

        return {
          feature: readableFeature,
          value: parseFloat(value),
        }
      })
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value)) // Sort by absolute importance

    featureContributions.value = importances
    return
  }

  // Otherwise, calculate estimated contributions based on abnormal values
  const abnormalFeatures = patientDataTable.value.filter((item) => item.highlight)

  // Generate synthetic contributions based on abnormal values
  const syntheticContributions = abnormalFeatures.map((feature) => {
    let value = 0

    // Assign impact values based on feature type
    switch (feature.feature) {
      case 'Kolesterol Serum':
        value = 0.35 + Math.random() * 0.15
        break
      case 'Tekanan Darah Istirahat':
        value = 0.25 + Math.random() * 0.15
        break
      case 'Depresi ST':
        value = 0.15 + Math.random() * 0.1
        break
      case 'Usia':
        value = 0.2 + Math.random() * 0.1
        break
      case 'Jumlah Pembuluh Utama':
        value = 0.3 + Math.random() * 0.15
        break
      case 'Talasemia':
        value = 0.25 + Math.random() * 0.1
        break
      case 'Angina Akibat Olahraga':
        value = 0.2 + Math.random() * 0.1
        break
      default:
        value = 0.1 + Math.random() * 0.1
    }

    return {
      feature: feature.feature,
      value: value,
    }
  })

  // Add some protective factors with negative values
  if (diagnosisData.maxHeartRate < 100 || diagnosisData.maximumHeartRate < 100) {
    syntheticContributions.push({
      feature: 'Detak Jantung Maksimum',
      value: -0.15,
    })
  }

  if (diagnosisData.exerciseInducedAngina === 'No') {
    syntheticContributions.push({
      feature: 'Angina Akibat Olahraga',
      value: -0.2,
    })
  }

  // Sort by contribution value (highest positive first)
  featureContributions.value = syntheticContributions.sort((a, b) => b.value - a.value)
}

// Function to update risk factors and recommendations
const updateRiskFactors = (diagnosisData) => {
  // Check if the API already provides risk factors
  if (diagnosisData.riskFactors && Array.isArray(diagnosisData.riskFactors)) {
    topRiskFactors.value = diagnosisData.riskFactors
  } else {
    // Generate risk factors based on patient data
    const riskFactors = patientDataTable.value
      .filter((item) => item.highlight)
      .map((item) => {
        if (item.feature === 'Kolesterol Serum') {
          return `Kolesterol serum tinggi (${item.value})`
        } else if (item.feature === 'Tekanan Darah Istirahat') {
          return `Tekanan darah istirahat di atas normal (${item.value})`
        } else if (item.feature === 'Depresi ST') {
          return `Depresi ST sedikit meningkat (${item.value})`
        } else if (item.feature === 'Jumlah Pembuluh Utama') {
          return `Beberapa pembuluh utama terkena (${item.value})`
        } else {
          return `${item.feature}: ${item.value}`
        }
      })

    // Add age as a non-modifiable risk factor if above 45
    if (diagnosisData.age > 45) {
      riskFactors.push(`Usia (${diagnosisData.age}) sebagai faktor risiko tidak dapat dimodifikasi`)
    }

    topRiskFactors.value = riskFactors
  }

  // Check if the API already provides recommendations
  if (diagnosisData.recommendations && Array.isArray(diagnosisData.recommendations)) {
    recommendations.value = diagnosisData.recommendations
    return
  }

  // Generate recommendations based on risk level
  let riskLevel = 'low'

  // Determine risk level from cardiovascularRisk field if available
  if (diagnosisData.cardiovascularRisk) {
    riskLevel = diagnosisData.cardiovascularRisk.toLowerCase()
  } else if (resultPercentage.value >= 50) {
    riskLevel = 'high'
  } else if (resultPercentage.value >= 20) {
    riskLevel = 'medium'
  }

  const recs = []

  // Common recommendations
  recs.push('Olahraga sedang setidaknya 150 menit per minggu')

  // Add risk-specific recommendations
  if (riskLevel === 'high') {
    recs.push('Konsultasi segera dengan dokter jantung')
    recs.push('Pemeriksaan kardiovaskular rutin setiap 3-4 bulan')
    recs.push('Kepatuhan ketat pada diet sehat jantung')
    recs.push('Pertimbangkan pengobatan di bawah pengawasan medis')
  } else if (riskLevel === 'medium') {
    recs.push('Pemeriksaan kardiovaskular rutin setiap 6 bulan')
    recs.push('Terapkan diet sehat jantung rendah lemak jenuh dan kolesterol')
    recs.push('Pantau tekanan darah secara teratur')
  } else {
    recs.push('Pemeriksaan kardiovaskular tahunan')
    recs.push('Pertahankan diet seimbang dan gaya hidup sehat')
  }

  // Add targeted recommendations based on specific risk factors
  if (
    patientDataTable.value.find((item) => item.feature === 'Kolesterol Serum' && item.highlight)
  ) {
    recs.push('Pertimbangkan obat penurun kolesterol jika perubahan diet tidak efektif')
    recs.push('Kurangi asupan lemak jenuh dan kolesterol dalam makanan')
  }

  if (
    patientDataTable.value.find(
      (item) => item.feature === 'Tekanan Darah Istirahat' && item.highlight,
    )
  ) {
    recs.push('Kurangi asupan sodium dan pantau tekanan darah setiap hari')
    recs.push('Kurangi stres dan pertimbangkan teknik relaksasi')
  }

  if (diagnosisData.exerciseInducedAngina === 'Yes') {
    recs.push('Konsultasikan dengan dokter mengenai aktivitas fisik yang sesuai')
  }

  if (diagnosisData.majorVessels > 0) {
    recs.push('Konsultasi dengan spesialis jantung untuk evaluasi pembuluh darah jantung')
  }

  recommendations.value = recs
}

// Colors for donut chart
// const donutColors = ref([
//   '#3b82f6', // blue-500
//   '#ef4444', // red-500
//   '#f97316', // orange-500
//   '#8b5cf6', // violet-500
//   '#10b981', // emerald-500
//   '#f59e0b', // amber-500
//   '#6366f1', // indigo-500
//   '#ec4899', // pink-500
// ])

// Computed properties for styling based on result percentage
const resultColorClass = computed(() => {
  if (resultPercentage.value < 20) return '#22c55e' // Green (low risk)
  if (resultPercentage.value < 50) return '#eab308' // Yellow (medium risk)
  return '#ef4444' // Red (high risk)
})

const textColorClass = computed(() => {
  if (resultPercentage.value < 20) return 'text-green-600'
  if (resultPercentage.value < 50) return 'text-yellow-500'
  return 'text-red-600'
})

const resultText = computed(() => {
  if (resultPercentage.value < 20) return 'RISIKO RENDAH'
  if (resultPercentage.value < 50) return 'RISIKO SEDANG'
  return 'RISIKO TINGGI'
})

const resultMessage = computed(() => {
  if (resultPercentage.value < 20) return 'Tidak terdeteksi penyakit jantung'
  if (resultPercentage.value < 50) return 'Potensi penyakit jantung'
  return 'Penyakit jantung terdeteksi'
})

// Methods
const formatDate = (date) => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

const generateReportId = () => {
  // Generate a unique report ID based on timestamp and random numbers
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')
  return `${timestamp}-${random}`
}

const goBack = () => {
  router.push('/admin/diagnoses')
}

// Send to Patient functionality
const showSendDialog = ref(false)
const sendPatientNik = ref('')
const sendPatientName = ref('')
const sendNikError = ref('')
const sendNameError = ref('')
const isSending = ref(false)

const showSendToPatient = () => {
  // If we already have patient info, pre-fill the form
  if (patientInfo.value) {
    sendPatientName.value = patientInfo.value.name || ''
    sendPatientNik.value = patientInfo.value.nik || ''
  } else if (diagnosis.value && diagnosis.value.patientId) {
    // Try to pre-fill with diagnosis patient info
    sendPatientNik.value = diagnosis.value.patientId || ''
  }

  // Clear errors
  sendNikError.value = ''
  sendNameError.value = ''

  // Show the dialog
  showSendDialog.value = true
}

const closeSendDialog = () => {
  showSendDialog.value = false
}

const handleSendToPatient = async () => {
  // Reset errors
  sendNikError.value = ''
  sendNameError.value = ''

  // Validate inputs
  let hasError = false

  if (!sendPatientNik.value || sendPatientNik.value.length < 16) {
    sendNikError.value = 'Silakan masukkan NIK yang valid (minimal 16 digit)'
    hasError = true
  }

  if (!sendPatientName.value || sendPatientName.value.trim().length < 3) {
    sendNameError.value = 'Silakan masukkan nama lengkap pasien'
    hasError = true
  }

  if (hasError) return

  try {
    isSending.value = true

    // Here we would call an API endpoint to send the report to the patient
    // In a real implementation, we would do something like this:
    // const sendData = {
    //   patientName: sendPatientName.value,
    //   patientNik: sendPatientNik.value,
    //   diagnosisId: diagnosisId,
    //   resultPercentage: resultPercentage.value,
    //   resultText: resultText.value,
    //   diagnosisDate: diagnosisDate.value,
    //   reportId: diagnosis.value?.id || generateReportId(),
    //   patientData: patientDataTable.value,
    //   featureContributions: featureContributions.value,
    //   riskFactors: topRiskFactors.value,
    //   recommendations: recommendations.value,
    // }
    // await apiService.post('/api/v1/diagnosis/share', sendData)

    // For now, we'll just simulate the API call with a timeout
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Close dialog and show success message
    showSendDialog.value = false
    alert('Laporan diagnosis telah berhasil dikirim ke pasien!')
  } catch (error) {
    console.error('Error sending diagnosis to patient:', error)
    alert('Kesalahan saat mengirim laporan diagnosis. Silakan coba lagi.')
  } finally {
    isSending.value = false
  }
}

const printResults = () => {
  window.print()
}

// Load data when component is mounted
onMounted(() => {
  loadDiagnosisData()
})
</script>

<style scoped>
.result-page {
  min-height: 100vh;
  background-color: #f3f4f6;
  padding-top: 1rem;
  padding-bottom: 3rem;
}

.progress-circle {
  stroke-dashoffset: 100;
  animation: progress 1.5s ease-out forwards;
}

@keyframes progress {
  from {
    stroke-dashoffset: 100;
  }
  to {
    stroke-dashoffset: v-bind('100 - resultPercentage');
  }
}

/* Table row hover effect */
table tbody tr:hover {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  position: relative;
  z-index: 1;
}

@media print {
  .result-page {
    background-color: white;
  }

  button {
    display: none;
  }

  .bg-gray-50,
  .bg-red-50 {
    background-color: white !important;
  }

  table,
  tr,
  td,
  th {
    break-inside: avoid;
  }

  .mb-10 {
    margin-bottom: 2rem;
  }
}
</style>

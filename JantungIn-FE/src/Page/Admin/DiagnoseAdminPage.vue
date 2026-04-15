<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FooterComponent from '@/components/Footer-component.vue'
import LazyBackground from '@/components/LazyBackground.vue'
import LazyImage from '@/components/LazyImage.vue'
import ImagePreloader from '@/components/ImagePreloader.vue'
import PatientSearchSelector from '@/components/PatientSearchSelector.vue'
import diagnosisService from '@/services/DiagnosisService'
import historyService from '@/services/HistoryService'
import patientService from '@/services/PatientService'

const router = useRouter()

defineOptions({
  name: 'DiagnosePageAdmin',
})

// Form data
const diagnosisForm = ref({
  patientName: '',
  patientId: '', // Add patient ID field
  age: '',
  sex: '',
  cp: '', // Chest Pain Type
  trestbps: '', // Resting Blood Pressure
  chol: '', // Serum Cholesterol
  fbs: '', // Fasting Blood Sugar
  restecg: '', // Resting ECG Results
  thalach: '', // Maximum Heart Rate
  exang: '', // Exercise Induced Angina
  oldpeak: '', // ST Depression
  slope: '', // ST Slope
  ca: '', // Number of Major Vessels
  thal: '', // Thallassemia
})

// Selected patient object for the PatientSearchSelector component
const selectedPatient = ref({ id: '', name: '' })

// Form options - Values match those needed by the ML model
const sexOptions = [
  { text: 'Female', value: 'Female' },
  { text: 'Male', value: 'Male' },
]

const chestPainTypeOptions = [
  { text: 'Typical Angina', value: 'Typical angina' },
  { text: 'Atypical Angina', value: 'Atypical angina' },
  { text: 'Non-anginal Pain', value: 'Non-anginal pain' },
  { text: 'Asymptomatic', value: 'Asymptomatic' },
]

const stSlopeOptions = [
  { text: 'Upsloping', value: 'Upsloping' },
  { text: 'Flat', value: 'Flat' },
  { text: 'Downsloping', value: 'Downsloping' },
]

const restingECGOptions = [
  { text: 'Normal', value: 'Normal' },
  { text: 'ST-T Wave Abnormality', value: 'ST-T wave abnormality' },
  { text: 'Left Ventricular Hypertrophy', value: 'Left ventricular hypertrophy' },
]

const numberOfVesselsOptions = [
  { text: '0', value: 0 },
  { text: '1', value: 1 },
  { text: '2', value: 2 },
  { text: '3', value: 3 },
]

const fastingBloodSugarOptions = [
  { text: 'No (< 120 mg/dl)', value: 80 },
  { text: 'Yes (> 120 mg/dl)', value: 120 },
]

const thallassemiaOptions = [
  { text: 'Normal', value: 'Normal' },
  { text: 'Fixed Defect', value: 'Fixed defect' },
  { text: 'Reversible Defect', value: 'Reversible defect' },
]

const yesNoOptions = [
  { text: 'No', value: 'No' },
  { text: 'Yes', value: 'Yes' },
]

// Current step for multi-step form
const currentStep = ref(1)
const totalSteps = 3

// Refs for the result
const isLoading = ref(false)
const predictionResult = ref(null)
const resultPercentage = ref(null)
const showResult = ref(false)
const diagnosisId = ref(null) // Tambahkan ref untuk menyimpan ID diagnosis

// Update patient information when selected
const updatePatientInfo = (patient) => {
  console.log('Patient selected:', patient)
  if (patient && patient.id) {
    diagnosisForm.value.patientName = patient.name
    diagnosisForm.value.patientId = patient.id

    // Also update the selectedPatient ref to keep UI in sync
    selectedPatient.value = {
      id: patient.id || '',
      name: patient.name || '',
    }

    // Optionally, try to fetch more details about the patient
    fetchPatientDetails(patient.id)
  }
}

// Fetch additional patient details if needed
const fetchPatientDetails = async (patientId) => {
  try {
    // This could load more detailed patient information from backend if needed
    const details = await patientService.getPatientById(patientId)
    console.log('Fetched patient details:', details)
    // You could update the UI with more patient information here
  } catch (error) {
    console.error('Error fetching patient details:', error)
    // Silent fail - we already have basic patient info
  }
}

// Function to handle form submission
const handleSubmit = async () => {
  try {
    // Basic form validation
    if (!validateForm()) {
      alert('Please fill in all required fields')
      return
    }

    isLoading.value = true
    showResult.value = true

    // Bangun payload langsung dari form — nilai sudah berupa string/number yang benar
    const apiFormData = {
      patientId: diagnosisForm.value.patientId,
      age: parseInt(diagnosisForm.value.age),
      sex: diagnosisForm.value.sex,
      chestPainType: diagnosisForm.value.cp,
      restingBloodPressure: parseFloat(diagnosisForm.value.trestbps),
      serumCholesterol: parseFloat(diagnosisForm.value.chol),
      fastingBloodSugar: parseFloat(diagnosisForm.value.fbs),
      restingEcgResults: diagnosisForm.value.restecg,
      maximumHeartRate: parseInt(diagnosisForm.value.thalach),
      exerciseInducedAngina: diagnosisForm.value.exang,
      stDepression: parseFloat(diagnosisForm.value.oldpeak),
      stSegment: diagnosisForm.value.slope,
      majorVessels: parseInt(diagnosisForm.value.ca),
      thalassemia: diagnosisForm.value.thal,
    }

    console.log(
      `Processing diagnosis for patient: ${diagnosisForm.value.patientName} (ID: ${diagnosisForm.value.patientId})`,
    )
    console.log('Diagnosis payload:', apiFormData)

    try {
      // Use the DiagnosisService to submit the diagnosis
      const result = await diagnosisService.submitDiagnosis(apiFormData)
      console.log('Diagnosis API response:', result)

      // Use the result data from the diagnosis service
      resultPercentage.value = result.resultPercentage ? result.resultPercentage.toFixed(2) : '0.00'

      // Simpan ID diagnosis untuk navigasi ke halaman detail
      diagnosisId.value = result.id

      // Ubah menjadi hanya 2 kategori risiko: Low Risk (<=49%) dan High Risk (>=50%)
      const percentage = parseFloat(resultPercentage.value)
      predictionResult.value = percentage >= 50 ? 'high' : 'low'

      console.log(
        `Diagnosis result: ${percentage}% risk, category: ${predictionResult.value}, ID: ${diagnosisId.value}`,
      )

      // Save to history if we have a valid result
      if (result && result.id) {
        await historyService.cacheHistoryForOffline([result])
        console.log('Diagnosis saved to history cache')
      }
    } catch (apiError) {
      console.error('API error:', apiError)

      // Better error messaging based on error type
      if (apiError.data && apiError.data.message) {
        alert(`Error: ${apiError.data.message}`)
      } else if (apiError.message) {
        alert(`Error: ${apiError.message}`)
      } else {
        alert('Error communicating with diagnosis service. Please try again.')
      }

      // Reset loading state and hide result
      isLoading.value = false
      showResult.value = false
      return // Stop execution here after handling error
    }

    isLoading.value = false
  } catch (error) {
    console.error('Error submitting diagnosis:', error)
    isLoading.value = false
    alert('An error occurred while processing your request. Please try again.')
  }
}

// Helper functions to map numeric codes back to text values

// Function to validate the form
const validateForm = () => {
  // Check for required fields
  if (!diagnosisForm.value.patientId) {
    alert('Please select a patient before proceeding')
    return false
  }

  // Check that all form fields have values
  const requiredFields = [
    'age',
    'sex',
    'cp',
    'trestbps',
    'chol',
    'fbs',
    'restecg',
    'thalach',
    'exang',
    'oldpeak',
    'slope',
    'ca',
    'thal',
  ]

  for (const field of requiredFields) {
    const val = diagnosisForm.value[field]
    if (val === '' || val === null || val === undefined) {
      return false
    }
  }

  return true
}

// Function to go to next step
const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
    window.scrollTo(0, 0) // Scroll to top for better UX
  }
}

// Function to go to previous step
const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    window.scrollTo(0, 0) // Scroll to top for better UX
  }
}

// Function to navigate to the detailed diagnosis report
const viewDetailedReport = () => {
  if (diagnosisId.value) {
    console.log(`Navigating to detailed report for diagnosis ID: ${diagnosisId.value}`)
    router.push({
      path: '/result-admin',
      query: { id: diagnosisId.value },
    })
  } else {
    console.error('No diagnosis ID available for detailed report')
    alert('Error: Diagnosis ID not found. Please try again.')
  }
}

// hasValue: 0 dan string kosong dibedakan — 0 dianggap valid, string kosong tidak
const hasValue = (val) => val !== '' && val !== null && val !== undefined

// Function to check if step is complete
const isStepComplete = (step) => {
  if (step === 1) {
    return (
      hasValue(selectedPatient.value.id) &&
      hasValue(diagnosisForm.value.age) &&
      hasValue(diagnosisForm.value.sex)
    )
  } else if (step === 2) {
    return (
      hasValue(diagnosisForm.value.cp) &&
      hasValue(diagnosisForm.value.trestbps) &&
      hasValue(diagnosisForm.value.chol) &&
      hasValue(diagnosisForm.value.fbs) &&
      hasValue(diagnosisForm.value.restecg) &&
      hasValue(diagnosisForm.value.thalach)
    )
  } else if (step === 3) {
    return (
      hasValue(diagnosisForm.value.exang) &&
      hasValue(diagnosisForm.value.oldpeak) &&
      hasValue(diagnosisForm.value.slope) &&
      hasValue(diagnosisForm.value.ca) &&
      hasValue(diagnosisForm.value.thal)
    )
  }
  return false
}

// Prefetch patients data
const prefetchPatients = async () => {
  try {
    console.log('Prefetching patients data for offline use')
    const patients = await patientService.getAllPatients(1, 100)

    if (patients && patients.length > 0) {
      patientService.cachePatients(patients)
      console.log(`Prefetched and cached ${patients.length} patients`)
    }
  } catch (error) {
    console.error('Error prefetching patients:', error)
    // Silent fail - will fall back to online search when needed
  }
}

// Lifecycle hooks
onMounted(() => {
  prefetchPatients()
})
</script>

<template>
  <div class="diagnose-page mt-16">
    <!-- Preload critical images -->
    <ImagePreloader
      :images="[
        '/images/picu.jpg',
        'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      ]"
    />

    <!-- Added mt-16 for navbar spacing -->
    <!-- Hero Banner with Medical Background -->
    <section class="relative">
      <LazyBackground
        class="absolute inset-0"
        src="/images/picu.jpg"
        placeholder="/images/loading-placeholder.svg"
        :style="{ filter: 'brightness(0.4)' }"
      ></LazyBackground>
      <div class="relative z-10 py-20 px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Cardiovascular Diagnosis</h1>
        <p class="text-xl text-blue-100 max-w-3xl mx-auto">
          Complete the form below to assess cardiovascular health risk factors
        </p>
      </div>
    </section>

    <!-- Main Content with Form -->
    <div class="bg-gradient-to-b from-blue-700 to-indigo-900 py-10 px-4 min-h-screen">
      <div class="max-w-4xl mx-auto">
        <!-- Progress Steps -->
        <div class="mb-8">
          <div class="flex justify-between items-center w-full mb-4">
            <div v-for="step in totalSteps" :key="step" class="flex flex-col items-center w-1/3">
              <div
                :class="`h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold border-2 ${
                  currentStep === step
                    ? 'bg-blue-500 text-white border-white'
                    : currentStep > step || isStepComplete(step)
                      ? 'bg-green-500 text-white border-white'
                      : 'bg-white/20 text-white/70 border-white/50'
                }`"
              >
                <span v-if="currentStep > step || isStepComplete(step)">✓</span>
                <span v-else>{{ step }}</span>
              </div>
              <div class="mt-2 text-center text-white text-sm">
                <span v-if="step === 1">Patient Info</span>
                <span v-else-if="step === 2">Vital Signs</span>
                <span v-else-if="step === 3">Cardiac Data</span>
              </div>
            </div>
          </div>
          <div class="relative h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              class="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
              :style="`width: ${((currentStep - 1) / (totalSteps - 1)) * 100}%`"
            ></div>
          </div>
        </div>

        <!-- Form Card -->
        <div class="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
          <!-- Step 1: Patient Information -->
          <div v-if="currentStep === 1" class="p-6 md:p-8">
            <h2 class="text-2xl font-bold text-white mb-6">Patient Information</h2>
            <div class="space-y-5">
              <div>
                <label class="block text-white mb-2" for="patientName">Patient Information</label>
                <PatientSearchSelector
                  v-model="selectedPatient"
                  @update:modelValue="updatePatientInfo"
                />
                <div
                  v-if="diagnosisForm.patientId"
                  class="mt-2 p-3 bg-white/10 rounded-lg border border-white/20"
                >
                  <div class="text-white/80 text-sm">
                    <span class="font-semibold text-white">Selected Patient:</span>
                  </div>
                  <div class="text-white/80 text-sm mt-1">
                    <span class="inline-block w-24">Patient ID:</span>
                    <span class="font-semibold text-white">{{ diagnosisForm.patientId }}</span>
                  </div>
                  <div class="text-white/80 text-sm mt-1">
                    <span class="inline-block w-24">Name:</span>
                    <span class="font-semibold text-white">{{ diagnosisForm.patientName }}</span>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-white mb-2" for="age">Age (years)</label>
                  <input
                    id="age"
                    v-model="diagnosisForm.age"
                    type="number"
                    min="1"
                    max="120"
                    class="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Enter age"
                  />
                </div>

                <div>
                  <label class="block text-white mb-2" for="sex">Sex</label>
                  <select
                    id="sex"
                    v-model="diagnosisForm.sex"
                    class="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="" disabled selected>Select gender</option>
                    <option v-for="option in sexOptions" :key="option.value" :value="option.value">
                      {{ option.text }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div class="mt-8 flex justify-end">
              <button
                @click="nextStep"
                class="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-200 flex items-center"
                :disabled="!isStepComplete(1)"
                :class="{ 'opacity-50 cursor-not-allowed': !isStepComplete(1) }"
              >
                Next Step
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 ml-2"
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

          <!-- Step 2: Vital Signs -->
          <div v-if="currentStep === 2" class="p-6 md:p-8">
            <h2 class="text-2xl font-bold text-white mb-6">Vital Signs & Baseline Measurements</h2>

            <div class="space-y-5">
              <div>
                <label class="block text-white mb-2" for="chestPainType">Chest Pain Type</label>
                <select
                  id="chestPainType"
                  v-model="diagnosisForm.cp"
                  class="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="" disabled selected>Select chest pain type</option>
                  <option
                    v-for="option in chestPainTypeOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.text }}
                  </option>
                </select>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-white mb-2" for="bloodPressure"
                    >Resting Blood Pressure (mm Hg)</label
                  >
                  <input
                    id="bloodPressure"
                    v-model="diagnosisForm.trestbps"
                    type="number"
                    min="80"
                    max="200"
                    class="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Enter resting BP"
                  />
                </div>

                <div>
                  <label class="block text-white mb-2" for="cholesterol"
                    >Serum Cholesterol (mg/dl)</label
                  >
                  <input
                    id="cholesterol"
                    v-model="diagnosisForm.chol"
                    type="number"
                    min="100"
                    max="600"
                    class="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Enter cholesterol level"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-white mb-2" for="fastingBloodSugar"
                    >Fasting Blood Sugar</label
                  >
                  <select
                    id="fastingBloodSugar"
                    v-model="diagnosisForm.fbs"
                    class="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="" disabled selected>Select blood sugar status</option>
                    <option
                      v-for="option in fastingBloodSugarOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.text }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-white mb-2" for="restingEcg">Resting ECG Results</label>
                  <select
                    id="restingEcg"
                    v-model="diagnosisForm.restecg"
                    class="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="" disabled selected>Select ECG results</option>
                    <option
                      v-for="option in restingECGOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.text }}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-white mb-2" for="maxHeartRate"
                  >Maximum Heart Rate (bpm)</label
                >
                <input
                  id="maxHeartRate"
                  v-model="diagnosisForm.thalach"
                  type="number"
                  min="60"
                  max="220"
                  class="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter maximum heart rate"
                />
              </div>
            </div>

            <div class="mt-8 flex justify-between">
              <button
                @click="prevStep"
                class="px-6 py-3 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-600 transition-all duration-200 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
                Previous
              </button>
              <button
                @click="nextStep"
                class="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-200 flex items-center"
                :disabled="!isStepComplete(2)"
                :class="{ 'opacity-50 cursor-not-allowed': !isStepComplete(2) }"
              >
                Next Step
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 ml-2"
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

          <!-- Step 3: Cardiac Data -->
          <div v-if="currentStep === 3" class="p-6 md:p-8">
            <h2 class="text-2xl font-bold text-white mb-6">Additional Cardiac Data</h2>

            <div class="space-y-5">
              <div>
                <label class="block text-white mb-2" for="exerciseAngina"
                  >Exercise Induced Angina</label
                >
                <select
                  id="exerciseAngina"
                  v-model="diagnosisForm.exang"
                  class="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="" disabled selected>Select angina status</option>
                  <option v-for="option in yesNoOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-white mb-2" for="stDepression"
                  >ST Depression Induced by Exercise</label
                >
                <input
                  id="stDepression"
                  v-model="diagnosisForm.oldpeak"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  class="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter ST depression value"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-white mb-2" for="stSlope">ST Slope</label>
                  <select
                    id="stSlope"
                    v-model="diagnosisForm.slope"
                    class="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="" disabled selected>Select ST slope</option>
                    <option
                      v-for="option in stSlopeOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.text }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-white mb-2" for="vessels">Number of Major Vessels</label>
                  <select
                    id="vessels"
                    v-model="diagnosisForm.ca"
                    class="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="" disabled selected>Select number of vessels</option>
                    <option
                      v-for="option in numberOfVesselsOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.text }}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-white mb-2" for="thalassemia">Thalassemia</label>
                <select
                  id="thalassemia"
                  v-model="diagnosisForm.thal"
                  class="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="" disabled selected>Select thalassemia status</option>
                  <option
                    v-for="option in thallassemiaOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.text }}
                  </option>
                </select>
              </div>
            </div>

            <div class="mt-8 flex justify-between">
              <button
                @click="prevStep"
                class="px-6 py-3 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-600 transition-all duration-200 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
                Previous
              </button>
              <button
                @click="handleSubmit"
                class="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-all duration-200 flex items-center"
                :disabled="!isStepComplete(3)"
                :class="{ 'opacity-50 cursor-not-allowed': !isStepComplete(3) }"
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Submit Diagnosis
              </button>
            </div>
          </div>
        </div>

        <!-- Result Modal -->
        <div v-if="showResult" class="mt-10">
          <div v-if="isLoading" class="text-center py-10">
            <div
              class="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"
            ></div>
            <p class="mt-4 text-white text-lg">Analyzing patient data...</p>
          </div>

          <div
            v-else
            class="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden p-6 md:p-8"
          >
            <div class="flex flex-col items-center justify-center text-center">
              <div
                :class="`h-24 w-24 rounded-full flex items-center justify-center text-2xl
                ${predictionResult === 'high' ? 'bg-red-500' : 'bg-green-500'} text-white mb-4`"
              >
                {{ resultPercentage }}%
              </div>

              <h2 class="text-3xl font-bold text-white mb-2">
                {{ predictionResult === 'high' ? 'High Risk' : 'Low Risk' }}
              </h2>

              <p class="text-white/80 mb-6">
                Based on the patient's information and clinical data, the risk of cardiovascular
                disease is
                <strong>{{ resultPercentage }}%</strong>.
              </p>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md">
                <button
                  @click="viewDetailedReport"
                  class="px-5 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all"
                >
                  View Detailed Report
                </button>
                <button
                  @click="((showResult = false), (currentStep = 1))"
                  class="px-5 py-3 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-600 transition-all"
                >
                  Start New Diagnosis
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Medical Imagery -->
        <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          <LazyImage
            src="https://images.unsplash.com/photo-1583324113626-70df0f4deaab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            alt="Hospital cardiac care"
            class="rounded-lg shadow-lg w-full h-32 object-cover"
            loadingClass="animate-pulse bg-blue-200"
            placeholder="/images/loading-placeholder.svg"
            errorPlaceholder="/images/error-placeholder.svg"
          />
          <LazyImage
            src="https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            alt="Hospital corridor"
            class="rounded-lg shadow-lg w-full h-32 object-cover"
            loadingClass="animate-pulse bg-blue-200"
            placeholder="/images/loading-placeholder.svg"
            errorPlaceholder="/images/error-placeholder.svg"
          />
          <LazyImage
            src="https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            alt="Heart monitoring"
            class="rounded-lg shadow-lg w-full h-32 object-cover"
            loadingClass="animate-pulse bg-blue-200"
            placeholder="/images/loading-placeholder.svg"
            errorPlaceholder="/images/error-placeholder.svg"
          />
          <LazyImage
            src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            alt="Hospital reception"
            class="rounded-lg shadow-lg w-full h-32 object-cover"
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
.diagnose-page {
  min-height: 100vh;
}

/* Animated progress bar */
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
</style>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import FooterComponent from '@/components/Footer-component.vue'

const router = useRouter()

defineOptions({
  name: 'DiagnosePageAdmin',
})

// Form data
const diagnosisForm = ref({
  patientName: '',
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

// Form options - Values match those needed by the ML model
const sexOptions = [
  { text: 'Female', value: '0' },
  { text: 'Male', value: '1' },
]

const chestPainTypeOptions = [
  { text: 'Typical Angina', value: '0' },
  { text: 'Atypical Angina', value: '1' },
  { text: 'Non-anginal Pain', value: '2' },
  { text: 'Asymptomatic', value: '3' },
]

const stSlopeOptions = [
  { text: 'Upsloping', value: '0' },
  { text: 'Flat', value: '1' },
  { text: 'Downsloping', value: '2' },
]

const restingECGOptions = [
  { text: 'Normal', value: '0' },
  { text: 'ST-T Wave Abnormality', value: '1' },
  { text: 'Left Ventricular Hypertrophy', value: '2' },
]

const numberOfVesselsOptions = [
  { text: '0', value: '0' },
  { text: '1', value: '1' },
  { text: '2', value: '2' },
  { text: '3', value: '3' },
  { text: '4', value: '4' },
]

const fastingBloodSugarOptions = [
  { text: 'No (< 120 mg/dl)', value: '0' },
  { text: 'Yes (> 120 mg/dl)', value: '1' },
]

const thallassemiaOptions = [
  { text: 'Normal', value: '1' },
  { text: 'Fixed Defect', value: '2' },
  { text: 'Reversible Defect', value: '3' },
]

const yesNoOptions = [
  { text: 'No', value: '0' },
  { text: 'Yes', value: '1' },
]

// Refs for the result
const isLoading = ref(false)
const predictionResult = ref(null)
const resultPercentage = ref(null)
const showResult = ref(false)

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

    // Convert values from the form to appropriate types for the ML model
    const numericFormData = {
      age: parseFloat(diagnosisForm.value.age),
      sex: parseFloat(diagnosisForm.value.sex),
      cp: parseFloat(diagnosisForm.value.cp),
      trestbps: parseFloat(diagnosisForm.value.trestbps),
      chol: parseFloat(diagnosisForm.value.chol),
      fbs: parseFloat(diagnosisForm.value.fbs),
      restecg: parseFloat(diagnosisForm.value.restecg),
      thalach: parseFloat(diagnosisForm.value.thalach),
      exang: parseFloat(diagnosisForm.value.exang),
      oldpeak: parseFloat(diagnosisForm.value.oldpeak),
      slope: parseFloat(diagnosisForm.value.slope),
      ca: parseFloat(diagnosisForm.value.ca),
      thal: parseFloat(diagnosisForm.value.thal),
    }

    // Prepare data for API - map numeric codes to human-readable values for backend
    const apiFormData = {
      patientName: diagnosisForm.value.patientName,
      age: numericFormData.age,
      sex: numericFormData.sex === 1 ? 'Male' : 'Female',
      chestPainType: getChestPainTypeText(numericFormData.cp),
      restingBloodPressure: numericFormData.trestbps,
      serumCholesterol: numericFormData.chol,
      fastingBloodSugar: numericFormData.fbs === 1 ? '>120 mg/dl' : '<120 mg/dl',
      restingEcgResults: getEcgResultsText(numericFormData.restecg),
      maxHeartRate: numericFormData.thalach,
      exerciseInducedAngina: numericFormData.exang === 1 ? 'Yes' : 'No',
      stDepression: numericFormData.oldpeak,
      stSlope: getStSlopeText(numericFormData.slope),
      numberOfMajorVessels: numericFormData.ca.toString(),
      thalassemia: getThalassemiaText(numericFormData.thal),
    }

    console.log('Diagnosis form submitted to API:', apiFormData)

    try {
      // In a real implementation, this would call your actual API
      // const response = await fetch('/api/diagnoses', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(apiFormData)
      // })
      //
      // if (!response.ok) {
      //   throw new Error(`API error: ${response.status}`)
      // }
      //
      // const result = await response.json()
      // resultPercentage.value = result.data.resultPercentage.toFixed(2)
      // predictionResult.value = result.data.cardiovascularRisk.toLowerCase()

      // For demo purposes, simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate network delay

      // Use deterministic prediction based on age and cholesterol for demo
      const riskScore =
        (numericFormData.age > 50 ? 30 : 10) +
        (numericFormData.chol > 240 ? 20 : 5) +
        (numericFormData.exang === 1 ? 15 : 0)

      const simulatedProbability = riskScore / 100
      resultPercentage.value = (simulatedProbability * 100).toFixed(2)
      predictionResult.value = simulatedProbability >= 0.5 ? 'high' : 'low'
    } catch (apiError) {
      console.error('API error:', apiError)
      alert('Error communicating with diagnosis service. Please try again.')
    }

    isLoading.value = false
  } catch (error) {
    console.error('Error submitting diagnosis:', error)
    isLoading.value = false
    alert('An error occurred while processing your request. Please try again.')
  }
}

// Helper functions to map numeric codes back to text values
function getChestPainTypeText(value) {
  const option = chestPainTypeOptions.find((opt) => opt.value === value.toString())
  return option ? option.text : 'Unknown'
}

function getEcgResultsText(value) {
  const option = restingECGOptions.find((opt) => opt.value === value.toString())
  return option ? option.text : 'Unknown'
}

function getStSlopeText(value) {
  const option = stSlopeOptions.find((opt) => opt.value === value.toString())
  return option ? option.text : 'Unknown'
}

function getThalassemiaText(value) {
  const option = thallassemiaOptions.find((opt) => opt.value === value.toString())
  return option ? option.text : 'Unknown'
}

// Function to validate the form
const validateForm = () => {
  // Basic validation - check if all fields have values
  return Object.values(diagnosisForm.value).every((val) => val !== '')
}

// Current step for multi-step form
const currentStep = ref(1)
const totalSteps = 3

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

// Function to check if step is complete
const isStepComplete = (step) => {
  if (step === 1) {
    return (
      !!diagnosisForm.value.patientName && !!diagnosisForm.value.age && !!diagnosisForm.value.sex
    )
  } else if (step === 2) {
    return (
      !!diagnosisForm.value.cp &&
      !!diagnosisForm.value.trestbps &&
      !!diagnosisForm.value.chol &&
      !!diagnosisForm.value.fbs &&
      !!diagnosisForm.value.restecg &&
      !!diagnosisForm.value.thalach
    )
  } else if (step === 3) {
    return (
      !!diagnosisForm.value.exang &&
      !!diagnosisForm.value.oldpeak &&
      !!diagnosisForm.value.slope &&
      !!diagnosisForm.value.ca &&
      !!diagnosisForm.value.thal
    )
  }
  return false
}
</script>

<template>
  <div class="diagnose-page mt-16">
    <!-- Added mt-16 for navbar spacing -->
    <!-- Hero Banner with Medical Background -->
    <section class="relative">
      <div
        class="absolute inset-0 bg-cover bg-center"
        style="background-image: url('/images/picu.jpg'); filter: brightness(0.4)"
      ></div>
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
                <label class="block text-white mb-2" for="patientName">Patient Name</label>
                <input
                  id="patientName"
                  v-model="diagnosisForm.patientName"
                  type="text"
                  class="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter patient's full name"
                />
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
                ${
                  predictionResult === 'high'
                    ? 'bg-red-500'
                    : predictionResult === 'moderate'
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                } text-white mb-4`"
              >
                {{ resultPercentage }}%
              </div>

              <h2 class="text-3xl font-bold text-white mb-2">
                {{
                  predictionResult === 'high'
                    ? 'High Risk'
                    : predictionResult === 'moderate'
                      ? 'Moderate Risk'
                      : 'Low Risk'
                }}
              </h2>

              <p class="text-white/80 mb-6">
                Based on the patient's information and clinical data, the risk of cardiovascular
                disease is
                <strong>{{ resultPercentage }}%</strong>.
              </p>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md">
                <button
                  @click="router.push('/result-admin')"
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
          <img
            src="https://images.unsplash.com/photo-1583324113626-70df0f4deaab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            alt="Hospital cardiac care"
            class="rounded-lg shadow-lg w-full h-32 object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            alt="Hospital corridor"
            class="rounded-lg shadow-lg w-full h-32 object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            alt="Heart monitoring"
            class="rounded-lg shadow-lg w-full h-32 object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            alt="Hospital reception"
            class="rounded-lg shadow-lg w-full h-32 object-cover"
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

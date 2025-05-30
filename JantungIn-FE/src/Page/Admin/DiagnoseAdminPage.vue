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

// Helper functions to convert numeric codes to text values for the API
const getChestPainTypeText = (code) => {
  switch (parseInt(code)) {
    case 0:
      return 'Typical Angina'
    case 1:
      return 'Atypical Angina'
    case 2:
      return 'Non-anginal Pain'
    case 3:
      return 'Asymptomatic'
    default:
      return 'Unknown'
  }
}

const getEcgResultsText = (code) => {
  switch (parseInt(code)) {
    case 0:
      return 'Normal'
    case 1:
      return 'ST-T Wave Abnormality'
    case 2:
      return 'Left Ventricular Hypertrophy'
    default:
      return 'Unknown'
  }
}

const getStSlopeText = (code) => {
  switch (parseInt(code)) {
    case 0:
      return 'Upsloping'
    case 1:
      return 'Flat'
    case 2:
      return 'Downsloping'
    default:
      return 'Unknown'
  }
}

const getThalassemiaText = (code) => {
  switch (parseInt(code)) {
    case 3:
      return 'Normal'
    case 6:
      return 'Fixed Defect'
    case 7:
      return 'Reversible Defect'
    default:
      return 'Unknown'
  }
}

// Simple validation function
const validateForm = () => {
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

  return requiredFields.every((field) => {
    const value = diagnosisForm.value[field]
    return value !== null && value !== undefined && value !== ''
  })
}

// Function to navigate to detailed results page
const viewDetailedResults = () => {
  router.push({
    name: 'resultPage',
    params: {
      patientName: diagnosisForm.value.patientName,
      resultPercentage: resultPercentage.value,
      predictionResult: predictionResult.value,
    },
  })
}
</script>

<template>
  <div class="diagnose-page">
    <div
      class="form-container bg-gradient-to-b from-blue-500 via-blue-600 to-indigo-700 py-12 px-4"
    >
      <div class="container mx-auto max-w-5xl">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Patient Name -->
          <div class="form-group">
            <label for="patientName" class="block text-white text-sm font-medium mb-2"
              >Patient Name</label
            >
            <input
              type="text"
              id="patientName"
              v-model="diagnosisForm.patientName"
              class="w-full px-4 py-2 rounded-md focus:outline-none"
              placeholder="Enter patient name"
            />
          </div>

          <!-- Age -->
          <div class="form-group">
            <label for="age" class="block text-white text-sm font-medium mb-2">Age</label>
            <input
              type="number"
              id="age"
              v-model="diagnosisForm.age"
              class="w-full px-4 py-2 rounded-md focus:outline-none"
              placeholder="Enter age"
            />
          </div>

          <!-- Two Column Layout -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Sex -->
            <div class="form-group">
              <label for="sex" class="block text-white text-sm font-medium mb-2">Sex</label>
              <select
                id="sex"
                v-model="diagnosisForm.sex"
                class="w-full px-4 py-2 rounded-md focus:outline-none appearance-none bg-white"
              >
                <option value="" disabled selected>Select sex</option>
                <option v-for="option in sexOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <!-- Exercise Induced Angina -->
            <div class="form-group">
              <label for="exang" class="block text-white text-sm font-medium mb-2"
                >Exercise Induced Angina</label
              >
              <select
                id="exang"
                v-model="diagnosisForm.exang"
                class="w-full px-4 py-2 rounded-md focus:outline-none appearance-none bg-white"
              >
                <option value="" disabled selected>Select option</option>
                <option v-for="option in yesNoOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <!-- Chest Pain Type -->
            <div class="form-group">
              <label for="cp" class="block text-white text-sm font-medium mb-2"
                >Chest Pain Type</label
              >
              <select
                id="cp"
                v-model="diagnosisForm.cp"
                class="w-full px-4 py-2 rounded-md focus:outline-none appearance-none bg-white"
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

            <!-- ST Slope -->
            <div class="form-group">
              <label for="slope" class="block text-white text-sm font-medium mb-2"
                >Slope of Peak Exercise ST Segment</label
              >
              <select
                id="slope"
                v-model="diagnosisForm.slope"
                class="w-full px-4 py-2 rounded-md focus:outline-none appearance-none bg-white"
              >
                <option value="" disabled selected>Select ST slope</option>
                <option v-for="option in stSlopeOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <!-- Resting ECG Results -->
            <div class="form-group">
              <label for="restecg" class="block text-white text-sm font-medium mb-2"
                >Resting ECG Results</label
              >
              <select
                id="restecg"
                v-model="diagnosisForm.restecg"
                class="w-full px-4 py-2 rounded-md focus:outline-none appearance-none bg-white"
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

            <!-- Number of Major Vessels -->
            <div class="form-group">
              <label for="ca" class="block text-white text-sm font-medium mb-2"
                >Number of Major Vessels</label
              >
              <select
                id="ca"
                v-model="diagnosisForm.ca"
                class="w-full px-4 py-2 rounded-md focus:outline-none appearance-none bg-white"
              >
                <option value="" disabled selected>Select number</option>
                <option
                  v-for="option in numberOfVesselsOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.text }}
                </option>
              </select>
            </div>

            <!-- Fasting Blood Sugar -->
            <div class="form-group">
              <label for="fbs" class="block text-white text-sm font-medium mb-2"
                >Fasting Blood Sugar > 120mg/dl</label
              >
              <select
                id="fbs"
                v-model="diagnosisForm.fbs"
                class="w-full px-4 py-2 rounded-md focus:outline-none appearance-none bg-white"
              >
                <option value="" disabled selected>Select option</option>
                <option
                  v-for="option in fastingBloodSugarOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.text }}
                </option>
              </select>
            </div>

            <!-- Thallassemia -->
            <div class="form-group">
              <label for="thal" class="block text-white text-sm font-medium mb-2"
                >Thalassemia</label
              >
              <select
                id="thal"
                v-model="diagnosisForm.thal"
                class="w-full px-4 py-2 rounded-md focus:outline-none appearance-none bg-white"
              >
                <option value="" disabled selected>Select option</option>
                <option
                  v-for="option in thallassemiaOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.text }}
                </option>
              </select>
            </div>

            <!-- Resting Blood Pressure -->
            <div class="form-group">
              <label for="trestbps" class="block text-white text-sm font-medium mb-2"
                >Resting Blood Pressure (mm/Hg)</label
              >
              <input
                type="number"
                id="trestbps"
                v-model="diagnosisForm.trestbps"
                class="w-full px-4 py-2 rounded-md focus:outline-none"
                min="50"
                max="300"
                placeholder="Enter blood pressure (mm/Hg)"
              />
            </div>

            <!-- Serum Cholesterol -->
            <div class="form-group">
              <label for="chol" class="block text-white text-sm font-medium mb-2"
                >Serum Cholesterol (mg/dl)</label
              >
              <input
                type="number"
                id="chol"
                v-model="diagnosisForm.chol"
                class="w-full px-4 py-2 rounded-md focus:outline-none"
                min="50"
                max="600"
                placeholder="Enter cholesterol (mg/dl)"
              />
            </div>

            <!-- Maximum Heart Rate -->
            <div class="form-group">
              <label for="thalach" class="block text-white text-sm font-medium mb-2"
                >Maximum Heart Rate Achieved</label
              >
              <input
                type="number"
                id="thalach"
                v-model="diagnosisForm.thalach"
                class="w-full px-4 py-2 rounded-md focus:outline-none"
                min="50"
                max="250"
                placeholder="Enter maximum heart rate"
              />
            </div>

            <!-- ST Depression -->
            <div class="form-group">
              <label for="oldpeak" class="block text-white text-sm font-medium mb-2"
                >ST Depression</label
              >
              <input
                type="number"
                id="oldpeak"
                v-model="diagnosisForm.oldpeak"
                class="w-full px-4 py-2 rounded-md focus:outline-none"
                step="0.1"
                min="0"
                max="10"
                placeholder="Enter ST depression value"
              />
            </div>
          </div>
          <!-- Submit Button -->
          <div class="mt-10 text-center">
            <button
              type="submit"
              class="bg-gradient-to-b from-blue-500 via-blue-600 to-indigo-700 text-white py-3 px-8 rounded-full font-medium hover:bg-blue-600 transition-colors border border-[#002d8d]"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Processing...</span>
              <span v-else>Check it now!</span>
            </button>
          </div>
          <!-- Results Section (shown after submission) -->
          <div v-if="showResult" class="mt-10 bg-white p-6 rounded-lg shadow-md">
            <div v-if="isLoading" class="text-center">
              <div class="spinner mb-4"></div>
              <p class="text-lg">Analyzing patient data...</p>
            </div>

            <div v-else class="result-container">
              <!-- High Risk Result -->
              <div v-if="predictionResult === 'high'" class="text-center">
                <div class="flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-12 w-12 text-red-600 mr-3"
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
                  <h2 class="text-3xl font-bold text-red-600">HIGH RISK</h2>
                </div>

                <div class="mt-4 text-lg">
                  <p class="text-2xl font-semibold">Risk Score: {{ resultPercentage }}%</p>
                  <p class="mt-4 mb-1">
                    {{ diagnosisForm.patientName || 'Patient' }} has a high probability of heart
                    disease.
                  </p>
                  <p class="font-semibold">Recommended Actions:</p>
                  <ul class="text-left mt-2 max-w-md mx-auto">
                    <li class="mb-1">• Consult with a cardiologist immediately</li>
                    <li class="mb-1">• Schedule additional heart tests (ECG, stress test, etc.)</li>
                    <li class="mb-1">• Monitor blood pressure and heart rate regularly</li>
                    <li>• Follow a heart-healthy diet and exercise plan</li>
                  </ul>
                </div>
              </div>

              <!-- Medium Risk Result -->
              <div v-else-if="predictionResult === 'medium'" class="text-center">
                <div class="flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-12 w-12 text-yellow-500 mr-3"
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
                  <h2 class="text-3xl font-bold text-yellow-500">MEDIUM RISK</h2>
                </div>

                <div class="mt-4 text-lg">
                  <p class="text-2xl font-semibold">Risk Score: {{ resultPercentage }}%</p>
                  <p class="mt-4 mb-1">
                    {{ diagnosisForm.patientName || 'Patient' }} has a moderate risk of heart
                    disease.
                  </p>
                  <p class="font-semibold">Recommended Actions:</p>
                  <ul class="text-left mt-2 max-w-md mx-auto">
                    <li class="mb-1">• Schedule a follow-up with your healthcare provider</li>
                    <li class="mb-1">• Consider lifestyle modifications to reduce risk factors</li>
                    <li class="mb-1">• Monitor blood pressure and cholesterol regularly</li>
                    <li>• Increase physical activity and maintain a healthy diet</li>
                  </ul>
                </div>
              </div>

              <!-- Low Risk Result -->
              <div v-else-if="predictionResult === 'low'" class="text-center">
                <div class="flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-12 w-12 text-green-600 mr-3"
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
                  <h2 class="text-3xl font-bold text-green-600">LOW RISK</h2>
                </div>

                <div class="mt-4 text-lg">
                  <p class="text-2xl font-semibold">Risk Score: {{ resultPercentage }}%</p>
                  <p class="mt-4 mb-1">
                    {{ diagnosisForm.patientName || 'Patient' }} has a low probability of heart
                    disease.
                  </p>
                  <p class="font-semibold">Recommended Actions:</p>
                  <ul class="text-left mt-2 max-w-md mx-auto">
                    <li class="mb-1">• Continue with regular annual check-ups</li>
                    <li class="mb-1">• Maintain a healthy lifestyle</li>
                    <li class="mb-1">• Stay physically active</li>
                    <li>• Follow a heart-healthy diet</li>
                  </ul>
                </div>
              </div>

              <div
                class="mt-6 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4"
              >
                <button
                  @click="viewDetailedResults"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full text-sm transition-colors"
                >
                  See Details
                </button>

                <button
                  @click="showResult = false"
                  class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-full text-sm transition-colors"
                >
                  Close Results
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <FooterComponent />
  </div>
</template>

<style scoped>
.diagnose-page {
  font-family: 'Arial', sans-serif;
}

.form-container {
  background-color: #4f46e5; /* Indigo-600 */
  margin-top: -37px; /* Menghilangkan gap kecil antara navbar dan form container */
}

input,
select {
  height: 45px;
}

button {
  background-color: #3b82f6; /* Blue-500 */
}

button:hover {
  background-color: #2563eb; /* Blue-600 */
}

.text-primary-dark {
  color: #3b82f6; /* Blue-600 */
}

.bg-primary-bg {
  background-color: #4f46e5; /* Indigo-600 */
}

.newsletter-title {
  font-family: 'Times New Roman', Times, serif;
  font-weight: normal;
  letter-spacing: 0.5px;
  color: #333;
  font-size: 1.75rem;
}

/* Arrow styling for select boxes */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

/* Loading spinner animation */
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #3b82f6;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

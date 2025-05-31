<script setup>
import { ref, onMounted, computed } from 'vue'
import FooterComponent from '@/components/Footer-component.vue'

defineOptions({
  name: 'HistoryPage',
})

// Diagnoses state
const patientNik = ref('23524939202941') // This would be the logged-in user's NIK
const diagnoses = ref([])
const hasHistory = ref(false)
const isLoading = ref(true)
const selectedDiagnosis = ref(null)

// Load diagnoses from localStorage
onMounted(() => {
  setTimeout(() => {
    try {
      const userHistory = JSON.parse(localStorage.getItem('userHistory') || '{}')
      if (userHistory[patientNik.value] && userHistory[patientNik.value].length > 0) {
        diagnoses.value = userHistory[patientNik.value]
        hasHistory.value = true
      }
    } catch (error) {
      console.error('Error loading diagnosis history:', error)
    } finally {
      isLoading.value = false
    }
  }, 500) // Simulate loading delay
})

// Helper functions
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

const viewDiagnosisDetails = (diagnosis) => {
  selectedDiagnosis.value = diagnosis
}

const goBack = () => {
  selectedDiagnosis.value = null
}
</script>

<template>
  <div class="history-page">
    <!-- Main section with blue background -->
    <div class="bg-gradient-to-b from-blue-500 via-blue-600 to-indigo-700 min-h-screen">
      <div class="max-w-3xl mx-auto py-8 px-4">
        <!-- Page Title -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-white text-3xl font-bold">
            {{ selectedDiagnosis ? 'Diagnosis Details' : 'Your Health Records' }}
          </h1>

          <!-- Back button -->
          <button
            v-if="selectedDiagnosis"
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
            <p class="text-gray-700 text-lg">Loading your health records...</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!hasHistory" class="bg-white rounded-lg shadow-md p-8 text-center">
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
            <p class="text-gray-600 mb-4">You don't have any diagnosis records yet.</p>
          </div>
        </div>

        <!-- List of Diagnoses -->
        <div v-else-if="!selectedDiagnosis" class="space-y-4">
          <div
            v-for="(diagnosis, index) in diagnoses"
            :key="index"
            @click="viewDiagnosisDetails(diagnosis)"
            class="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-all"
          >
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-500">{{ formatDate(diagnosis.sentAt || diagnosis.savedAt) }}</div>
              <div
                :class="{
                  'bg-green-100 text-green-800': diagnosis.resultPercentage < 20,
                  'bg-yellow-100 text-yellow-800': diagnosis.resultPercentage >= 20 && diagnosis.resultPercentage < 50,
                  'bg-red-100 text-red-800': diagnosis.resultPercentage >= 50
                }"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ getStatusText(diagnosis.resultPercentage) }} - {{ diagnosis.resultPercentage }}%
              </div>
            </div>

            <div class="mt-2">
              <div class="font-semibold text-gray-800">Heart Health Assessment</div>
              <div class="flex items-center mt-2">
                <div class="flex-grow h-2 bg-gray-200 rounded-full">
                  <div
                    :class="getStatusClass(diagnosis.resultPercentage)"
                    class="h-2 rounded-full"
                    :style="{ width: `${diagnosis.resultPercentage}%` }"
                  ></div>
                </div>
                <span class="text-xs ml-2 font-medium">{{ diagnosis.resultPercentage }}%</span>
              </div>
            </div>

            <div class="flex justify-end mt-3">
              <button class="text-blue-600 text-sm flex items-center">
                View Details
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
          </div>
        </div>

        <!-- Selected Diagnosis Detail View -->
        <div v-else class="bg-white rounded-lg shadow-md p-6">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 class="text-xl font-semibold mb-1">Diagnosis Report</h2>
              <p class="text-gray-500">{{ formatDate(selectedDiagnosis.sentAt || selectedDiagnosis.savedAt) }}</p>
            </div>
            <div
              :class="{
                'bg-green-100 text-green-800': selectedDiagnosis.resultPercentage < 20,
                'bg-yellow-100 text-yellow-800': selectedDiagnosis.resultPercentage >= 20 && selectedDiagnosis.resultPercentage < 50,
                'bg-red-100 text-red-800': selectedDiagnosis.resultPercentage >= 50
              }"
              class="px-3 py-1.5 rounded-full text-sm font-medium mt-2 md:mt-0"
            >
              {{ getStatusText(selectedDiagnosis.resultPercentage) }} - {{ selectedDiagnosis.resultPercentage }}%
            </div>
          </div>

          <!-- Risk Assessment Card -->
          <div class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div class="flex items-center mb-4">
              <div
                :class="{
                  'bg-green-100 text-green-700': selectedDiagnosis.resultPercentage < 20,
                  'bg-yellow-100 text-yellow-700': selectedDiagnosis.resultPercentage >= 20 && selectedDiagnosis.resultPercentage < 50,
                  'bg-red-100 text-red-700': selectedDiagnosis.resultPercentage >= 50
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
                <p class="text-sm text-gray-600">Based on medical parameters and predictive analysis</p>
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
          <div v-if="selectedDiagnosis" class="mb-6">
            <h3 class="font-semibold mb-3">Your Health Data</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div class="bg-gray-50 p-2 rounded">
                <div class="text-xs text-gray-500">Age</div>
                <div>{{ selectedDiagnosis.age }} years</div>
              </div>
              <div class="bg-gray-50 p-2 rounded">
                <div class="text-xs text-gray-500">Sex</div>
                <div>{{ selectedDiagnosis.sex }}</div>
              </div>
              <div v-if="selectedDiagnosis.chestPainType" class="bg-gray-50 p-2 rounded">
                <div class="text-xs text-gray-500">Chest Pain Type</div>
                <div>{{ selectedDiagnosis.chestPainType }}</div>
              </div>
              <div v-if="selectedDiagnosis.restingBP" class="bg-gray-50 p-2 rounded">
                <div class="text-xs text-gray-500">Resting BP</div>
                <div>{{ selectedDiagnosis.restingBP }} mmHg</div>
              </div>
              <div v-if="selectedDiagnosis.cholesterol" class="bg-gray-50 p-2 rounded">
                <div class="text-xs text-gray-500">Cholesterol</div>
                <div>{{ selectedDiagnosis.cholesterol }} mg/dl</div>
              </div>
            </div>
          </div>

          <!-- Recommendations -->
          <div class="mt-8 text-center">
            <h3 class="text-lg font-medium mb-4">Health Recommendations</h3>
            <div class="flex flex-wrap justify-center gap-4">
              <div class="bg-blue-100 text-blue-700 p-4 rounded-xl flex items-center">
                <span class="text-2xl mr-3">🥗</span>
                <div class="text-left">
                  <h4 class="font-medium">Healthy Diet</h4>
                  <p class="text-sm">Focus on fruits, vegetables, and lean proteins</p>
                </div>
              </div>
              <div class="bg-blue-100 text-blue-700 p-4 rounded-xl flex items-center">
                <span class="text-2xl mr-3">🏃‍♂️</span>
                <div class="text-left">
                  <h4 class="font-medium">Regular Exercise</h4>
                  <p class="text-sm">Aim for 150 minutes per week</p>
                </div>
              </div>
              <div class="bg-blue-100 text-blue-700 p-4 rounded-xl flex items-center">
                <span class="text-2xl mr-3">💊</span>
                <div class="text-left">
                  <h4 class="font-medium">Medication</h4>
                  <p class="text-sm">Take as prescribed by your doctor</p>
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
.history-page {
  margin-top: -1rem;
}

.bg-blue-600 {
  background-color: #3b82f6;
}

/* Fix any gap issues */
.bg-white {
  margin-top: 0;
  padding-top: 0;
}

/* Form styling */
input {
  cursor: default;
}

input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* Button hover effects */
button {
  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>

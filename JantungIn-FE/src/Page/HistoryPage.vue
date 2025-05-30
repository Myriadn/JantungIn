<script setup>
import { ref } from 'vue'
import FooterComponent from '@/components/Footer-component.vue'

defineOptions({
  name: 'HistoryPage',
})

// Sample patient history data
const patientHistory = ref({
  nik: '23524939202941',
  appointmentDate: '03/05/2025',
  result: 'No Cardiovascular disease detected',
  name: 'John Doe',
  age: 42,
  sex: 'Male',
  chestPainType: 'Typical Angina',
  restingBP: 120,
  cholesterol: 200,
  fastingBS: 0,
  restingECG: 'Normal',
  maxHR: 150,
  exerciseAngina: 'No',
  oldpeak: 1.2,
  stSlope: 'Upsloping',
  caCount: 0,
  thallium: 'Fixed Defect',
})

// Sample chart data
const chartData = ref({
  factorDistribution: [
    { label: 'Name', value: 8 },
    { label: 'Age', value: 8 },
    { label: 'Sex', value: 7 },
    { label: 'ChestPain', value: 6 },
    { label: 'BP', value: 5.5 },
    { label: 'Cholesterol', value: 5 },
    { label: 'BS', value: 4.2 },
    { label: 'ECG', value: 3.5 },
  ],
  riskFactors: [
    { label: 'High BP', value: 9 },
    { label: 'High Chol', value: 8 },
    { label: 'Smoking', value: 7 },
    { label: 'Obesity', value: 6 },
    { label: 'Inactivity', value: 5.5 },
    { label: 'Diabetes', value: 5 },
    { label: 'Stress', value: 4.5 },
    { label: 'Family History', value: 4 },
    { label: 'Age', value: 3.5 },
    { label: 'Gender', value: 3 },
  ],
})
</script>

<template>
  <div class="history-page">
    <!-- Main section with blue background -->
    <div class="bg-gradient-to-b from-blue-500 via-blue-600 to-indigo-700 min-h-screen">
      <div class="max-w-3xl mx-auto py-8 px-4">
        <!-- Page Title -->
        <h1 class="text-white text-3xl font-bold text-center mb-8">Patient Prediction History</h1>

        <!-- Patient History Card -->
        <div class="bg-[#767676] bg-opacity-100 rounded-lg shadow-lg p-6 mb-6">
          <!-- Header Info -->
          <div class="mb-4">
            <p class="text-white"><strong>NIK: </strong>{{ patientHistory.nik }}</p>
            <p class="text-white">
              <strong>Next Appointment: </strong>{{ patientHistory.appointmentDate }}
            </p>
            <p class="text-white"><strong>Result: </strong>{{ patientHistory.result }}</p>
          </div>

          <!-- Form Fields -->
          <div class="grid grid-cols-2 gap-3">
            <!-- Name -->
            <div class="mb-3">
              <label class="block text-white text-sm mb-1">Name</label>
              <input
                type="text"
                :value="patientHistory.name"
                readonly
                class="w-full bg-white rounded p-2 text-gray-800"
              />
            </div>

            <!-- Age -->
            <div class="mb-3">
              <label class="block text-white text-sm mb-1">Age</label>
              <input
                type="text"
                :value="patientHistory.age"
                readonly
                class="w-full bg-white rounded p-2 text-gray-800"
              />
            </div>

            <!-- Sex -->
            <div class="mb-3">
              <label class="block text-white text-sm mb-1">Sex</label>
              <input
                type="text"
                :value="patientHistory.sex"
                readonly
                class="w-full bg-white rounded p-2 text-gray-800"
              />
            </div>

            <!-- Chest Pain Type -->
            <div class="mb-3">
              <label class="block text-white text-sm mb-1">Chest Pain Type</label>
              <input
                type="text"
                :value="patientHistory.chestPainType"
                readonly
                class="w-full bg-white rounded p-2 text-gray-800"
              />
            </div>

            <!-- Resting BP -->
            <div class="mb-3">
              <label class="block text-white text-sm mb-1">Resting Blood Pressure</label>
              <input
                type="text"
                :value="patientHistory.restingBP"
                readonly
                class="w-full bg-white rounded p-2 text-gray-800"
              />
            </div>

            <!-- Cholesterol -->
            <div class="mb-3">
              <label class="block text-white text-sm mb-1">Cholesterol</label>
              <input
                type="text"
                :value="patientHistory.cholesterol"
                readonly
                class="w-full bg-white rounded p-2 text-gray-800"
              />
            </div>

            <!-- Fasting Blood Sugar -->
            <div class="mb-3">
              <label class="block text-white text-sm mb-1">Fasting Blood Sugar</label>
              <input
                type="text"
                :value="patientHistory.fastingBS"
                readonly
                class="w-full bg-white rounded p-2 text-gray-800"
              />
            </div>

            <!-- Resting ECG -->
            <div class="mb-3">
              <label class="block text-white text-sm mb-1">Resting ECG</label>
              <input
                type="text"
                :value="patientHistory.restingECG"
                readonly
                class="w-full bg-white rounded p-2 text-gray-800"
              />
            </div>

            <!-- Max Heart Rate -->
            <div class="mb-3">
              <label class="block text-white text-sm mb-1">Max Heart Rate</label>
              <input
                type="text"
                :value="patientHistory.maxHR"
                readonly
                class="w-full bg-white rounded p-2 text-gray-800"
              />
            </div>

            <!-- Exercise Angina -->
            <div class="mb-3">
              <label class="block text-white text-sm mb-1">Exercise Angina</label>
              <input
                type="text"
                :value="patientHistory.exerciseAngina"
                readonly
                class="w-full bg-white rounded p-2 text-gray-800"
              />
            </div>

            <!-- Oldpeak -->
            <div class="mb-3">
              <label class="block text-white text-sm mb-1">Old Peak</label>
              <input
                type="text"
                :value="patientHistory.oldpeak"
                readonly
                class="w-full bg-white rounded p-2 text-gray-800"
              />
            </div>

            <!-- ST Slope -->
            <div class="mb-3">
              <label class="block text-white text-sm mb-1">ST Slope</label>
              <input
                type="text"
                :value="patientHistory.stSlope"
                readonly
                class="w-full bg-white rounded p-2 text-gray-800"
              />
            </div>

            <!-- CA Count -->
            <div class="mb-3">
              <label class="block text-white text-sm mb-1">CA Count</label>
              <input
                type="text"
                :value="patientHistory.caCount"
                readonly
                class="w-full bg-white rounded p-2 text-gray-800"
              />
            </div>

            <!-- Thallium -->
            <div class="mb-3">
              <label class="block text-white text-sm mb-1">Thallium</label>
              <input
                type="text"
                :value="patientHistory.thallium"
                readonly
                class="w-full bg-white rounded p-2 text-gray-800"
              />
            </div>
          </div>

          <!-- Charts Section -->
          <div class="mt-6">
            <div class="grid grid-cols-2 gap-4">
              <!-- Factor Distribution Chart -->
              <div class="bg-white rounded-lg p-3">
                <p class="text-center text-sm font-semibold mb-2">Factor Distribution</p>
                <div class="h-32 flex items-end justify-between">
                  <div
                    v-for="(item, index) in chartData.factorDistribution"
                    :key="index"
                    class="flex flex-col items-center"
                  >
                    <div class="w-8 bg-blue-500" :style="{ height: item.value * 4 + 'px' }"></div>
                    <span class="text-xs mt-1">{{ item.label }}</span>
                  </div>
                </div>
              </div>

              <!-- Risk Factors Chart -->
              <div class="bg-white rounded-lg p-3">
                <p class="text-center text-sm font-semibold mb-2">Risk Factor Distribution</p>
                <div class="h-32 flex items-end justify-between">
                  <div
                    v-for="(item, index) in chartData.riskFactors.slice(0, 7)"
                    :key="index"
                    class="flex flex-col items-center"
                  >
                    <div class="w-6 bg-blue-500" :style="{ height: item.value * 4 + 'px' }"></div>
                    <span class="text-xs mt-1">{{ item.label }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recommendation Buttons -->
          <div class="flex justify-between mt-6">
            <button class="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center">
              <span class="mr-2">🥗</span>
              Healthy Diet
            </button>
            <button class="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
              <span class="mr-2">🏃‍♂️</span>
              Exercise Regularly
            </button>
            <button class="bg-amber-500 text-white px-4 py-2 rounded-lg flex items-center">
              <span class="mr-2">💪</span>
              Exercise Intensity
            </button>
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

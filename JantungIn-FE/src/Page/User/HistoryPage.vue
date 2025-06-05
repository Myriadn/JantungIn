<script setup>
import { ref, onMounted } from 'vue'
import FooterComponent from '@/components/Footer-component.vue'
import LazyBackground from '@/components/LazyBackground.vue'
import LazyImage from '@/components/LazyImage.vue'
import ImagePreloader from '@/components/ImagePreloader.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import NetworkErrorComponent from '@/components/NetworkErrorComponent.vue'
import ChatbotComponent from '@/components/ChatbotComponent.vue'
import historyService from '@/services/HistoryService'
import { handleApiError } from '@/utils/apiErrorHandler'
import { withCache, createCacheKey } from '@/utils/apiCache'

defineOptions({
  name: 'HistoryPage',
})

// Diagnoses state
const patientNik = ref('23524939202941') // This would be the logged-in user's NIK
const diagnoses = ref([])
const hasHistory = ref(false)
const isLoading = ref(true)
const selectedDiagnosis = ref(null)
const error = ref(null)

// Load diagnoses from API with fallback to localStorage
const loadUserHistory = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Use cache mechanism for history
    const cacheKey = createCacheKey('/diagnosis/history', { userId: patientNik.value })

    const historyData = await withCache(
      () => historyService.getUserHistory({ userId: patientNik.value }),
      cacheKey,
      { duration: 30 * 60 * 1000 }, // 30 minutes cache
    )

    if (historyData && historyData.length > 0) {
      diagnoses.value = historyData
      hasHistory.value = true
    } else {
      hasHistory.value = false
    }
  } catch (err) {
    handleApiError(err, {
      setError: (details) => {
        error.value = details
      },
      setLoading: (state) => {
        isLoading.value = state
      },
    })

    // Try to fallback to localStorage if API fails
    try {
      const userHistory = JSON.parse(localStorage.getItem('userHistory') || '{}')
      if (userHistory[patientNik.value] && userHistory[patientNik.value].length > 0) {
        diagnoses.value = userHistory[patientNik.value]
        hasHistory.value = true
      }
    } catch (localError) {
      console.error('Error loading local diagnosis history:', localError)
    }
  } finally {
    isLoading.value = false
  }
}

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

// Call the load function when component mounts
onMounted(() => {
  loadUserHistory()
})

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
    <!-- Preload critical images -->
    <ImagePreloader
      :images="[
        '/images/diagnose-hero.jpg',
        '/images/loading-placeholder.svg',
        '/images/error-placeholder.svg',
      ]"
      priority
    />

    <!-- Hero Banner Section -->
    <section class="relative">
      <!-- Background with overlay -->
      <div class="absolute inset-0">
        <LazyBackground
          class="absolute inset-0 hero-bg"
          src="/images/diagnose-hero.jpg"
          placeholder="/images/loading-placeholder.svg"
          :style="{ filter: 'brightness(0.4)' }"
        />
        <div
          class="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-indigo-800/60 to-blue-800/70"
        ></div>

        <!-- Animated dots pattern overlay -->
        <div class="absolute inset-0 bg-dot-pattern opacity-10"></div>
      </div>

      <div class="relative z-10 py-16 px-4 text-center mt-10">
        <div
          class="inline-block px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-400/20 text-blue-100 text-sm mb-4"
        >
          {{ selectedDiagnosis ? 'Diagnosis Report' : 'Health Journey' }}
        </div>
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
          {{ selectedDiagnosis ? 'Diagnosis Details' : 'Your Personal' }}
          <span class="text-gradient">Health Records</span>
        </h1>
        <p class="text-lg text-blue-100 max-w-2xl mx-auto">
          {{
            selectedDiagnosis
              ? 'Review your detailed cardiac health assessment and personalized recommendations'
              : 'Track your health journey, analyze trends, and manage your cardiac health records'
          }}
        </p>

        <!-- Back button - Modern Style -->
        <div v-if="selectedDiagnosis" class="mt-6">
          <button
            @click="goBack"
            class="group inline-flex items-center px-5 py-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 rounded-full transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform"
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
            Back to Records
          </button>
        </div>
      </div>
    </section>

    <!-- Main Content Section -->
    <div
      class="bg-gradient-to-b from-blue-600 via-indigo-700 to-indigo-900 px-0 pt-10 pb-20 relative overflow-hidden"
    >
      <!-- Floating elements for modern background -->
      <div class="absolute inset-0 z-0">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
      </div>

      <div class="max-w-4xl mx-auto px-4 relative z-10">
        <!-- Loading State -->
        <LoadingComponent
          :is-loading="isLoading"
          message="Loading your health records..."
          :full-page="false"
        />

        <!-- Network Error State -->
        <NetworkErrorComponent
          v-if="error && !isLoading"
          :title="error.title"
          :message="error.message"
          :retry-action="loadUserHistory"
        />

        <!-- Empty State -->
        <div
          v-else-if="!isLoading && !error && !hasHistory"
          class="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-8"
        >
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
            <h2 class="text-2xl font-bold text-gray-800 mb-2">No Health Records Yet</h2>
            <p class="text-gray-600 mb-6 max-w-md">
              Your doctor hasn't shared any diagnosis records with you yet. Records will appear here
              once available.
            </p>

            <div class="bg-blue-50 p-4 rounded-lg w-full max-w-md">
              <h3 class="font-medium text-blue-800 mb-2 flex items-center">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Did you know?
              </h3>
              <p class="text-sm text-blue-700">
                Regular health check-ups are important for early detection of heart conditions. We
                recommend scheduling a check-up at least once a year.
              </p>
            </div>
          </div>
        </div>

        <!-- List of Diagnoses -->
        <div v-else-if="!selectedDiagnosis">
          <!-- Calendar-style header -->
          <div class="mb-6 text-white">
            <h2 class="text-xl font-semibold mb-2 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 mr-2 text-blue-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Your Medical Timeline
            </h2>
            <p class="text-blue-100 text-sm">Track your heart health progress over time</p>
          </div>

          <!-- Records with visual timeline connector -->
          <div class="relative pb-2">
            <!-- Timeline vertical line -->
            <div
              class="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 to-indigo-500 hidden md:block"
            ></div>

            <!-- Records -->
            <div class="space-y-6">
              <div v-for="(diagnosis, index) in diagnoses" :key="index" class="relative">
                <!-- Timeline dot (visible on md screens and up) -->
                <div
                  class="absolute left-8 top-6 transform -translate-x-1/2 w-4 h-4 rounded-full border-4 border-indigo-500 bg-white z-10 hidden md:block"
                ></div>

                <!-- Card -->
                <div
                  @click="viewDiagnosisDetails(diagnosis)"
                  class="md:ml-12 bg-white/80 backdrop-blur-md rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl border border-white/50"
                >
                  <!-- Top color bar based on risk level -->
                  <div :class="getStatusClass(diagnosis.resultPercentage)" class="h-1.5"></div>

                  <div class="p-5">
                    <div class="flex flex-wrap justify-between items-start gap-3 mb-3">
                      <div class="flex items-center">
                        <div class="bg-blue-100 rounded-lg p-2 mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div class="font-bold text-gray-800">Heart Health Assessment</div>
                          <div class="text-sm text-gray-500">
                            {{ formatDate(diagnosis.sentAt || diagnosis.savedAt) }}
                          </div>
                        </div>
                      </div>

                      <div
                        :class="{
                          'bg-green-100 text-green-800 border-green-200':
                            diagnosis.resultPercentage < 20,
                          'bg-yellow-100 text-yellow-800 border-yellow-200':
                            diagnosis.resultPercentage >= 20 && diagnosis.resultPercentage < 50,
                          'bg-red-100 text-red-800 border-red-200':
                            diagnosis.resultPercentage >= 50,
                        }"
                        class="px-3 py-1.5 rounded-full text-sm font-medium border"
                      >
                        {{ getStatusText(diagnosis.resultPercentage) }}
                      </div>
                    </div>

                    <div class="mt-4">
                      <div class="flex items-center mb-1">
                        <div class="flex-grow h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            :class="getStatusClass(diagnosis.resultPercentage)"
                            class="h-full rounded-full transition-all duration-1000"
                            :style="{ width: `${diagnosis.resultPercentage}%` }"
                          ></div>
                        </div>
                        <span class="text-sm ml-3 font-medium"
                          >{{ diagnosis.resultPercentage }}%</span
                        >
                      </div>
                      <div class="flex justify-between text-xs text-gray-500">
                        <span>Low Risk</span>
                        <span>Medium Risk</span>
                        <span>High Risk</span>
                      </div>
                    </div>

                    <div class="flex justify-end mt-4">
                      <button class="view-details-btn group">
                        <span>View Full Report</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform"
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
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Diagnosis Detail View -->
        <div v-else class="bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-0 overflow-hidden">
          <!-- Top banner with risk level -->
          <div
            :class="{
              'from-green-400 to-green-600': selectedDiagnosis.resultPercentage < 20,
              'from-yellow-400 to-yellow-600':
                selectedDiagnosis.resultPercentage >= 20 && selectedDiagnosis.resultPercentage < 50,
              'from-red-400 to-red-600': selectedDiagnosis.resultPercentage >= 50,
            }"
            class="bg-gradient-to-r text-white p-6"
          >
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div class="flex items-center">
                <div class="report-icon-container mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 class="text-2xl font-bold">Heart Health Report</h2>
                  <div class="flex items-center mt-1">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p class="text-sm opacity-90">
                      {{ formatDate(selectedDiagnosis.sentAt || selectedDiagnosis.savedAt) }}
                    </p>
                  </div>
                </div>
              </div>

              <div
                class="mt-4 md:mt-0 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm font-semibold text-sm border border-white/30"
              >
                {{ getStatusText(selectedDiagnosis.resultPercentage) }} -
                {{ selectedDiagnosis.resultPercentage }}%
              </div>
            </div>
          </div>

          <div class="p-6">
            <!-- Summary Card -->
            <div class="mb-6 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div
                class="flex justify-between items-center bg-gray-50 px-4 py-3 border-b border-gray-100"
              >
                <h3 class="font-semibold text-gray-800 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2 text-blue-500"
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
                  Risk Assessment
                </h3>
                <div
                  :class="{
                    'bg-green-100 text-green-800 border-green-200':
                      selectedDiagnosis.resultPercentage < 20,
                    'bg-yellow-100 text-yellow-800 border-yellow-200':
                      selectedDiagnosis.resultPercentage >= 20 &&
                      selectedDiagnosis.resultPercentage < 50,
                    'bg-red-100 text-red-800 border-red-200':
                      selectedDiagnosis.resultPercentage >= 50,
                  }"
                  class="text-xs px-2 py-1 rounded-full border"
                >
                  {{ selectedDiagnosis.resultPercentage }}% Risk
                </div>
              </div>

              <div class="p-4">
                <div class="my-4">
                  <div class="relative pt-1">
                    <div class="flex mb-2 items-center justify-between">
                      <div>
                        <span
                          :class="{
                            'text-green-800': selectedDiagnosis.resultPercentage < 20,
                            'text-yellow-800':
                              selectedDiagnosis.resultPercentage >= 20 &&
                              selectedDiagnosis.resultPercentage < 50,
                            'text-red-800': selectedDiagnosis.resultPercentage >= 50,
                          }"
                          class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full"
                        >
                          Risk Level
                        </span>
                      </div>
                      <div class="text-right">
                        <span class="text-xs font-semibold inline-block"
                          >{{ selectedDiagnosis.resultPercentage }}%</span
                        >
                      </div>
                    </div>

                    <div class="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        :class="getStatusClass(selectedDiagnosis.resultPercentage)"
                        class="h-full rounded-full animate-pulse-subtle"
                        :style="{ width: `${selectedDiagnosis.resultPercentage}%` }"
                      ></div>

                      <!-- Risk markers -->
                      <div
                        class="absolute top-0 bottom-0 left-[20%] w-px bg-gray-400 opacity-70"
                      ></div>
                      <div
                        class="absolute top-0 bottom-0 left-[50%] w-px bg-gray-400 opacity-70"
                      ></div>
                    </div>

                    <div class="flex justify-between text-xs text-gray-600 mt-1">
                      <span>0%</span>
                      <span class="ml-[16%]">20%</span>
                      <span class="ml-[26%]">50%</span>
                      <span>100%</span>
                    </div>
                    <div class="flex justify-between text-xs text-gray-500 mt-px">
                      <span>Low Risk</span>
                      <span class="ml-20">Medium</span>
                      <span>High Risk</span>
                    </div>
                  </div>
                </div>

                <div class="mt-4 pt-4 border-t border-gray-100">
                  <div class="flex">
                    <div
                      :class="{
                        'bg-green-100 text-green-700 border-green-200':
                          selectedDiagnosis.resultPercentage < 20,
                        'bg-yellow-100 text-yellow-700 border-yellow-200':
                          selectedDiagnosis.resultPercentage >= 20 &&
                          selectedDiagnosis.resultPercentage < 50,
                        'bg-red-100 text-red-700 border-red-200':
                          selectedDiagnosis.resultPercentage >= 50,
                      }"
                      class="p-2 rounded-full mr-3 border"
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
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 class="font-medium mb-1">Doctor's Interpretation</h4>
                      <p
                        v-if="selectedDiagnosis.resultPercentage < 20"
                        class="text-sm text-gray-700"
                      >
                        <span class="font-medium text-green-700">Low risk</span> of cardiovascular
                        disease. Your heart health indicators are within normal ranges. Continue
                        maintaining your healthy lifestyle and schedule regular check-ups to monitor
                        your health.
                      </p>
                      <p
                        v-else-if="selectedDiagnosis.resultPercentage < 50"
                        class="text-sm text-gray-700"
                      >
                        <span class="font-medium text-yellow-700">Moderate risk</span> of
                        cardiovascular disease. Consider lifestyle modifications such as improved
                        diet, increased physical activity, and stress management. Regular follow-ups
                        with your healthcare provider are recommended.
                      </p>
                      <p v-else class="text-sm text-gray-700">
                        <span class="font-medium text-red-700">High risk</span> of cardiovascular
                        disease. The results indicate potential heart health concerns that require
                        attention. We strongly recommend scheduling a consultation with a
                        cardiologist for a comprehensive evaluation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Patient Health Data Card -->
            <div class="mb-8 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div class="bg-gray-50 px-4 py-3 border-b border-gray-100">
                <h3 class="font-semibold text-gray-800 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2 text-blue-500"
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
                  Your Health Data
                </h3>
              </div>

              <div class="p-4">
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div class="health-data-card">
                    <div class="health-data-icon bg-blue-50 text-blue-600">
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div class="health-data-label">Age</div>
                    <div class="health-data-value">{{ selectedDiagnosis.age }} years</div>
                  </div>

                  <div class="health-data-card">
                    <div class="health-data-icon bg-indigo-50 text-indigo-600">
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div class="health-data-label">Sex</div>
                    <div class="health-data-value">{{ selectedDiagnosis.sex }}</div>
                  </div>

                  <div v-if="selectedDiagnosis.chestPainType" class="health-data-card">
                    <div class="health-data-icon bg-red-50 text-red-600">
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
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>
                    <div class="health-data-label">Chest Pain Type</div>
                    <div class="health-data-value">{{ selectedDiagnosis.chestPainType }}</div>
                  </div>

                  <div v-if="selectedDiagnosis.restingBP" class="health-data-card">
                    <div class="health-data-icon bg-purple-50 text-purple-600">
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
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <div class="health-data-label">Resting BP</div>
                    <div class="health-data-value">{{ selectedDiagnosis.restingBP }} mmHg</div>
                  </div>

                  <div v-if="selectedDiagnosis.cholesterol" class="health-data-card">
                    <div class="health-data-icon bg-yellow-50 text-yellow-600">
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
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                      </svg>
                    </div>
                    <div class="health-data-label">Cholesterol</div>
                    <div class="health-data-value">{{ selectedDiagnosis.cholesterol }} mg/dl</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recommendations Section -->
            <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div
                class="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 border-b border-blue-400"
              >
                <h3 class="font-semibold text-white flex items-center">
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Health Recommendations
                </h3>
              </div>

              <div class="p-5">
                <p class="text-gray-700 mb-6">
                  Based on your diagnosis results, here are personalized recommendations to improve
                  your heart health:
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div class="recommendation-card">
                    <div class="recommendation-icon">🥗</div>
                    <h4 class="recommendation-title">Heart-Healthy Diet</h4>
                    <ul class="recommendation-list">
                      <li>Increase fruits and vegetables</li>
                      <li>Choose whole grains</li>
                      <li>Limit saturated fats</li>
                      <li>Reduce sodium intake</li>
                    </ul>
                  </div>

                  <div class="recommendation-card">
                    <div class="recommendation-icon">🏃‍♂️</div>
                    <h4 class="recommendation-title">Regular Exercise</h4>
                    <ul class="recommendation-list">
                      <li>30 minutes daily activity</li>
                      <li>Moderate intensity cardio</li>
                      <li>Include strength training</li>
                      <li>Take walking breaks</li>
                    </ul>
                  </div>

                  <div class="recommendation-card">
                    <div class="recommendation-icon">💤</div>
                    <h4 class="recommendation-title">Better Sleep</h4>
                    <ul class="recommendation-list">
                      <li>Aim for 7-9 hours nightly</li>
                      <li>Maintain regular schedule</li>
                      <li>Create restful environment</li>
                      <li>Limit screen time before bed</li>
                    </ul>
                  </div>

                  <div class="recommendation-card">
                    <div class="recommendation-icon">🧘‍♀️</div>
                    <h4 class="recommendation-title">Stress Management</h4>
                    <ul class="recommendation-list">
                      <li>Practice meditation</li>
                      <li>Deep breathing exercises</li>
                      <li>Enjoy nature walks</li>
                      <li>Maintain social connections</li>
                    </ul>
                  </div>

                  <div class="recommendation-card">
                    <div class="recommendation-icon">🚭</div>
                    <h4 class="recommendation-title">Avoid Smoking</h4>
                    <ul class="recommendation-list">
                      <li>Quit smoking completely</li>
                      <li>Avoid secondhand smoke</li>
                      <li>Seek cessation support</li>
                      <li>Track health improvements</li>
                    </ul>
                  </div>

                  <div class="recommendation-card">
                    <div class="recommendation-icon">⏱️</div>
                    <h4 class="recommendation-title">Regular Check-ups</h4>
                    <ul class="recommendation-list">
                      <li>Follow up with doctor</li>
                      <li>Monitor blood pressure</li>
                      <li>Track cholesterol levels</li>
                      <li>Update health records</li>
                    </ul>
                  </div>
                </div>

                <div class="flex justify-center mt-8">
                  <button class="print-report-btn">
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
                    Print Report for Reference
                  </button>
                </div>
              </div>
            </div>

            <!-- Next Appointment Reminder -->
            <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-center">
              <div class="bg-blue-100 rounded-full p-3 mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h4 class="font-medium text-blue-800">Follow-up Appointment</h4>
                <p class="text-sm text-blue-700">
                  Schedule your next check-up in 3 months to monitor your heart health progress
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Component -->
    <FooterComponent />

    <!-- Chatbot Component -->
    <ChatbotComponent />
  </div>
</template>

<style scoped>
.history-page {
  margin-top: -1rem;
}

/* Hero section styling */
.hero-bg {
  background-color: #3b82f6;
}

/* Line gradient text */
.text-gradient {
  background: linear-gradient(90deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
}

/* Wave divider */
.wave-divider {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="%233b82f6"/></svg>');
  background-size: cover;
  background-repeat: no-repeat;
}

/* Heartbeat loader */
.heartbeat-loader {
  width: 60px;
  height: 60px;
  position: relative;
  animation: heartbeat 1.5s infinite;
}

.heart-icon {
  width: 100%;
  height: 100%;
  color: #3b82f6;
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5));
}

@keyframes heartbeat {
  0% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.3);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.3);
  }
  70% {
    transform: scale(1);
  }
}

/* Floating shapes */
.floating-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.07;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  filter: blur(40px);
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: 10%;
  left: 5%;
  animation: float-animation 15s infinite ease-in-out alternate;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: 20%;
  right: 10%;
  animation: float-animation 20s infinite ease-in-out alternate-reverse;
}

.shape-3 {
  width: 150px;
  height: 150px;
  bottom: 30%;
  left: 15%;
  animation: float-animation 17s infinite ease-in-out alternate;
}

@keyframes float-animation {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(40px, 20px);
  }
  100% {
    transform: translate(10px, 40px);
  }
}

/* Dot pattern background */
.bg-dot-pattern {
  background-image: radial-gradient(circle, #ffffff 1px, transparent 1px);
  background-size: 20px 20px;
}

/* View details button */
.view-details-btn {
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, #3b82f6, #4f46e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
}

/* Health data styling */
.health-data-card {
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
  border: 1px solid #f3f4f6;
  padding: 1rem;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.health-data-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  background-color: white;
}

.health-data-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
}

.health-data-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.health-data-value {
  font-weight: 500;
  color: #1f2937;
}

/* Recommendation cards */
.recommendation-card {
  background-color: #f9fafb;
  border: 1px solid #f3f4f6;
  padding: 1.25rem;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.recommendation-card:hover {
  transform: translateY(-3px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -4px rgba(0, 0, 0, 0.05);
  background-color: white;
}

.recommendation-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.recommendation-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.recommendation-list {
  list-style-type: none;
  padding-left: 0;
}

.recommendation-list li {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.5rem;
  padding-left: 1.25rem;
  position: relative;
}

.recommendation-list li::before {
  content: '•';
  color: #3b82f6;
  font-weight: bold;
  position: absolute;
  left: 0;
}

/* Print report button */
.print-report-btn {
  background-color: #f3f4f6;
  color: #4b5563;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.print-report-btn:hover {
  background-color: #e5e7eb;
  color: #1f2937;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

/* Fix any gap issues */
.bg-white {
  margin-top: 0;
  padding-top: 0;
}

/* Report icon container */
.report-icon-container {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Subtle pulse animation for risk bar */
.animate-pulse-subtle {
  animation: pulse-subtle 4s infinite;
}

@keyframes pulse-subtle {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
  }
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

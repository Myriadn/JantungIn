<template>
  <div class="diagnosis-print">
    <!-- Print Header -->
    <div class="print-header">
      <div class="header-content">
        <div class="logo-section">
          <img src="/logo.png" alt="JantungIn Logo" class="logo" />
          <div class="brand-info">
            <h1 class="brand-name">JantungIn</h1>
            <p class="report-title">Heart Health Assessment Report</p>
          </div>
        </div>
        <div class="report-info">
          <p class="report-id">Report ID: JI-{{ reportId }}</p>
          <p class="report-date">Date: {{ formatDate(diagnosis?.createdAt) }}</p>
          <p v-if="diagnosis?.patientName" class="report-patient">
            Patient: {{ diagnosis.patientName }}
          </p>
        </div>
      </div>
      <div class="header-divider"></div>
    </div>

    <!-- Risk Assessment -->
    <div class="print-section mb-4">
      <div class="section-header">
        <div class="flex justify-between items-center">
          <h3 class="section-title">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="section-icon"
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
              'risk-badge low': diagnosis?.resultPercentage < 50,
              'risk-badge high': diagnosis?.resultPercentage >= 50,
            }"
          >
            {{ diagnosis?.resultPercentage }}% Risk
          </div>
        </div>
      </div>

      <div class="section-content">
        <div class="risk-result">
          <div class="risk-indicator-container">
            <div
              :class="{
                'risk-indicator-label low': diagnosis?.resultPercentage < 50,
                'risk-indicator-label high': diagnosis?.resultPercentage >= 50,
              }"
            >
              <span class="risk-level">{{
                diagnosis?.resultPercentage < 50 ? 'LOW RISK' : 'HIGH RISK'
              }}</span>
              <span class="risk-percentage">{{ diagnosis?.resultPercentage }}%</span>
            </div>

            <div class="risk-progress">
              <div class="risk-scale-container">
                <div class="risk-scale-markers">
                  <div class="risk-scale-marker" style="left: 0%">0%</div>
                  <div class="risk-scale-marker" style="left: 50%">50%</div>
                  <div class="risk-scale-marker" style="left: 100%">100%</div>
                </div>
                <div class="risk-progress-bar">
                  <div
                    class="risk-progress-value"
                    :class="getStatusClass(diagnosis?.resultPercentage)"
                    :style="{ width: `${diagnosis?.resultPercentage}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="interpretation">
          <div class="interpretation-header">
            <div
              :class="{
                'interpretation-icon low-risk-icon': diagnosis?.resultPercentage < 50,
                'interpretation-icon high-risk-icon': diagnosis?.resultPercentage >= 50,
              }"
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
            <h4 class="interpretation-title">
              {{ isIndonesian ? 'Interpretasi Medis' : 'Medical Interpretation' }}
            </h4>
          </div>
          <p v-if="diagnosis?.resultPercentage < 50" class="interpretation-text">
            <span class="highlight">{{ isIndonesian ? 'Risiko rendah' : 'Low risk' }}</span>
            {{ isIndonesian ? 'penyakit kardiovaskular.' : 'of cardiovascular disease.' }}
            {{
              isIndonesian
                ? 'Indikator kesehatan jantung Anda berada dalam rentang normal. Tetap pertahankan gaya hidup sehat Anda dan jadwalkan pemeriksaan rutin untuk memantau kesehatan Anda.'
                : 'Your heart health indicators are within normal ranges. Continue maintaining your healthy lifestyle and schedule regular check-ups to monitor your health.'
            }}
          </p>
          <p v-else class="interpretation-text">
            <span class="highlight high">{{ isIndonesian ? 'Risiko tinggi' : 'High risk' }}</span>
            {{ isIndonesian ? 'penyakit kardiovaskular.' : 'of cardiovascular disease.' }}
            {{
              isIndonesian
                ? 'Hasil menunjukkan adanya potensi masalah kesehatan jantung yang memerlukan perhatian. Kami sangat menyarankan untuk menjadwalkan konsultasi dengan dokter jantung untuk evaluasi menyeluruh.'
                : 'The results indicate potential heart health concerns that require attention. We strongly recommend scheduling a consultation with a cardiologist for a comprehensive evaluation.'
            }}
          </p>
        </div>
      </div>
    </div>

    <!-- Health Data -->
    <div class="print-section mb-4">
      <div class="section-header">
        <h3 class="section-title">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="section-icon"
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

      <div class="section-content">
        <div class="health-data-grid">
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
            <div class="health-data-value">{{ diagnosis?.age }} years</div>
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
            <div class="health-data-value">{{ diagnosis?.sex }}</div>
          </div>

          <div v-if="diagnosis?.chestPainType" class="health-data-card">
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
            <div class="health-data-value">{{ diagnosis?.chestPainType }}</div>
          </div>

          <div v-if="diagnosis?.restingBP" class="health-data-card">
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
            <div class="health-data-value">{{ diagnosis?.restingBP }} mmHg</div>
          </div>

          <div v-if="diagnosis?.cholesterol" class="health-data-card">
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
            <div class="health-data-value">{{ diagnosis?.cholesterol }} mg/dl</div>
          </div>

          <div v-if="diagnosis?.fastingBloodSugar" class="health-data-card">
            <div class="health-data-icon bg-green-50 text-green-600">
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div class="health-data-label">Fasting Blood Sugar</div>
            <div class="health-data-value">{{ diagnosis?.fastingBloodSugar }} mg/dl</div>
          </div>

          <div v-if="diagnosis?.restingEcgResults" class="health-data-card">
            <div class="health-data-icon bg-teal-50 text-teal-600">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div class="health-data-label">Resting ECG</div>
            <div class="health-data-value">{{ diagnosis?.restingEcgResults }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Advanced Cardiac Parameters -->
    <div class="print-section mb-4">
      <div class="section-header">
        <h3 class="section-title">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="section-icon"
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
          Advanced Cardiac Parameters
        </h3>
      </div>

      <div class="section-content">
        <div class="health-data-grid">
          <div
            v-if="diagnosis?.maxHeartRate || diagnosis?.maximumHeartRate"
            class="health-data-card"
          >
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div class="health-data-label">Maximum Heart Rate</div>
            <div class="health-data-value">
              {{ diagnosis?.maxHeartRate || diagnosis?.maximumHeartRate }} bpm
            </div>
          </div>

          <div v-if="diagnosis?.exerciseInducedAngina" class="health-data-card">
            <div class="health-data-icon bg-orange-50 text-orange-600">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div class="health-data-label">Exercise Induced Angina</div>
            <div class="health-data-value">{{ diagnosis?.exerciseInducedAngina }}</div>
          </div>

          <div v-if="diagnosis?.stDepression" class="health-data-card">
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
            <div class="health-data-label">ST Depression</div>
            <div class="health-data-value">{{ diagnosis?.stDepression }}</div>
          </div>

          <div v-if="diagnosis?.stSegment" class="health-data-card">
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
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </div>
            <div class="health-data-label">ST Segment</div>
            <div class="health-data-value">{{ diagnosis?.stSegment }}</div>
          </div>

          <div v-if="diagnosis?.majorVessels !== undefined" class="health-data-card">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div class="health-data-label">Major Vessels</div>
            <div class="health-data-value">{{ diagnosis?.majorVessels }}</div>
          </div>

          <div v-if="diagnosis?.thalassemia" class="health-data-card">
            <div class="health-data-icon bg-pink-50 text-pink-600">
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
            <div class="health-data-label">Thalassemia</div>
            <div class="health-data-value">{{ diagnosis?.thalassemia }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="print-section mb-4">
      <div class="section-header">
        <h3 class="section-title">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="section-icon"
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
          Health Recommendations
        </h3>
      </div>

      <div class="section-content">
        <p class="recommendations-intro">
          Based on your assessment results ({{ diagnosis?.resultPercentage }}% risk), we recommend
          the following actions to improve or maintain your heart health:
        </p>

        <div class="recommendations-grid">
          <div class="recommendation-card">
            <div class="recommendation-header">
              <div class="recommendation-icon">🥗</div>
              <h4 class="recommendation-title">Heart-Healthy Diet</h4>
            </div>
            <ul class="recommendation-list">
              <li>Increase fruits and vegetables</li>
              <li>Choose whole grains</li>
              <li>Limit saturated fats</li>
              <li>Reduce sodium intake</li>
            </ul>
          </div>

          <div class="recommendation-card">
            <div class="recommendation-header">
              <div class="recommendation-icon">🏃‍♂️</div>
              <h4 class="recommendation-title">Regular Exercise</h4>
            </div>
            <ul class="recommendation-list">
              <li>30 minutes daily activity</li>
              <li>Moderate intensity cardio</li>
              <li>Include strength training</li>
              <li>Take walking breaks</li>
            </ul>
          </div>

          <div class="recommendation-card">
            <div class="recommendation-header">
              <div class="recommendation-icon">💤</div>
              <h4 class="recommendation-title">Better Sleep</h4>
            </div>
            <ul class="recommendation-list">
              <li>Aim for 7-9 hours nightly</li>
              <li>Maintain regular schedule</li>
              <li>Create restful environment</li>
              <li>Limit screen time before bed</li>
            </ul>
          </div>

          <div class="recommendation-card">
            <div class="recommendation-header">
              <div class="recommendation-icon">🧘‍♀️</div>
              <h4 class="recommendation-title">Stress Management</h4>
            </div>
            <ul class="recommendation-list">
              <li>Practice meditation</li>
              <li>Deep breathing exercises</li>
              <li>Enjoy nature walks</li>
              <li>Maintain social connections</li>
            </ul>
          </div>

          <div class="recommendation-card">
            <div class="recommendation-header">
              <div class="recommendation-icon">🚭</div>
              <h4 class="recommendation-title">Avoid Smoking</h4>
            </div>
            <ul class="recommendation-list">
              <li>Quit smoking completely</li>
              <li>Avoid secondhand smoke</li>
              <li>Seek cessation support</li>
              <li>Track health improvements</li>
            </ul>
          </div>

          <div class="recommendation-card">
            <div class="recommendation-header">
              <div class="recommendation-icon">⏱️</div>
              <h4 class="recommendation-title">Regular Check-ups</h4>
            </div>
            <ul class="recommendation-list">
              <li>Follow up with doctor</li>
              <li>Monitor blood pressure</li>
              <li>Track cholesterol levels</li>
              <li>Update health records</li>
            </ul>
          </div>
        </div>

        <div v-if="diagnosis?.resultPercentage >= 50" class="high-risk-followup">
          <div class="high-risk-icon-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="high-risk-icon"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div class="high-risk-text">
            <strong>Important:</strong> Based on your high-risk assessment, please schedule an
            appointment with a cardiologist within the next 30 days for a comprehensive evaluation.
          </div>
        </div>

        <div class="report-footer">
          <p>
            This report is provided by JantungIn Healthcare System.<br />
            Generated on {{ currentDate }} for reference purposes only.<br />
            This is not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </div>

    <button v-if="!autoPrint" @click="print" class="print-button">Print Report</button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// Component props
const props = defineProps({
  autoPrint: {
    type: Boolean,
    default: true,
  },
})

const diagnosis = ref(null)
const reportId = ref('')
const isIndonesian = ref(false)

// Get current date for the report
const currentDate = computed(() => {
  if (isIndonesian.value) {
    return new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return ''
  if (isIndonesian.value) {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Get status class based on percentage
const getStatusClass = (percentage) => {
  if (!percentage) return 'bg-gray-300'
  const numPercentage = parseFloat(percentage)
  if (numPercentage < 50) return 'bg-green-500'
  return 'bg-red-500'
}

// Handle print action
const print = () => {
  window.print()
}

// On component mount
onMounted(() => {
  // Get diagnosis data from session storage
  try {
    const diagnosisData = sessionStorage.getItem('printDiagnosis')
    if (diagnosisData) {
      diagnosis.value = JSON.parse(diagnosisData)

      // Generate report ID
      if (diagnosis.value.id) {
        reportId.value = diagnosis.value.id
      } else if (diagnosis.value.createdAt) {
        reportId.value = new Date(diagnosis.value.createdAt).getTime().toString().substring(0, 8)
      } else {
        reportId.value = Date.now().toString().substring(0, 8)
      }

      // Set document title
      document.title = `Heart Health Report - JantungIn - ${formatDate(diagnosis.value.createdAt)}`

      // Auto print if enabled
      if (props.autoPrint) {
        // Slightly longer delay to ensure the page is fully rendered with all styles
        setTimeout(() => {
          print()
        }, 1000)
      }
    } else {
      alert('Diagnosis data not found. Please try again from the history page.')
      setTimeout(() => window.close(), 1000)
    }
  } catch (err) {
    console.error('Error loading diagnosis data:', err)
    alert('Error loading diagnosis data. Please try again.')
    setTimeout(() => window.close(), 1000)
  }
})
</script>

<style scoped>
/* Base Styles */
.diagnosis-print {
  max-width: 210mm;
  margin: 0 auto;
  padding: 15mm 10mm;
  font-family: 'Segoe UI', Arial, sans-serif;
  color: #333;
  background-color: white;
  line-height: 1.5;
}

/* Header Styles */
.print-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-divider {
  height: 1px;
  background-color: #e0e0e0;
  margin-top: 12px;
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo {
  height: 40px;
  margin-right: 12px;
}

.brand-name {
  font-size: 20px;
  font-weight: 600;
  color: #1976d2;
  margin: 0;
}

.report-title {
  font-size: 12px;
  color: #666;
  margin: 2px 0 0 0;
}

.report-info {
  text-align: right;
}

.report-id,
.report-date {
  margin: 2px 0;
  font-size: 12px;
  color: #666;
}

/* Section Styles */
.print-section {
  margin-bottom: 24px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  break-inside: avoid;
  page-break-inside: avoid;
}

.section-header {
  background-color: #f8f9fa;
  padding: 10px 15px;
  border-bottom: 1px solid #e0e0e0;
}

.section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #444;
  display: flex;
  align-items: center;
}

.section-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  color: #1976d2;
}

.section-content {
  padding: 15px;
}

/* Risk Assessment Styles */
.risk-badge {
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 12px;
  font-weight: 600;
}

.risk-badge.low {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.risk-badge.high {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}

.risk-result {
  margin: 15px 0;
}

.risk-indicator-container {
  width: 100%;
}

.risk-indicator-label {
  display: flex;
  justify-content: space-between;
  padding: 6px 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  font-weight: 600;
}

.risk-indicator-label.low {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.risk-indicator-label.high {
  background-color: #ffebee;
  color: #c62828;
}

.risk-level {
  letter-spacing: 0.5px;
}

.risk-progress {
  margin-top: 10px;
}

.risk-scale-container {
  position: relative;
  padding-top: 16px;
}

.risk-scale-markers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 16px;
}

.risk-scale-marker {
  position: absolute;
  transform: translateX(-50%);
  font-size: 11px;
  color: #666;
}

.risk-progress-bar {
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.risk-progress-value {
  height: 100%;
  border-radius: 4px;
}

.bg-green-500 {
  background-color: #4caf50;
}

.bg-red-500 {
  background-color: #f44336;
}

.bg-gray-300 {
  background-color: #e0e0e0;
}

/* Interpretation Styles */
.interpretation {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
}

.interpretation-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.interpretation-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.low-risk-icon {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.high-risk-icon {
  background-color: #ffebee;
  color: #c62828;
}

.interpretation-title {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
}

.interpretation-text {
  font-size: 13px;
  line-height: 1.5;
  color: #444;
}

.highlight {
  color: #2e7d32;
  font-weight: 600;
}

.highlight.high {
  color: #c62828;
}

/* Health Data Styles */
.health-data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.health-data-card {
  padding: 12px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

.health-data-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
}

.health-data-label {
  font-size: 11px;
  color: #6c757d;
  margin-bottom: 3px;
}

.health-data-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

/* Recommendations Styles */
.recommendations-intro {
  font-size: 13px;
  color: #444;
  margin-bottom: 15px;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 16px;
}

.recommendation-card {
  padding: 12px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

.recommendation-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.recommendation-icon {
  font-size: 18px;
  margin-right: 8px;
}

.recommendation-title {
  font-size: 13px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.recommendation-list {
  margin: 0;
  padding-left: 16px;
  font-size: 12px;
  color: #444;
}

.recommendation-list li {
  margin-bottom: 4px;
}

.high-risk-followup {
  margin-top: 24px;
  padding: 12px;
  background-color: #fff8e1;
  border: 1px solid #ffe082;
  border-left: 4px solid #ffa000;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.high-risk-icon-container {
  margin-right: 12px;
}

.high-risk-icon {
  width: 24px;
  height: 24px;
  color: #f57c00;
}

.high-risk-text {
  font-size: 13px;
  color: #555;
}

.report-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 11px;
  color: #6c757d;
}

/* Print Button */
.print-button {
  display: block;
  margin: 20px auto;
  padding: 8px 16px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.print-button:hover {
  background-color: #1565c0;
}

/* Print Media Styles */
@media print {
  /* Hide print button when printing */
  .print-button {
    display: none;
  }

  .diagnosis-print {
    padding: 0;
    margin: 0;
    max-width: none;
  }

  /* A4 print settings */
  @page {
    size: A4 portrait;
    margin: 10mm;
  }

  body {
    background-color: white !important;
  }

  /* Ensure proper page breaks */
  .print-section {
    break-inside: avoid;
    page-break-inside: avoid;
    margin-bottom: 15mm;
  }

  /* Ensure grid layout works in print */
  .health-data-grid,
  .recommendations-grid {
    display: grid !important;
  }

  /* Add a bit more spacing between sections for print */
  .section-content {
    padding: 10mm;
  }
}
</style>

<template>
  <div class="result-page mt-16">
    <!-- Added mt-16 for navbar spacing -->
    <div class="container mx-auto px-4 py-8 max-w-6xl">
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
          Back to Diagnosis
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
          Send to Patient
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
              <h1 class="text-3xl font-bold text-gray-800">Heart Disease Diagnosis Report</h1>
            </div>

            <div class="bg-gray-100 p-3 rounded-lg border-l-4 border-blue-500">
              <p class="text-gray-700">
                <span class="font-medium">Patient:</span> {{ patientName }}
              </p>
              <p class="text-gray-700">
                <span class="font-medium">Date:</span> {{ formatDate(diagnosisDate) }}
              </p>
              <p class="text-gray-700">
                <span class="font-medium">Report ID:</span> HD-{{ generateReportId() }}
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
          <h2 class="text-xl font-semibold mb-4">Risk Analysis & Recommendations</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium mb-3">Key Risk Factors</h3>
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
              <h3 class="text-lg font-medium mb-3">Recommendations</h3>
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
          <h2 class="text-xl font-semibold mb-4">Patient Input Data</h2>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gray-50">
                  <th
                    class="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-200"
                  >
                    Feature
                  </th>
                  <th
                    class="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-200"
                  >
                    Value
                  </th>
                  <th
                    class="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-200"
                  >
                    Normal Range/Description
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
              Indicates values outside normal range
            </span>
          </div>
        </div>
        <!-- Charts Section -->
        <div class="mb-10">
          <h2 class="text-xl font-semibold mb-6">Feature Contributions Analysis</h2>

          <div class="grid grid-cols-1 gap-6">
            <!-- Left Feature Contributions Chart - Horizontal Bars -->
            <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div class="flex justify-between mb-4">
                <div>
                  <h3 class="text-lg font-semibold">Feature Impact</h3>
                  <p class="text-gray-600 text-sm">
                    How each factor affects your heart disease risk
                  </p>
                </div>
                <div
                  class="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full flex items-center"
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{{ resultPercentage }}% Risk Score</span>
                </div>
              </div>

              <div class="space-y-6">
                <!-- Center Scale Indicator -->
                <div class="relative h-6 mb-4 mt-2">
                  <div class="absolute left-0 w-full top-1/2 h-0.5 bg-gray-300"></div>
                  <div
                    class="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-6 bg-gray-400 rounded-sm"
                  ></div>

                  <div class="absolute left-0 -bottom-1 text-xs text-gray-500">Decreases Risk</div>
                  <div class="absolute right-0 -bottom-1 text-xs text-gray-500 text-right">
                    Increases Risk
                  </div>
                </div>

                <div v-for="(item, index) in featureContributions" :key="index" class="relative">
                  <div class="flex justify-between mb-2">
                    <div class="flex items-center">
                      <div
                        class="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                        :class="getIconBgClass(item.value)"
                      >
                        <svg
                          v-if="item.value > 0"
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-3 w-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                        <svg
                          v-else
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-3 w-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                      <span class="text-sm font-medium">{{ item.feature }}</span>
                    </div>
                    <span class="text-sm font-medium" :class="getTextColorClass(item.value)">
                      {{ item.value > 0 ? '+' : '' }}{{ (item.value * 100).toFixed(0) }}%
                    </span>
                  </div>
                  <div class="h-3 bg-gray-200 rounded-full relative">
                    <!-- Center line -->
                    <div
                      class="absolute h-full w-px bg-gray-400 left-1/2 transform -translate-x-1/2"
                    ></div>

                    <!-- Negative bar (if value is negative) -->
                    <div
                      v-if="item.value < 0"
                      class="absolute h-full bg-blue-500 rounded-l-full right-1/2"
                      :style="{ width: `${Math.abs(item.value) * 50}%` }"
                    ></div>

                    <!-- Positive bar (if value is positive) -->
                    <div
                      v-if="item.value > 0"
                      class="absolute h-full rounded-r-full left-1/2"
                      :class="getBarColorClass(item.value)"
                      :style="{ width: `${item.value * 50}%` }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Risk Summary -->
              <div class="mt-8 pt-4 border-t border-gray-200">
                <h4 class="font-medium text-sm mb-2">Key Risk Findings:</h4>
                <ul class="space-y-2 text-sm">
                  <li
                    v-for="(factor, index) in topRiskFactors"
                    :key="index"
                    class="flex items-start"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 text-red-500 mr-2 mt-0.5"
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
                    <span>{{ factor }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Feature Contribution Chart - Donut Chart -->
            <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 class="text-lg font-semibold mb-3">Contribution Breakdown</h3>
              <p class="mb-4 text-gray-600 text-sm">
                Relative impact of positive factors on diagnosis
              </p>

              <div class="flex flex-col md:flex-row items-center justify-between">
                <!-- Donut Chart -->
                <div class="donut-chart-container w-52 h-52 relative">
                  <svg viewBox="0 0 100 100" class="donut-chart">
                    <!-- Create donut segments for positive contributions -->
                    <circle
                      class="donut-ring"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#e2e8f0"
                      stroke-width="15"
                    ></circle>

                    <!-- Dynamic segments based on positive contributions -->
                    <template v-for="(segment, index) in donutSegments" :key="index">
                      <circle
                        class="donut-segment"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        :stroke="segment.color"
                        stroke-width="15"
                        :stroke-dasharray="`${segment.percent} ${100 - segment.percent}`"
                        :stroke-dashoffset="-segment.offset"
                      ></circle>
                    </template>

                    <!-- Center Text -->
                    <text
                      x="50"
                      y="45"
                      text-anchor="middle"
                      class="donut-text font-bold"
                      font-size="10"
                    >
                      {{ Math.round(calculateTotalPositiveContribution() * 100) }}%
                    </text>
                    <text x="50" y="55" text-anchor="middle" class="donut-subtext" font-size="6">
                      Total Impact
                    </text>
                  </svg>
                </div>

                <!-- Legend -->
                <div class="mt-4 md:mt-0 md:ml-6">
                  <div class="space-y-3">
                    <div
                      v-for="(item, index) in positiveContributions"
                      :key="index"
                      class="flex items-center"
                    >
                      <div
                        :style="{ backgroundColor: donutColors[index % donutColors.length] }"
                        class="w-3 h-3 rounded-sm mr-2"
                      ></div>
                      <span class="text-sm">{{ item.feature }}</span>
                      <span class="ml-2 text-xs text-gray-600">
                        {{ (item.value * 100).toFixed(0) }}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Action Buttons -->
        <div
          class="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mt-10"
        >
          <button
            class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-colors"
            @click="saveResults"
          >
            Save Results
          </button>

          <button
            class="px-8 py-3 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-colors"
            @click="printResults"
          >
            Print Report
          </button>
        </div>

        <!-- NIK Input Dialog -->
        <div
          v-if="showNikDialog"
          class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 class="text-lg font-semibold mb-4">Enter Patient NIK</h3>
            <p class="text-gray-600 mb-4">
              Please enter the patient's NIK (National ID Number) to save this diagnosis to their
              history.
            </p>

            <div class="mb-4">
              <label for="patientNik" class="block text-sm font-medium text-gray-700 mb-1"
                >NIK</label
              >
              <input
                type="text"
                id="patientNik"
                v-model="patientNik"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter 16-digit NIK"
                maxlength="16"
              />
              <p v-if="nikError" class="mt-1 text-sm text-red-600">{{ nikError }}</p>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                @click="closeNikDialog"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>

              <button
                @click="handleSaveToHistory"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :disabled="isSaving"
              >
                <span v-if="isSaving" class="flex items-center">
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
                  Saving...
                </span>
                <span v-else>Save to History</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Send to Patient Dialog -->
        <div
          v-if="showSendDialog"
          class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 class="text-lg font-semibold mb-4">Send Results to Patient</h3>
            <p class="text-gray-600 mb-4">
              Enter the patient's information to send this diagnosis report.
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
                placeholder="Enter 16-digit NIK"
                maxlength="16"
              />
              <p v-if="sendNikError" class="mt-1 text-sm text-red-600">{{ sendNikError }}</p>
            </div>

            <div class="mb-4">
              <label for="sendPatientName" class="block text-sm font-medium text-gray-700 mb-1"
                >Full Name</label
              >
              <input
                type="text"
                id="sendPatientName"
                v-model="sendPatientName"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter patient's full name"
              />
              <p v-if="sendNameError" class="mt-1 text-sm text-red-600">{{ sendNameError }}</p>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                @click="closeSendDialog"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
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
                  Sending...
                </span>
                <span v-else>Send Results</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Get data from route params or use mock data if not available
const patientName = ref(route.params.patientName || 'John Doe')
const resultPercentage = ref(route.params.resultPercentage || 10)
const diagnosisDate = ref(new Date())

// Mock data for the charts- Feature contributions can be positive (increasing risk) or negative (decreasing risk)
const featureContributions = ref([
  { feature: 'Serum Cholesterol', value: 0.42 },
  { feature: 'Age', value: 0.26 },
  { feature: 'ST Depression', value: 0.18 },
  { feature: 'Resting Blood Pressure', value: 0.14 },
  { feature: 'Number of Major Vessels', value: 0.08 },
  { feature: 'Maximum Heart Rate', value: -0.15 },
  { feature: 'Exercise Induced Angina', value: -0.22 },
])

// Colors for donut chart
const donutColors = ref([
  '#3b82f6', // blue-500
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#8b5cf6', // violet-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#6366f1', // indigo-500
  '#ec4899', // pink-500
])

// Create patient data table based on route params or use mock data
const patientDataTable = ref([
  { feature: 'Age', value: '58', normalRange: 'N/A', highlight: false },
  { feature: 'Sex', value: 'Male', normalRange: 'N/A', highlight: false },
  { feature: 'Chest Pain Type', value: 'Typical Angina', normalRange: 'N/A', highlight: false },
  {
    feature: 'Resting Blood Pressure',
    value: '145 mm/Hg',
    normalRange: '90-120 mm/Hg',
    highlight: true,
  },
  { feature: 'Serum Cholesterol', value: '240 mg/dl', normalRange: '<200 mg/dl', highlight: true },
  {
    feature: 'Fasting Blood Sugar',
    value: '<120 mg/dl',
    normalRange: '<100 mg/dl',
    highlight: false,
  },
  { feature: 'Resting ECG', value: 'Normal', normalRange: 'Normal', highlight: false },
  { feature: 'Maximum Heart Rate', value: '131', normalRange: '(220 - age)', highlight: false },
  { feature: 'Exercise Induced Angina', value: 'No', normalRange: 'No', highlight: false },
  { feature: 'ST Depression', value: '0.8', normalRange: '<0.5', highlight: true },
  { feature: 'ST Slope', value: 'Upsloping', normalRange: 'Upsloping', highlight: false },
  { feature: 'Number of Major Vessels', value: '0', normalRange: '0', highlight: false },
  { feature: 'Thalassemia', value: 'Normal', normalRange: 'Normal', highlight: false },
])

// Top risk factors based on feature contributions
const topRiskFactors = ref([
  'Elevated serum cholesterol (240 mg/dl)',
  'Resting blood pressure above normal (145 mm/Hg)',
  'ST depression slightly elevated (0.8)',
  'Age (58) as a non-modifiable risk factor',
])

// Recommendations based on risk level
const recommendations = ref([
  'Regular cardiovascular check-ups every 6 months',
  'Adopt a heart-healthy diet low in saturated fats and cholesterol',
  'Moderate exercise at least 150 minutes per week',
  'Monitor blood pressure regularly',
  'Consider cholesterol-lowering medication if diet changes ineffective',
])

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
  if (resultPercentage.value < 20) return 'LOW RISK'
  if (resultPercentage.value < 50) return 'MEDIUM RISK'
  return 'HIGH RISK'
})

const resultMessage = computed(() => {
  if (resultPercentage.value < 20) return 'No heart disease detected'
  if (resultPercentage.value < 50) return 'Potential heart disease'
  return 'Heart disease detected'
})

// Methods
const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
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

const getBarColorClass = (value) => {
  const threshold = 0.25
  if (value >= threshold) return 'bg-red-600'
  if (value > 0) return 'bg-orange-500'
  return 'bg-blue-600'
}

const getTextColorClass = (value) => {
  if (value >= 0.25) return 'text-red-600 font-semibold'
  if (value > 0) return 'text-orange-500'
  if (value < 0) return 'text-blue-600'
  return ''
}

const getIconBgClass = (value) => {
  if (value >= 0.25) return 'bg-red-600'
  if (value > 0) return 'bg-orange-500'
  if (value < 0) return 'bg-blue-500'
  return 'bg-gray-500'
}

// Get only positive contributions for the donut chart
const positiveContributions = computed(() => {
  return featureContributions.value
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
})

// Calculate total positive contribution
const calculateTotalPositiveContribution = () => {
  return positiveContributions.value.reduce((total, item) => total + item.value, 0)
}

// Calculate donut chart segments
const donutSegments = computed(() => {
  const total = calculateTotalPositiveContribution()
  let offset = 25 // Start at the top (25 is 1/4 of the circle)

  return positiveContributions.value.map((item, index) => {
    // Calculate percentage of this segment relative to total positive contributions
    const percent = (item.value / total) * 100

    // Create segment object
    const segment = {
      percent,
      offset,
      color: donutColors.value[index % donutColors.value.length],
    }

    // Update offset for next segment
    offset -= percent

    return segment
  })
})

const goBack = () => {
  router.push('/diagnose')
}

// Show NIK input dialog
const showNikDialog = ref(false)
const patientNik = ref('')
const nikError = ref('')
const isSaving = ref(false)

const saveResults = () => {
  // Clear any previous errors
  nikError.value = ''

  // Show the NIK input dialog
  showNikDialog.value = true
}

const handleSaveToHistory = async () => {
  // Validate NIK
  if (!patientNik.value || patientNik.value.length < 16) {
    nikError.value = 'Please enter a valid NIK (minimum 16 digits)'
    return
  }

  try {
    isSaving.value = true

    // Prepare data to save
    const diagnosisData = {
      patientName: patientName.value,
      patientNik: patientNik.value,
      resultPercentage: resultPercentage.value,
      resultText: resultText.value,
      diagnosisDate: diagnosisDate.value,
      reportId: generateReportId(),
      patientData: patientDataTable.value,
      featureContributions: featureContributions.value,
      riskFactors: topRiskFactors.value,
      recommendations: recommendations.value,
    }

    // In real implementation, this would call your API endpoint
    // const response = await fetch('/api/diagnoses', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`
    //   },
    //   body: JSON.stringify(diagnosisData)
    // })

    // Simulating API call with timeout
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Store data in localStorage for demo purposes
    const savedDiagnoses = JSON.parse(localStorage.getItem('savedDiagnoses') || '{}')

    // Organize by NIK
    if (!savedDiagnoses[patientNik.value]) {
      savedDiagnoses[patientNik.value] = []
    }

    // Add new diagnosis to this patient's records
    savedDiagnoses[patientNik.value].push({
      ...diagnosisData,
      savedAt: new Date().toISOString(),
    })

    // Save back to localStorage
    localStorage.setItem('savedDiagnoses', JSON.stringify(savedDiagnoses))

    // Close dialog and show success message
    showNikDialog.value = false
    patientNik.value = ''
    alert('Diagnosis saved to history successfully!')

    // Optionally navigate to history page
    // router.push('/history')
  } catch (error) {
    console.error('Error saving diagnosis:', error)
    alert('Error saving diagnosis. Please try again.')
  } finally {
    isSaving.value = false
  }
}

const closeNikDialog = () => {
  showNikDialog.value = false
  patientNik.value = ''
  nikError.value = ''
}

// Send to Patient functionality
const showSendDialog = ref(false)
const sendPatientNik = ref('')
const sendPatientName = ref('')
const sendNikError = ref('')
const sendNameError = ref('')
const isSending = ref(false)

const showSendToPatient = () => {
  // Clear previous inputs and errors
  sendPatientNik.value = ''
  sendPatientName.value = ''
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
    sendNikError.value = 'Please enter a valid NIK (minimum 16 digits)'
    hasError = true
  }

  if (!sendPatientName.value || sendPatientName.value.trim().length < 3) {
    sendNameError.value = "Please enter the patient's full name"
    hasError = true
  }

  if (hasError) return

  try {
    isSending.value = true

    // Prepare data to send
    const sendData = {
      patientName: sendPatientName.value,
      patientNik: sendPatientNik.value,
      resultPercentage: resultPercentage.value,
      resultText: resultText.value,
      diagnosisDate: diagnosisDate.value,
      reportId: generateReportId(),
      patientData: patientDataTable.value,
      featureContributions: featureContributions.value,
      riskFactors: topRiskFactors.value,
      recommendations: recommendations.value,
    }

    // In real implementation, this would call your API endpoint to send the report
    // For example, via email, SMS notification, or through a patient portal
    // const response = await fetch('/api/send-to-patient', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`
    //   },
    //   body: JSON.stringify(sendData)
    // })

    // Simulating API call with timeout
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo purposes, we'll also save this to a "sent reports" collection in localStorage
    const sentReports = JSON.parse(localStorage.getItem('sentReports') || '{}')

    // Organize by NIK
    if (!sentReports[sendPatientNik.value]) {
      sentReports[sendPatientNik.value] = {
        patientName: sendPatientName.value,
        reports: [],
      }
    }

    // Add new sent report
    sentReports[sendPatientNik.value].reports.push({
      ...sendData,
      sentAt: new Date().toISOString(),
    })

    // Save back to localStorage
    localStorage.setItem('sentReports', JSON.stringify(sentReports))

    // Close dialog and show success message
    showSendDialog.value = false
    alert('Diagnosis report has been successfully sent to the patient!')
  } catch (error) {
    console.error('Error sending diagnosis to patient:', error)
    alert('Error sending diagnosis report. Please try again.')
  } finally {
    isSending.value = false
  }
}

const printResults = () => {
  window.print()
}
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

/* Donut chart styles */
.donut-chart {
  width: 100%;
  height: 100%;
}

.donut-ring {
  stroke: #e5e7eb;
}

.donut-segment {
  transition: all 0.3s ease-out;
  transform-origin: center;
  animation: donutfade 1s ease-out forwards;
}

.donut-text {
  fill: #374151;
  font-weight: bold;
  font-family: Arial, sans-serif;
}

.donut-subtext {
  fill: #6b7280;
  font-family: Arial, sans-serif;
}

@keyframes donutfade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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

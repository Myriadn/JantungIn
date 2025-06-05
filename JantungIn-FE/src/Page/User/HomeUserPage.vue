<script setup>
import { ref, onMounted } from 'vue'
import FooterComponent from '@/components/Footer-component.vue'
import LazyBackground from '@/components/LazyBackground.vue'
import LazyImage from '@/components/LazyImage.vue'
import ImagePreloader from '@/components/ImagePreloader.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import NetworkErrorComponent from '@/components/NetworkErrorComponent.vue'
import ChatbotComponent from '@/components/ChatbotComponent.vue'

defineOptions({
  name: 'HomeUserPage',
})

// Sample health tips
const healthTips = ref([
  {
    title: 'Monitor Blood Pressure',
    content: 'Regular blood pressure checks can help identify cardiovascular risk factors early.',
    icon: 'heart-pulse',
  },
  {
    title: 'Healthy Diet Choices',
    content: 'Eat a diet rich in fruits, vegetables, and whole grains to support heart health.',
    icon: 'food',
  },
  {
    title: 'Regular Exercise',
    content: 'Aim for at least 150 minutes of moderate exercise per week for optimal heart health.',
    icon: 'exercise',
  },
  {
    title: 'Limit Saturated Fats',
    content:
      'Choose lean proteins and limit saturated fats to maintain healthy cholesterol levels.',
    icon: 'food-apple',
  },
])

// Upcoming features
const upcomingFeatures = ref([
  {
    title: 'Smart Device Integration',
    description: 'Connect with wearable devices to automatically track health metrics.',
    icon: 'device',
  },
  {
    title: 'Video Consultations',
    description: 'Schedule video calls with healthcare providers for remote consultations.',
    icon: 'video',
  },
  {
    title: 'Medication Reminders',
    description: 'Set up alerts for medication schedules and never miss a dose.',
    icon: 'pill',
  },
])

// Sample statistics
const healthStats = ref({
  users: '10,000+',
  doctors: '200+',
  hospitals: '50+',
  diagnoses: '25,000+',
})

onMounted(() => {
  // Initialize any required components
  console.log('Home page mounted')
})
</script>

<template>
  <div class="home-page">
    <!-- Preload critical images -->
    <ImagePreloader
      :images="[
        '/images/heart1.jpg',
        '/images/heart2.jpg',
        '/images/heart3.jpg',
        '/images/loading-placeholder.svg',
      ]"
      priority
    />

    <!-- Hero Banner Section -->
    <section class="relative">
      <!-- Background with overlay -->
      <div class="absolute inset-0">
        <LazyBackground
          class="absolute inset-0 hero-bg"
          src="/images/heart1.jpg"
          placeholder="/images/loading-placeholder.svg"
          :style="{ filter: 'brightness(0.4)' }"
        />
        <div
          class="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-indigo-800/60 to-blue-800/70"
        ></div>

        <!-- Animated dots pattern overlay -->
        <div class="absolute inset-0 bg-dot-pattern opacity-10"></div>
      </div>

      <div class="relative z-10 py-20 px-4 text-center mt-10">
        <div
          class="inline-block px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-400/20 text-blue-100 text-sm mb-4"
        >
          Welcome to JantungIn
        </div>
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
          Your Heart Health <span class="text-gradient">Companion</span>
        </h1>
        <p class="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
          Advanced cardiovascular monitoring and risk assessment to help you maintain a healthy
          heart
        </p>

        <!-- Action Buttons -->
        <div class="flex flex-wrap justify-center gap-4">
          <button
            @click="$router.push('/history')"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all transform hover:-translate-y-1 flex items-center"
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            View Health Records
          </button>
          <button
            @click="$router.push('/news')"
            class="px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 rounded-full shadow-lg transition-all transform hover:-translate-y-1 flex items-center"
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
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            Latest Health News
          </button>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div
      class="bg-gradient-to-b from-blue-600 via-indigo-700 to-indigo-900 px-4 py-16 relative overflow-hidden"
    >
      <!-- Floating elements for modern background -->
      <div class="absolute inset-0 z-0">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
      </div>

      <div class="max-w-7xl mx-auto relative z-10">
        <!-- Health Features Section -->
        <div class="mb-20">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-white mb-4">Heart Health Management</h2>
            <p class="text-blue-100 max-w-3xl mx-auto">
              JantungIn provides comprehensive tools to monitor and improve your cardiovascular
              health
            </p>
          </div>

          <!-- Feature Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              v-for="(tip, index) in healthTips"
              :key="index"
              class="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:transform hover:scale-105 transition-all duration-300"
            >
              <div
                class="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4"
              >
                <svg
                  v-if="tip.icon === 'heart-pulse'"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-blue-400"
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
                <svg
                  v-else-if="tip.icon === 'food'"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <svg
                  v-else-if="tip.icon === 'exercise'"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-blue-400"
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
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-blue-400"
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
              <h3 class="text-xl font-semibold text-white mb-2">{{ tip.title }}</h3>
              <p class="text-blue-100/80">{{ tip.content }}</p>
            </div>
          </div>
        </div>

        <!-- Statistics Section -->
        <div
          class="mb-20 bg-blue-900/30 backdrop-blur-md rounded-2xl p-8 border border-blue-700/30"
        >
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div class="stat-item">
              <div class="text-4xl font-bold text-white mb-2">{{ healthStats.users }}</div>
              <div class="text-blue-200">Active Users</div>
            </div>
            <div class="stat-item">
              <div class="text-4xl font-bold text-white mb-2">{{ healthStats.doctors }}</div>
              <div class="text-blue-200">Doctors</div>
            </div>
            <div class="stat-item">
              <div class="text-4xl font-bold text-white mb-2">{{ healthStats.hospitals }}</div>
              <div class="text-blue-200">Partner Hospitals</div>
            </div>
            <div class="stat-item">
              <div class="text-4xl font-bold text-white mb-2">{{ healthStats.diagnoses }}</div>
              <div class="text-blue-200">Completed Diagnoses</div>
            </div>
          </div>
        </div>

        <!-- Coming Soon Features -->
        <div class="mb-20">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-white mb-4">Coming Soon</h2>
            <p class="text-blue-100 max-w-3xl mx-auto">
              Exciting new features are on the way to make your health journey even better
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              v-for="(feature, index) in upcomingFeatures"
              :key="index"
              class="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div
                class="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-indigo-400"
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
              <h3 class="text-xl font-semibold text-white mb-2">{{ feature.title }}</h3>
              <p class="text-blue-100/80">{{ feature.description }}</p>
            </div>
          </div>
        </div>

        <!-- Call to Action Section -->
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-white mb-6">
            Ready to take control of your heart health?
          </h2>
          <p class="text-blue-100 max-w-3xl mx-auto mb-8">
            Start your journey towards a healthier heart today with JantungIn's comprehensive
            monitoring tools
          </p>
          <button
            @click="$router.push('/history')"
            class="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-full shadow-xl transition-all transform hover:-translate-y-1"
          >
            Explore Your Health Records
          </button>
        </div>
      </div>
    </div>

    <!-- Need Help Section with Chatbot Introduction -->
    <div class="bg-white py-16 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl font-bold text-gray-800 mb-6">Need Assistance?</h2>
        <p class="text-gray-600 mb-8 max-w-2xl mx-auto">
          Have questions about your heart health or how to use JantungIn? Our AI assistant is here
          to help you. Click the chat icon in the bottom right to start a conversation.
        </p>
        <div class="flex justify-center">
          <div class="bg-blue-50 rounded-lg p-6 max-w-md text-left">
            <div class="flex items-start mb-4">
              <div class="bg-blue-100 rounded-full p-2 mr-3">
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
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-blue-800 font-medium">Ask our assistant about:</p>
                <ul class="mt-2 text-gray-700 space-y-1">
                  <li class="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 text-green-500 mr-2"
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
                    Heart health tips and advice
                  </li>
                  <li class="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 text-green-500 mr-2"
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
                    Understanding your diagnosis
                  </li>
                  <li class="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 text-green-500 mr-2"
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
                    Healthy lifestyle recommendations
                  </li>
                  <li class="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 text-green-500 mr-2"
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
                    Using JantungIn features
                  </li>
                </ul>
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
.home-page {
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

/* Floating shapes animation */
.floating-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.2;
  filter: blur(40px);
}

.shape-1 {
  background: linear-gradient(to right, #60a5fa, #34d399);
  width: 300px;
  height: 300px;
  top: 10%;
  left: 5%;
  animation: float 15s ease-in-out infinite;
}

.shape-2 {
  background: linear-gradient(to right, #8b5cf6, #ec4899);
  width: 400px;
  height: 400px;
  top: 40%;
  right: 5%;
  animation: float 20s ease-in-out infinite reverse;
}

.shape-3 {
  background: linear-gradient(to right, #f59e0b, #ef4444);
  width: 250px;
  height: 250px;
  bottom: 10%;
  left: 30%;
  animation: float 18s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(50px, 50px) rotate(180deg);
  }
  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}

/* Stats styling */
.stat-item {
  position: relative;
}

.stat-item:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 20%;
  right: -3px;
  height: 60%;
  width: 1px;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.3), transparent);
}

@media (max-width: 768px) {
  .stat-item:nth-child(odd)::after {
    display: none;
  }

  .stat-item:nth-child(2)::after {
    display: none;
  }
}
</style>

<script setup>
import FooterComponent from '@/components/Footer-component.vue'
import { ref, onMounted } from 'vue'

// Import gambar untuk mencegah error Vite
const hospital1 = '/images/OIP.jpg'
const hospital2 = '/images/ui.jpg' // Diganti karena hospital2.jpg tidak tersedia
const hospital3 = '/images/heart2.jpg' // Diganti karena hospital3.jpg tidak tersedia
const hospital4 = '/images/heart3.jpg' // Diganti karena hospital4.jpg tidak tersedia

// Dashboard stats
const stats = ref([
  { id: 1, title: 'Total Patients', value: '2,856', icon: 'users', change: '+12%', trend: 'up' },
  { id: 2, title: 'Diagnoses Today', value: '78', icon: 'heart-pulse', change: '+5%', trend: 'up' },
  { id: 3, title: 'High Risk Cases', value: '18', icon: 'alert', change: '-7%', trend: 'down' },
])

// Animation untuk stats
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in')
        }
      })
    },
    { threshold: 0.1 },
  )

  document.querySelectorAll('.stat-card').forEach((card) => {
    observer.observe(card)
  })
})
</script>

<template>
  <div class="admin-dashboard mt-16">
    <!-- Added mt-16 for navbar spacing -->
    <!-- Hero Section with Hospital Background - Updated Modern Design -->
    <section class="hero relative text-white">
      <!-- Background Overlay with Modern Gradient -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-indigo-800/80 to-blue-600/70 z-10"
      ></div>

      <!-- Hospital Background Image with Animation -->
      <div class="absolute inset-0 bg-cover bg-center hospital-bg"></div>
      <div class="absolute inset-0 bg-cover bg-center hospital-bg-2 animate-fade-in-out"></div>

      <!-- Floating Shapes for Modern Design -->
      <div class="absolute inset-0 z-10 overflow-hidden">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
      </div>

      <!-- Hero Content -->
      <div class="container mx-auto relative z-20 py-20 pt-28 px-6">
        <div class="max-w-3xl">
          <div
            class="inline-block px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-400/20 text-blue-100 text-sm mb-4"
          >
            Doctor Dashboard
          </div>
          <h1 class="text-5xl lg:text-6xl font-bold mb-3 leading-tight tracking-tight">
            JantungIn <span class="text-gradient">Y0uk</span>
          </h1>
          <p class="text-xl mb-8 text-blue-100 max-w-2xl leading-relaxed">
            Advanced cardiovascular risk assessment and patient management platform powered by AI
            technology
          </p>
          <div class="flex flex-wrap gap-4">
            <button class="btn-primary">
              <router-link to="/diagnose-admin" class="flex items-center">
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
                New Diagnosis
              </router-link>
            </button>
            <button class="btn-secondary">
              <router-link to="/history-admin" class="flex items-center">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                View Reports
              </router-link>
            </button>
            <button class="btn-tertiary">
              <router-link to="/news-admin" class="flex items-center">
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
                News & Updates
              </router-link>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Cards -->
    <section class="stats-section py-8 px-0 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-5 text-gray-800 text-center">Latest Statistics</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div v-for="stat in stats" :key="stat.id" class="stat-card opacity-0">
            <div
              class="bg-white rounded-xl shadow-soft p-5 border-l-4"
              :class="stat.trend === 'up' ? 'border-green-500' : 'border-red-500'"
            >
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-sm text-gray-500 font-medium">{{ stat.title }}</p>
                  <h3 class="text-3xl font-bold text-gray-800 mt-1">{{ stat.value }}</h3>
                </div>
                <div
                  :class="
                    stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  "
                  class="rounded-full p-2 icon-wrapper"
                >
                  <svg
                    v-if="stat.icon === 'users'"
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <svg
                    v-else-if="stat.icon === 'heart-pulse'"
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <svg
                    v-else
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>
              <div class="mt-3 flex items-center">
                <span
                  :class="stat.trend === 'up' ? 'text-green-600' : 'text-red-600'"
                  class="text-sm font-medium"
                  >{{ stat.change }}</span
                >
                <svg
                  v-if="stat.trend === 'up'"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-green-600 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-red-600 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                  />
                </svg>
                <span class="text-gray-500 text-sm ml-1">since last week</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Access Section -->
    <section class="quick-access py-8 px-0">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-5 text-center text-gray-800">Quick Access</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          <!-- Card 1 -->
          <div class="feature-card">
            <div class="icon-wrapper">
              <div class="icon-bg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon"
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
            </div>
            <h3 class="card-title">Diagnosis Tools</h3>
            <p class="card-text">
              Use our advanced AI models to diagnose cardiovascular risks and conditions with high
              accuracy
            </p>
            <router-link to="/diagnose-admin" class="card-link">
              Open Tool
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </router-link>
          </div>

          <!-- Card 2 -->
          <div class="feature-card">
            <div class="icon-wrapper">
              <div class="icon-bg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <h3 class="card-title">Patient History</h3>
            <p class="card-text">
              View detailed history records, track progress, and monitor patient conditions over
              time
            </p>
            <router-link to="/history-admin" class="card-link">
              View History
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </router-link>
          </div>

          <!-- Card 3 -->
          <div class="feature-card">
            <div class="icon-wrapper">
              <div class="icon-bg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon"
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
              </div>
            </div>
            <h3 class="card-title">Health News</h3>
            <p class="card-text">
              Stay updated with the latest cardiovascular research, treatments, and medical
              advancements
            </p>
            <router-link to="/news-admin" class="card-link">
              Read News
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Expert Quote Section with Hospital Images -->
    <section class="expert-quote py-10 px-0 text-white">
      <div class="w-full">
        <div class="quote-content max-w-6xl mx-auto text-center px-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="quote-mark mx-auto mb-2"
            width="36"
            height="36"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"
            />
          </svg>

          <p class="quote-text mb-2">
            "Deteksi dini kondisi kardiovaskular sangat penting untuk pencegahan dan penanganan yang
            tepat. Platform JantungIn memberikan kemudahan bagi para tenaga medis dalam
            mengidentifikasi risiko secara proaktif dengan dukungan teknologi AI terkini."
          </p>

          <p class="quote-author">dr. Siti Nurmala, Sp.JP, FIHA - Cardiac Care Specialist</p>

          <!-- Hospital Gallery Images -->
          <div
            class="hospital-gallery grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 max-w-4xl mx-auto"
          >
            <div class="hospital-image">
              <img :src="hospital1" alt="Hospital Facility 1" class="hospital-gallery-img" />
              <div class="hospital-image-caption">Lobby Fasilitas</div>
            </div>

            <div class="hospital-image">
              <img :src="hospital2" alt="Hospital Facility 2" class="hospital-gallery-img" />
              <div class="hospital-image-caption">Pusat Perawatan Jantung</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Component -->
    <FooterComponent />
  </div>
</template>

<style scoped>
.admin-dashboard {
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

.hero {
  min-height: 500px;
  overflow: hidden;
}

.hospital-bg {
  background-image: url('/images/azwin.jpg');
  filter: blur(1px);
  transform: scale(1.03);
}

.hospital-bg-2 {
  background-image: url('/images/picu.jpg');
  filter: blur(1px);
  transform: scale(1.03);
  opacity: 0;
}

.wave-divider {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="%23f9fafb"/></svg>');
  background-size: cover;
  background-repeat: no-repeat;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
  font-weight: 500;
  padding: 0.75rem 2rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.btn-primary:hover {
  background-color: #1d4ed8;
  transform: scale(1.05);
}

.btn-secondary {
  background-color: transparent;
  border: 2px solid white;
  color: white;
  font-weight: 500;
  padding: 0.75rem 2rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.btn-secondary:hover {
  background-color: white;
  color: #1d4ed8;
  transform: scale(1.05);
}

.shadow-soft {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.04),
    0 4px 6px -2px rgba(0, 0, 0, 0.02);
}

.stats-section {
  position: relative;
  z-index: 10;
}

.stat-card {
  transition: all 0.4s ease;
  border-radius: 1rem;
  overflow: hidden;
}

.animate-fade-in {
  animation: fadeIn 0.6s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  45% {
    opacity: 0;
  }
  55% {
    opacity: 1;
  }
  95% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.animate-fade-in-out {
  animation: fadeInOut 20s infinite ease-in-out;
}

.feature-card {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 0.75rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.04),
    0 4px 6px -2px rgba(0, 0, 0, 0.02);
  padding: 1.25rem;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.icon-bg {
  background-color: #dbeafe;
  padding: 0.875rem;
  border-radius: 9999px;
}

.icon {
  height: 1.75rem;
  width: 1.75rem;
  color: #2563eb;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.card-text {
  color: #4b5563;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.card-link {
  color: #2563eb;
  font-weight: 500;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.card-link:hover {
  color: #1d4ed8;
  transform: translateX(0.25rem);
}

.expert-quote {
  background-image: linear-gradient(to right, #3b82f6, #2563eb);
  position: relative;
  border-radius: 0;
  margin: 0;
  overflow: hidden;
}

.quote-mark {
  opacity: 0.25;
}

.quote-text {
  font-size: 1.05rem;
  font-weight: 500;
  line-height: 1.6;
}

@media (min-width: 768px) {
  .quote-text {
    font-size: 1.125rem;
  }
}

.quote-author {
  font-weight: 600;
  font-size: 0.85rem;
  color: #dbeafe;
  margin-top: 0.5rem;
}

@media (min-width: 768px) {
  .quote-author {
    font-size: 0.95rem;
  }
}

.hospital-image {
  overflow: hidden;
  border-radius: 0.5rem;
  height: 220px; /* Adjusted height for better consistency */
}

.hospital-gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.4s ease;
}

.hospital-image:hover img {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .hospital-gallery {
    grid-template-columns: 1fr;
  }

  .hospital-image {
    height: 180px; /* Smaller on mobile */
    margin-bottom: 0.5rem;
  }

  .hero {
    min-height: 380px;
  }
}

/* Tailwind doesn't have this by default */
.hover\:scale-102:hover {
  transform: scale(1.02);
}

.hover\:transform:hover {
  transform: translateY(-3px);
}

/* New modern UI styles */
.text-gradient {
  background: linear-gradient(90deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
}

.btn-tertiary {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 500;
  padding: 0.75rem 2rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.btn-tertiary:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

/* Floating shapes for modern background */
.floating-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
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

/* Enhanced hospital gallery */
.hospital-gallery-container {
  position: relative;
}

.hospital-image {
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
  height: 200px;
  transition: all 0.3s ease;
}

.hospital-image:hover {
  transform: translateY(-5px);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.hospital-gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s ease;
}

.hospital-image:hover img {
  transform: scale(1.08);
}

.hospital-image-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
  font-weight: 500;
  font-size: 14px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.hospital-image:hover .hospital-image-caption {
  opacity: 1;
  transform: translateY(0);
}
</style>

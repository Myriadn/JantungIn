<script setup>
import { ref } from 'vue'
import FooterComponent from '@/components/Footer-component.vue'
import LazyImage from '@/components/LazyImage.vue'
import LazyBackground from '@/components/LazyBackground.vue'
import ImagePreloader from '@/components/ImagePreloader.vue'
import ChatbotComponent from '@/components/ChatbotComponent.vue'

defineOptions({
  name: 'NewsPageAdmin',
})

// Sample news data that matches the image
const newsItems = ref([
  {
    id: 1,
    title: 'Mewaspadai Tanda Awal Penyakit Jantung: Jangan Abaikan Nyeri Dada dan Sesak Napas',
    date: ' 5 November 2024',
    image: '/images/heart1.jpg',
    content:
      'Meningkatnya jumlah kasus penyakit jantung pada kelompok dewasa muda diakibatkan oleh berbagai faktor, mulai dari pola makan tidak sehat, jarang olahraga, kebiasaan merokok, hingga penyakit tertentu seperti kolesterol tinggi, diabetes, dan hipertensi.',
    url: 'https://www.alodokter.com/gejala-awal-penyakit-jantung-yang-perlu-diwaspadai',
  },
  {
    id: 2,
    title: 'Penyakit Jantung Serang Generasi Muda? Waspada!',
    date: '22 Agustus 2024',
    image: '/images/heart2.jpg',
    content:
      'Ancaman gangguan kardiovaskular kini bergeser menyasar kelompok usia produktif yang sebelumnya dianggap aman. Akar masalahnya adalah akumulasi kebiasaan buruk, seperti pola makan tidak teratur, gaya hidup sedentari, dan tingkat stres tinggi.',
    url: 'https://www.rspondokindah.co.id/id/news/penyakit-jantung-generasi-muda',
  },
  {
    id: 3,
    title: 'Jantung Berdebar Padahal Tak Aktivitas Berat, Bahayakah? Ini Kata Dokter',
    date: '29 Mei 2025',
    image: '/images/heart3.jpg',
    content:
      'Jantung berdebar tanpa melakukan aktivitas berat bisa menjadi tanda masalah kesehatan. Palpitasi jantung dapat disebabkan oleh stres, kafein berlebih, kurang tidur, atau gangguan kesehatan yang lebih serius. Konsultasi dengan dokter diperlukan jika gejala ini sering terjadi.',
    url: 'https://health.detik.com/berita-detikhealth/d-7938972/jantung-berdebar-padahal-tak-aktivitas-berat-bahayakah-ini-kata-dokter',
  },
])
</script>

<template>
  <div class="news-page mt-16">
    <!-- Added mt-16 for navbar spacing -->
    <!-- Hero Banner with Medical Background - Enhanced Modern -->
    <section class="relative">
      <!-- Background with overlay and subtle animation -->
      <div class="absolute inset-0">
        <lazy-background
          class="absolute inset-0 bg-cover bg-center"
          src="/images/king.jpg"
          style="filter: brightness(0.4)"
        ></lazy-background>
        <div
          class="absolute inset-0 bg-gradient-to-r from-blue-900/60 via-indigo-800/50 to-blue-800/60"
        ></div>

        <!-- Animated dots pattern overlay -->
        <div class="absolute inset-0 bg-dot-pattern opacity-10"></div>
      </div>

      <div class="relative z-10 py-28 px-4 text-center">
        <div
          class="inline-block px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-400/20 text-blue-100 text-sm mb-4"
        >
          Latest Updates
        </div>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
          Healthcare <span class="text-gradient">News & Updates</span>
        </h1>
        <p class="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
          Stay informed about the latest cardiovascular research, medical advancements, and hospital
          news
        </p>

        <!-- Search bar -->
        <div class="max-w-xl mx-auto mt-8">
          <div class="relative">
            <input
              type="text"
              placeholder="Search news articles..."
              class="w-full px-5 py-3 pl-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 absolute left-4 top-3.5 text-white/70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- News Content Section - Enhanced Modern Design -->
    <div
      class="bg-gradient-to-b from-blue-600 via-indigo-700 to-indigo-900 px-0 relative overflow-hidden"
    >
      <!-- Floating elements for modern background -->
      <div class="absolute inset-0 z-0">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
      </div>

      <div class="max-w-6xl mx-auto py-14 px-4 relative z-10">
        <!-- Categories Filter - Enhanced -->
        <div class="flex flex-wrap gap-3 mb-12 justify-center">
          <button class="category-btn active">
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
            All News
          </button>
        </div>

        <!-- News Cards Section - Enhanced Modern -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article
            v-for="item in newsItems"
            :key="item.id"
            class="news-card bg-white/80 backdrop-blur-md rounded-xl overflow-hidden transform transition-all hover:scale-[1.02] flex flex-col"
          >
            <div class="relative">
              <lazy-image :src="item.image" :alt="item.title" class="w-full h-52 object-cover" />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
              >
                <!-- Category Tag -->
                <div class="absolute top-4 left-4">
                  <span class="category-tag">CARDIOVASCULAR</span>
                </div>
                <!-- Date -->
                <div class="absolute bottom-4 left-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 text-yellow-400 mr-1"
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
                  <div class="text-white/90 text-sm font-medium">{{ item.date }}</div>
                </div>
              </div>
            </div>
            <div class="p-6 flex flex-col flex-grow">
              <h2 class="text-xl font-bold mb-3 text-gray-800 h-14 line-clamp-2">
                {{ item.title }}
              </h2>
              <p class="text-gray-600 line-clamp-3 flex-grow">{{ item.content }}</p>
              <div class="mt-6 flex justify-between items-center">
                <a :href="item.url" target="_blank" class="read-more-btn flex items-center group">
                  <span>Read More</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
                <div class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-blue-500/70 mr-1"
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
                  <span class="text-sm text-gray-500 font-medium">5 min read</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>

    <!-- Chatbot Component -->
    <ChatbotComponent />

    <!-- Footer Component -->
    <FooterComponent />

  </div>
</template>

<style scoped>
.news-page {
  margin-top: -1rem;
}

/* Line clamp for text truncation */
.line-clamp-3 {
  display: -webkit-box;
  display: box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  box-orient: vertical;
  overflow: hidden;
}

/* Fix any gap issues */
.bg-white {
  margin-top: 0;
  padding-top: 0;
}

/* For better newsletter styling */
input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* Card hover effects */
article {
  transition: all 0.3s ease;
}

article:hover {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Modern UI Components */
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

/* Category buttons */
.category-btn {
  display: flex;
  align-items: center;
  padding: 0.6rem 1.2rem;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
  border-radius: 9999px;
  transition: all 0.3s ease;
}

.category-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.category-btn.active {
  background-color: #3b82f6;
  border-color: #2563eb;
}

/* Category tag */
.category-tag {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background-color: rgba(245, 158, 11, 0.2);
  backdrop-filter: blur(4px);
  color: #fbbf24;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 1px;
  border-radius: 4px;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

/* Read more button */
.read-more-btn {
  color: #3b82f6;
  font-weight: 600;
  transition: all 0.3s ease;
}

.read-more-btn:hover {
  color: #2563eb;
}

/* Add article button */
.add-article-btn {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  padding: 0.8rem 1.5rem;
  padding-left: 0.8rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow:
    0 10px 15px -3px rgba(37, 99, 235, 0.3),
    0 4px 6px -4px rgba(37, 99, 235, 0.4);
}

.add-article-btn:hover {
  transform: translateY(-3px);
  box-shadow:
    0 15px 20px -3px rgba(37, 99, 235, 0.4),
    0 8px 8px -4px rgba(37, 99, 235, 0.2);
}

.add-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: white;
  border-radius: 50%;
  margin-right: 0.8rem;
}

.add-icon {
  width: 1.2rem;
  height: 1.2rem;
  color: #2563eb;
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

/* News card */
.news-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  height: 450px; /* Fixed height for all cards */
}

/* Line clamp for title to ensure consistent height */
.line-clamp-2 {
  display: -webkit-box;
  display: box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  box-orient: vertical;
  overflow: hidden;
}
</style>

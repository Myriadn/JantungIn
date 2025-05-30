<script setup>
import { ref } from 'vue'
import FooterComponent from '@/components/Footer-component.vue'

defineOptions({
  name: 'NewsPage',
})

// Sample news data that matches the image
const newsItems = ref([
  {
    id: 1,
    title: 'Mewaspadai Tanda Awal Penyakit Jantung: Jangan Abaikan Nyeri Dada dan Sesak Napas',
    date: '10 May 2025',
    image: '/images/heart1.jpg',
    content:
      'Meningkatnya jumlah kasus penyakit jantung pada kelompok dewasa muda diakibatkan oleh berbagai faktor, mulai dari pola makan tidak sehat, jarang olahraga, kebiasaan merokok, hingga penyakit tertentu seperti kolesterol tinggi, diabetes, dan hipertensi.',
  },
  {
    id: 2,
    title: 'Mewaspadai Tanda Awal Penyakit Jantung: Jangan Abaikan Nyeri Dada dan Sesak Napas',
    date: '10 May 2025',
    image: '/images/heart2.jpg',
    content:
      'Meningkatnya jumlah kasus penyakit jantung pada kelompok dewasa muda diakibatkan oleh berbagai faktor, mulai dari pola makan tidak sehat, jarang olahraga, kebiasaan merokok, hingga penyakit tertentu seperti kolesterol tinggi, diabetes, dan hipertensi.',
  },
  {
    id: 3,
    title: 'Mewaspadai Tanda Awal Penyakit Jantung: Jangan Abaikan Nyeri Dada dan Sesak Napas',
    date: '10 May 2025',
    image: '/images/heart3.jpg',
    content:
      'Meningkatnya jumlah kasus penyakit jantung pada kelompok dewasa muda diakibatkan oleh berbagai faktor, mulai dari pola makan tidak sehat, jarang olahraga, kebiasaan merokok, hingga penyakit tertentu seperti kolesterol tinggi, diabetes, dan hipertensi.',
  },
])
</script>

<template>
  <div class="news-page">
    <!-- Top section with white background for news cards -->
    <div class="bg-gradient-to-b from-blue-500 via-blue-600 to-indigo-700 min-h-screen">
      <div class="max-w-6xl mx-auto py-8 px-4">
        <!-- News Cards Section -->
        <div class="space-y-6">
          <article
            v-for="item in newsItems"
            :key="item.id"
            class="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div class="p-6">
              <div class="uppercase text-yellow-500 font-medium text-sm mb-1">BERITA</div>
              <div class="text-gray-500 text-sm mb-2">{{ item.date }}</div>
              <h2 class="text-xl font-bold mb-3">{{ item.title }}</h2>
              <div class="flex gap-4 items-start">
                <div class="w-1/5">
                  <img
                    :src="item.image"
                    :alt="item.title"
                    class="rounded-lg object-cover w-full h-auto"
                  />
                </div>
                <div class="w-4/5">
                  <p class="text-gray-700">{{ item.content }}</p>
                  <button
                    class="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md text-sm transition-colors"
                  >
                    Read More
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
    
    <!-- Footer Component -->
    <FooterComponent />
  </div>
</template>

<style scoped>
.news-page {
  margin-top: -1rem;
}
/* Specific styles for NewsPage */
.bg-blue-600 {
  background-color: #3b82f6;
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
</style>

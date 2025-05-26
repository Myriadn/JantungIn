<script setup>
import { ref } from 'vue'

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
    content: 'Meningkatnya jumlah kasus penyakit jantung pada kelompok dewasa muda diakibatkan oleh berbagai faktor, mulai dari pola makan tidak sehat, jarang olahraga, kebiasaan merokok, hingga penyakit tertentu seperti kolesterol tinggi, diabetes, dan hipertensi.',
  },
  {
    id: 2,
    title: 'Mewaspadai Tanda Awal Penyakit Jantung: Jangan Abaikan Nyeri Dada dan Sesak Napas',
    date: '10 May 2025',
    image: '/images/heart2.jpg',
    content: 'Meningkatnya jumlah kasus penyakit jantung pada kelompok dewasa muda diakibatkan oleh berbagai faktor, mulai dari pola makan tidak sehat, jarang olahraga, kebiasaan merokok, hingga penyakit tertentu seperti kolesterol tinggi, diabetes, dan hipertensi.',
  },
  {
    id: 3,
    title: 'Mewaspadai Tanda Awal Penyakit Jantung: Jangan Abaikan Nyeri Dada dan Sesak Napas',
    date: '10 May 2025',
    image: '/images/heart3.jpg',
    content: 'Meningkatnya jumlah kasus penyakit jantung pada kelompok dewasa muda diakibatkan oleh berbagai faktor, mulai dari pola makan tidak sehat, jarang olahraga, kebiasaan merokok, hingga penyakit tertentu seperti kolesterol tinggi, diabetes, dan hipertensi.',
  }
])
</script>

<template>
  <div class="bg-blue-600 min-h-screen">
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
                <img :src="item.image" :alt="item.title" class="rounded-lg object-cover w-full h-auto">
              </div>
              <div class="w-4/5">
                <p class="text-gray-700">{{ item.content }}</p>
                <button class="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md text-sm transition-colors">
                  Read More
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Newsletter Subscription Section -->
      <div class="mt-12 bg-white rounded-lg p-8 shadow-md">
        <h3 class="text-xl font-bold mb-4 text-center">Subscribe Newsletters</h3>
        <div class="flex max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email" 
            class="flex-grow border border-gray-300 px-3 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
          <button class="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-r-md transition-colors">
            Subscribe Now
          </button>
        </div>
      </div>

      <!-- Footer Section -->
      <footer class="mt-12 text-white text-sm">
        <div class="flex justify-between items-center mb-4">
          <div class="space-y-2">
            <h4 class="font-medium">About us</h4>
            <h4 class="font-medium">Discover</h4>
            <h4 class="font-medium">Explore</h4>
            <h4 class="font-medium">Books</h4>
          </div>
          <div class="flex gap-4">
            <a href="#" class="text-white hover:text-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>
            <a href="#" class="text-white hover:text-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" class="text-white hover:text-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.441 16.892c-2.102.144-6.784.144-8.883 0-2.276-.156-2.541-1.27-2.558-4.892.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0 2.277.156 2.541 1.27 2.559 4.892-.018 3.629-.285 4.736-2.559 4.892zm-6.441-7.234l4.917 2.338-4.917 2.346v-4.684z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <div class="border-t border-blue-400 pt-4 flex justify-between">
          <p>© 2025 JantungIn - All rights reserved</p>
          <div class="flex gap-4">
            <a href="#" class="text-white hover:text-blue-200">Terms of Service</a>
            <a href="#" class="text-white hover:text-blue-200">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* Specific styles for NewsPage */
</style>

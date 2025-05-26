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
  <div>
    <!-- Top section with white background for news cards -->
    <div class="bg-gradient-to-b from-blue-500 via-blue-600 to-indigo-700 min-h-screen ">
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
      </div>
    </div>    
    
    <!-- Newsletter and Footer Wrapper with Blue Background -->
    <div class="bg-blue-600">
      <!-- Newsletter Section -->
      <section class="py-32 px-4">
        <div class="container mx-auto max-w-6xl bg-white rounded-lg shadow-md p-20">
          <div class="flex flex-col md:flex-row items-center justify-between">
            <h2 class="text-3xl mb-6 md:mb-0 newsletter-title text-gray-800">Subscribe Newsletters</h2>
            <div class="flex flex-col md:flex-row gap-4">
            <input 
                type="email" 
                placeholder="Enter your email" 
                class="px-5 py-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-80"
            />
            <button class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-md transition-colors shadow-md">
                Subscribe Now
            </button>
            </div>
        </div>
        </div>
    </section>
    
    <!-- Footer Section -->
    <footer class="py-10">
    <div class="container mx-auto">
        <div class="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-center md:space-x-8 mb-6 px-4">
          <a href="#" class="text-white text-sm hover:text-gray-200">About us</a>
          <a href="#" class="text-white text-sm hover:text-gray-200">Discover</a>
          <a href="#" class="text-white text-sm hover:text-gray-200">Explore</a>
          <a href="#" class="text-white text-sm hover:text-gray-200">Books</a>
        </div>
        
        <div class="flex justify-center space-x-6 mb-6">
          <a href="#" aria-label="Facebook" class="text-white hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
            </svg>
          </a>
          <a href="#" aria-label="Twitter" class="text-white hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/>
            </svg>
          </a>
          <a href="#" aria-label="Vimeo" class="text-white hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z"/>
            </svg>
          </a>
          <a href="#" aria-label="YouTube" class="text-white hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
            </svg>
          </a>
        </div>
          <div class="text-center px-4">
          <p class="text-sm mb-2 text-white">© 2025 JantungIn - All rights reserved</p>
          <div class="flex justify-center gap-6">
            <a href="#" class="text-sm text-white hover:underline">Terms of Service</a>
            <a href="#" class="text-sm text-white hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
  </div>
</template>

<style scoped>
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

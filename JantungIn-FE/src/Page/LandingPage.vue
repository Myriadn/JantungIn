<script setup>
// Komponen untuk landing page JantungIn
</script>

<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero text-white py-16 px-4 pt-0">
      <div class="container mx-auto text-center pt-16">
        <h1 class="text-4xl font-bold mb-4">Welcome to JantungIn</h1>
        <p class="text-xl">Detect cardiovascular risk with AI-driven prediction and care</p>
      </div>
    </section>

    <!-- Why Choose Section -->
    <section class="why-choose bg-blue-50 py-16 px-4">
      <div class="container mx-auto text-center">
        <h2 class="text-2xl font-bold mb-10 text-blue-600">Why Choose JantungIn?</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <!-- Card 1 -->
          <div class="feature-card bg-white rounded-lg shadow-md p-6 text-center">
            <div class="icon-wrapper flex justify-center mb-4">
              <div class="bg-blue-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 class="text-lg font-semibold mb-2">Accurate Diagnosis</h3>
            <p class="text-gray-600 text-sm">
              Early risk identification to prevent cardiovascular issues with reliable results
            </p>
          </div>

          <!-- Card 2 -->
          <div class="feature-card bg-white rounded-lg shadow-md p-6 text-center">
            <div class="icon-wrapper flex justify-center mb-4">
              <div class="bg-blue-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-8 text-blue-600"
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
              </div>
            </div>
            <h3 class="text-lg font-semibold mb-2">Monitoring</h3>
            <p class="text-gray-600 text-sm">
              AI-driven visualization for personal cardiovascular condition monitoring
            </p>
          </div>

          <!-- Card 3 -->
          <div class="feature-card bg-white rounded-lg shadow-md p-6 text-center">
            <div class="icon-wrapper flex justify-center mb-4">
              <div class="bg-blue-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-8 text-blue-600"
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
            </div>
            <h3 class="text-lg font-semibold mb-2">Health Insights</h3>
            <p class="text-gray-600 text-sm">
              Get in-depth insights to better secure your health and plan for better care
            </p>
          </div>
        </div>
      </div>
    </section>
    <!-- Expert Quote Section with Heart Images -->

    <section class="expert-quote py-10 px-4 text-white">
      <div class="container mx-auto">
        <div class="quote-content text-center max-w-4xl mx-auto">
          <p class="italic mb-4 text-sm md:text-base">
            "Penyakit jantung berisiko jika mengonsumsi rokok dan kafein yang tidak sehat. Gaya
            hidup modern yang kurang gerak, diet tinggi lemak jenuh menyebabkan penyakit
            kardiovaskular. Deteksi penyakit sejak dini membantu keamanan jantung yang jadi kunci
            kesehatan tubuh manusia sehat."
          </p>
          <p class="font-semibold text-sm mb-8">dr. Vita O, Sp.PD, M.Kes, FINASIM, FICA</p>
          <!-- Heart Images -->
          <div
            class="flex flex-col sm:flex-row justify-center sm:space-x-4 md:space-x-10 space-y-6 sm:space-y-0 mx-auto mt-8 sm:mt-12 mb-4"
          >
            <div class="image-container w-64 sm:w-40 md:w-48 mx-auto sm:mx-0">
              <img
                src="/images/heart1.jpg"
                alt="Heart condition 1"
                class="rounded-lg w-full h-40 object-cover"
                onerror="this.src='https://images.unsplash.com/photo-1559757175-7b21671636f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1589&q=80'"
              />
            </div>
            <div class="image-container w-64 sm:w-40 md:w-48 mx-auto sm:mx-0">
              <img
                src="/images/heart2.jpg"
                alt="Heart condition 2"
                class="rounded-lg w-full h-40 object-cover"
                onerror="this.src='https://images.unsplash.com/photo-1638913974023-cef988e81629?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'"
              />
            </div>
            <div class="image-container w-64 sm:w-40 md:w-48 mx-auto sm:mx-0">
              <img
                src="/images/heart3.jpg"
                alt="Heart condition 3"
                class="rounded-lg w-full h-40 object-cover"
                onerror="this.src='https://images.unsplash.com/photo-1701696602374-7cb01810a90f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80'"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to action -->
    <section class="cta bg-blue-50 py-20 px-4">
      <div class="container mx-auto text-center py-8">
        <h2 class="text-3xl font-bold mb-3 text-blue-500">What are you waiting for?</h2>
        <p class="mb-8 text-blue-500 text-lg">Let's get started</p>
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-md text-lg shadow-md"
        >
          Start Diagnose
        </button>
      </div>
    </section>

    <!-- Newsletter and Footer with shared background -->
    <div class="bg-gradient-to-b from-blue-500 via-blue-600 to-indigo-700">
      <!-- Newsletter Section -->
      <section class="py-16 px-4">
        <div class="container mx-auto max-w-6xl bg-white rounded-lg shadow-md p-10">
          <div class="flex flex-col md:flex-row items-center justify-between">
            <h2 class="text-3xl mb-6 md:mb-0 newsletter-title text-gray-800">
              Subscribe Newsletters
            </h2>
            <div class="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                class="px-5 py-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-80"
              />
              <button
                class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-md transition-colors shadow-md"
              >
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer Section -->
      <footer class="py-10 border-t border-blue-400 border-opacity-30">
        <div class="container mx-auto">
          <div class="flex flex-wrap justify-center items-center gap-8 mb-4 px-4">
            <a href="#" class="text-white hover:text-gray-200">About us</a>
            <a href="#" class="text-white hover:text-gray-200">Discover</a>
            <a href="#" class="text-white hover:text-gray-200">Explore</a>
            <a href="#" class="text-white hover:text-gray-200">Books</a>
          </div>

          <div class="flex justify-center space-x-6 mb-6">
            <a href="#" aria-label="Facebook" class="text-white hover:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"
                />
              </svg>
            </a>
            <a href="#" aria-label="Twitter" class="text-white hover:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"
                />
              </svg>
            </a>
            <a href="#" aria-label="Vimeo" class="text-white hover:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z"
                />
              </svg>
            </a>
            <a href="#" aria-label="YouTube" class="text-white hover:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"
                />
              </svg>
            </a>
          </div>

          <div class="text-center px-4 text-white">
            <p class="text-sm mb-2">©2025 JantungIn. All rights reserved.</p>
            <div class="flex justify-center gap-6">
              <a href="#" class="text-sm hover:underline">Terms of Service</a>
              <a href="#" class="text-sm hover:underline">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.landing-page {
  font-family: 'Arial', sans-serif;
}

.hero {
  background-image: linear-gradient(
    to bottom,
    #3b82f6,
    #60a5fa
  ); /* Gradasi biru dari gelap ke terang */
  margin-top: -37px; /* Menghilangkan gap kecil antara navbar dan hero section */
}

.feature-card {
  transition: transform 0.3s ease;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.expert-quote {
  background-image: linear-gradient(
    to bottom,
    #2563eb,
    #4f86f7
  ); /* Gradasi biru dari gelap ke terang sama dengan hero section */
  color: white;
}

.image-container img {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.image-container img:hover {
  transform: scale(1.03);
}

.cta h2 {
  color: #2563eb; /* Warna biru yang lebih sesuai dengan navbar */
}

button {
  background-color: #3b82f6; /* Updated blue color matching the image */
}

button:hover {
  background-color: #2563eb; /* Slightly darker blue for hover */
}

.newsletter-title {
  font-family: 'Times New Roman', Times, serif;
  font-weight: normal;
  letter-spacing: 0.5px;
  color: #333;
  font-size: 1.75rem;
}
</style>

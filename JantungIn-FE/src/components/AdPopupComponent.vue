<template>
  <div
    v-if="showPopup"
    class="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-60 backdrop-blur-md"
  >
    <div
      class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl overflow-hidden w-[85%] h-[85%] max-w-5xl max-h-[80vh] popup-container relative border border-blue-100 transform transition-all duration-500"
      :class="{ 'scale-100 opacity-100': showPopup, 'scale-90 opacity-0': !showPopup }"
    >
      <!-- Decorative elements -->
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
      <div class="absolute -top-10 -left-10 w-40 h-40 bg-blue-500 rounded-full opacity-10"></div>
      <div class="absolute -bottom-20 -right-20 w-60 h-60 bg-indigo-600 rounded-full opacity-10"></div>
      
      <!-- Close button -->
      <button
        @click="closePopup"
        class="absolute top-4 right-4 bg-white/80 rounded-full p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition-all duration-300 transform hover:scale-110 shadow-md z-20"
        aria-label="Close popup"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      
      <!-- Ad content -->
      <div class="flex flex-col md:flex-row h-full relative">
        <!-- Ad image - left side with overlay and heartbeat animation -->
        <div class="w-full md:w-1/2 h-1/3 md:h-full relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-tr from-blue-600/40 to-transparent z-10"></div>
          <div class="heartbeat-pulse absolute inset-0 z-0"></div>
          <img
            src="/images/cegah.jpg"
            alt="Heart Health Advertisement"
            class="w-full h-full object-cover transition-transform duration-700 hover:scale-105 z-0"
          />
          <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent z-10">
            <div class="flex items-center space-x-2">
              <span class="animate-pulse inline-block w-3 h-3 bg-red-500 rounded-full"></span>
              <p class="text-white text-sm font-medium">Heart Health Monitoring</p>
            </div>
          </div>
        </div>

        <!-- Ad text - right side -->
        <div class="p-8 md:p-10 flex flex-col justify-center w-full md:w-1/2 relative">
          <div class="mb-6 flex items-center">
            <span class="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1.5 rounded-full flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
              </svg>
              Featured
            </span>
            <span class="ml-3 bg-red-100 text-red-800 text-sm font-semibold px-3 py-1.5 rounded-full flex items-center">
              <svg class="h-4 w-4 mr-1 text-red-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
              </svg>
              Sponsored
            </span>
          </div>
          
          <h3 class="text-3xl md:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">Take Care of Your Heart Health!</span>
          </h3>
          
          <div class="pl-4 border-l-4 border-blue-500 mb-8">
            <p class="text-xl text-gray-600">
              Check your heart health regularly to prevent heart problems in the future.
            </p>
          </div>
          
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="flex items-center bg-indigo-50 p-4 rounded-lg">
              <div class="bg-indigo-100 rounded-full p-3 mr-3">
                <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <div>
                <h4 class="font-medium text-lg text-indigo-800">Prevention</h4>
                <p class="text-base text-indigo-600">Early detection</p>
              </div>
            </div>
            <div class="flex items-center bg-blue-50 p-4 rounded-lg">
              <div class="bg-blue-100 rounded-full p-3 mr-3">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h4 class="font-medium text-lg text-blue-800">Regular Checkups</h4>
                <p class="text-base text-blue-600">Every 6 months</p>
              </div>
            </div>
          </div>

          <div class="flex space-x-4 mb-8">
            <a
              class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Learn More
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
            
           
          </div>

          <!-- Sponsor logos section - redesigned -->
          <div class="mt-auto pt-4 border-t border-blue-100">
            <p class="text-base font-medium text-gray-600 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              Trusted Partners
            </p>
            <div class="flex items-center space-x-6">
              <div class="flex items-center group">
                <img
                  src="/images/ridho.jpg"
                  alt="Sponsor Ridho"
                  class="w-16 h-16 rounded-full object-cover border-2 border-transparent group-hover:border-blue-500 transition-all duration-300 shadow-md"
                />
                <div class="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p class="text-sm font-medium text-gray-800">Ridho</p>
                  <p class="text-sm text-gray-500">Honey</p>
                </div>
              </div>
              <div class="flex items-center group">
                <img
                  src="/images/haidar.jpg"
                  alt="Sponsor Haidar"
                  class="w-16 h-16 rounded-full object-cover border-2 border-transparent group-hover:border-blue-500 transition-all duration-300 shadow-md"
                />
                <div class="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p class="text-sm font-medium text-gray-800">Haidar</p>
                  <p class="text-sm text-gray-500">plastic shop</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showPopup = ref(false)

// Check if the user has already seen the popup
const checkPopupSeen = () => {
  const popupSeen = localStorage.getItem('adPopupSeen')
  return popupSeen === 'true'
}

// Show popup after a delay
const showPopupWithDelay = () => {
  if (!checkPopupSeen()) {
    setTimeout(() => {
      showPopup.value = true
    }, 2000) // Show popup after 2 seconds
  }
}

// Close popup and remember the choice
const closePopup = () => {
  showPopup.value = false
  localStorage.setItem('adPopupSeen', 'true')
}

onMounted(() => {
  // Only show popup when component is mounted if user hasn't seen it before
  showPopupWithDelay()
})
</script>

<style scoped>
.backdrop-blur-md {
  backdrop-filter: blur(12px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.bg-gradient-to-br {
  animation: fadeIn 0.5s ease-out forwards;
}

/* Heartbeat animation */
@keyframes heartbeat {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  25% {
    transform: scale(1.1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1);
    opacity: 0.3;
  }
  75% {
    transform: scale(1.1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
}

.heartbeat-pulse {
  background: radial-gradient(circle, rgba(239,68,68,0.5) 0%, rgba(239,68,68,0) 70%);
  animation: heartbeat 2s infinite ease-in-out;
}

/* Enhanced hover effects */
a, button {
  transition: all 0.3s ease;
}

/* Add better responsiveness for mobile devices */
@media (max-width: 640px) {
  .popup-container {
    max-height: 90vh;
    width: 95%;
  }
  
  h3 {
    font-size: 1.5rem;
  }
  
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>

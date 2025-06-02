<template>
  <div
    v-if="showPopup"
    class="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm"
  >
    <div
      class="bg-white rounded-lg shadow-xl overflow-hidden w-3/4 h-3/4 max-w-4xl max-h-[75vh] popup-container relative border border-gray-200 transform transition-all duration-300"
      :class="{ 'scale-100 opacity-100': showPopup, 'scale-95 opacity-0': !showPopup }"
    >
      <!-- Close button -->
      <button
        @click="closePopup"
        class="absolute top-3 right-3 bg-gray-100 rounded-full p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
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
      <div class="flex flex-col md:flex-row h-full">
        <!-- Ad image - left side -->
        <div class="w-full md:w-1/2 h-1/3 md:h-full">
          <img
            src="/images/heart1.jpg"
            alt="Heart Health Advertisement"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Ad text - right side -->
        <div class="p-8 flex flex-col justify-center w-full md:w-1/2">
          <div class="mb-4">
            <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded"
              >Sponsored</span
            >
          </div>
          <h3 class="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Jaga Kesehatan Jantung Anda!
          </h3>
          <p class="text-lg text-gray-600 mb-6">
            Cek kesehatan jantung Anda secara rutin untuk mencegah masalah jantung di masa depan.
          </p>

          <div class="flex space-x-3">
            <a
              class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            >
              Pelajari Selengkapnya
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 ml-2"
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
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
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

.bg-white {
  animation: fadeIn 0.3s ease-out forwards;
}

/* Add better responsiveness for mobile devices */
@media (max-width: 640px) {
  .popup-container {
    max-height: 85vh;
  }
}
</style>

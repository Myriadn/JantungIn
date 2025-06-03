<template>
  <div
    v-if="isLoading"
    class="loading-container"
    :class="{ 'full-page': fullPage, inline: !fullPage }"
  >
    <div class="loading-spinner">
      <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
    </div>
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  /**
   * Whether the loading indicator is visible
   */
  isLoading: {
    type: Boolean,
    default: false,
  },

  /**
   * Optional loading message
   */
  message: {
    type: String,
    default: 'Loading...',
  },

  /**
   * Whether to display as full page overlay or inline
   */
  fullPage: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.full-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
}

.inline {
  padding: 1rem;
  min-height: 100px;
}

.loading-spinner {
  width: 2.5rem;
  height: 2.5rem;
  color: #3b82f6;
}

.loading-message {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: #4b5563;
  text-align: center;
}
</style>

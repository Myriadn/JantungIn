<template>
  <div class="network-error-container">
    <div class="network-error-card">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <h3 class="error-title">{{ title }}</h3>
      <p class="error-message">{{ message }}</p>
      <button v-if="retryAction" @click="retryAction" class="retry-button">Try Again</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  /**
   * Error title
   */
  title: {
    type: String,
    default: 'Network Error',
  },

  /**
   * Error message
   */
  message: {
    type: String,
    default:
      'Failed to connect to the server. Please check your internet connection and try again.',
  },

  /**
   * Function to call when retry button is clicked
   */
  retryAction: {
    type: Function,
    default: null,
  },
})
</script>

<style scoped>
.network-error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
}

.network-error-card {
  background-color: white;
  border-radius: 0.5rem;
  padding: 2rem;
  max-width: 32rem;
  width: 100%;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  text-align: center;
}

.error-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.error-icon svg {
  height: 3rem;
  width: 3rem;
  color: #ef4444;
}

.error-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.error-message {
  color: #4b5563;
  margin-bottom: 1.5rem;
}

.retry-button {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #2563eb;
}
</style>

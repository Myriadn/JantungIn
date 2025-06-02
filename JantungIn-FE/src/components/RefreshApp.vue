<template>
  <div v-if="showUpdateBar" class="update-bar">
    <div class="update-content">
      <div class="update-message">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="refresh-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span>Versi baru JantungIn tersedia!</span>
      </div>
      <button @click="updateApp" class="update-button">Perbarui</button>
    </div>
  </div>
</template>

<script>
import { pwaUpdater } from '../utils/pwaUpdater'

export default {
  name: 'RefreshApp',
  data() {
    return {
      showUpdateBar: false,
    }
  },
  mounted() {
    // Initialize the PWA updater
    pwaUpdater.init()

    // Listen for update events
    pwaUpdater.on('onUpdateReady', () => {
      console.log('Update is ready to install')
      this.showUpdateBar = true
    })

    // Check if there's already an update available
    if (pwaUpdater.updateAvailable) {
      this.showUpdateBar = true
    }
  },
  methods: {
    updateApp() {
      // Apply the update and refresh the app
      pwaUpdater.applyUpdate()

      // Hide the update bar
      this.showUpdateBar = false
    },
  },
}
</script>

<style scoped>
.update-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #4b5563;
  color: white;
  padding: 8px 16px;
  z-index: 1000;
  text-align: center;
}

.update-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 768px;
  margin: 0 auto;
}

.update-message {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.refresh-icon {
  width: 20px;
  height: 20px;
  animation: spin 2s linear infinite;
}

.update-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.update-button:hover {
  background-color: #2563eb;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

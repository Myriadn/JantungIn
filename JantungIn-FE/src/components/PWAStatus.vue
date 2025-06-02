

<script>
import { isAppInstalled } from '@/utils/pwaHelper.js'
import { checkInstallabilityRequirements, showInstallPrompt } from '@/utils/pwaUtils.js'
import { swEvents } from '@/registerSW.js'

export default {
  name: 'PWAStatus',
  data() {
    return {
      isInstalled: false,
      hasServiceWorker: false,
      hasManifest: false,
      hasOfflineSupport: false,
      isInstallable: false,
      showStatusIcon: true,
      showStatusDetails: false
    }
  },
  mounted() {
    // Check initial status
    this.updatePWAStatus()
    
    // Listen for PWA status changes
    swEvents.addEventListener(this.handleSWStatusChange)
    
    // Check status periodically
    this.statusChecker = setInterval(this.updatePWAStatus, 30000)
  },
  beforeUnmount() {
    // Clean up listeners
    clearInterval(this.statusChecker)
  },
  methods: {
    updatePWAStatus() {
      // Check installation status
      this.isInstalled = isAppInstalled()
      
      // Check installability requirements
      const { requirements } = checkInstallabilityRequirements()
      this.hasServiceWorker = requirements.hasServiceWorker
      this.hasManifest = requirements.hasManifest
      this.isInstallable = !this.isInstalled && requirements.hasServiceWorker && requirements.hasManifest
      
      // Check service worker status
      this.hasOfflineSupport = swEvents.installed
    },
    
    handleSWStatusChange(status) {
      this.hasOfflineSupport = status.installed
    },
    
    toggleStatusDetails() {
      this.showStatusDetails = !this.showStatusDetails
      
      // Update status when opened
      if (this.showStatusDetails) {
        this.updatePWAStatus()
      }
    },
    
    closeStatusDetails() {
      this.showStatusDetails = false
    },
    
    async installApp() {
      try {
        const success = await showInstallPrompt()
        if (success) {
          this.isInstalled = true
          this.closeStatusDetails()
        }
      } catch (error) {
        console.error('Installation failed:', error)
      }
    }
  }
}
</script>

<style scoped>
.pwa-status {
  position: relative;
}

.pwa-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: #fff;
  transition: all 0.2s ease;
}

.pwa-indicator:hover {
  transform: scale(1.1);
}

.pwa-indicator.is-installed {
  color: #4ade80;
}

.pwa-status-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.pwa-status-modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.pwa-status-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.pwa-status-modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.close-btn {
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.close-btn:hover {
  background: #f3f4f6;
}

.pwa-status-modal-body {
  padding: 16px;
}

.status-message {
  font-size: 1rem;
  margin-bottom: 16px;
  color: #374151;
}

.status-details {
  margin: 16px 0;
}

.status-details h4 {
  margin: 0 0 8px 0;
  font-size: 1rem;
  color: #374151;
}

.status-details ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.status-details li {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.status-details li:last-child {
  border-bottom: none;
}

.feature-name {
  font-weight: 500;
}

.status-yes {
  color: #10b981;
  font-weight: bold;
}

.status-no {
  color: #ef4444;
  font-weight: bold;
}

.install-btn {
  display: block;
  width: 100%;
  background-color: #3b82f6;
  color: #ffffff;
  font-weight: 500;
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  margin-top: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.install-btn:hover {
  background-color: #2563eb;
}

@media (max-width: 640px) {
  .pwa-status-modal-content {
    width: 95%;
    max-height: 90vh;
  }
}
</style>

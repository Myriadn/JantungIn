<template>
  <div>


    <!-- Install Floating Action Button (always visible except when app is installed) -->
    <div class="install-fab" v-if="!isAppInstalled">
      <button
        @click="showManualInstallInstructions"
        class="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50 flex items-center justify-center"
        title="Instal Aplikasi"
      >
        <span class="sr-only">Instal Aplikasi</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { initInstallPrompt, showInstallPrompt, getBrowserInstallInstructions, checkInstallabilityRequirements } from '@/utils/pwaUtils.js'
import { isAppInstalled, recordInstallation } from '@/utils/pwaHelper.js'

export default {
  name: 'InstallPWA',
  // Expose methods for use by parent components
  expose: ['showManualInstallInstructions'],
  data() {
    return {
      deferredPrompt: null,
      showInstallPrompt: false,
      isAppInstalled: false,
      installControls: null,
      installInstructions: null,
      installRequirements: null,
    }
  },
  mounted() {
    console.log('InstallPWA component mounted')

    // Check if app is already installed
    this.isAppInstalled = isAppInstalled()
    if (this.isAppInstalled) {
      console.log('App already installed, hiding install prompt')
      this.showInstallPrompt = false
      return
    }

    // Check installability requirements
    this.installRequirements = checkInstallabilityRequirements()
    console.log('Installation requirements:', this.installRequirements)

    // Get browser-specific installation instructions
    this.installInstructions = getBrowserInstallInstructions()

    // Check if manifest exists
    const manifestLink = document.querySelector('link[rel="manifest"]')
    if (!manifestLink) {
      console.error('No manifest link found in the document head')
    } else {
      console.log('Manifest link found:', manifestLink.href)
    }

    // Show install prompt for browsers that support PWA but don't fire the beforeinstallprompt event
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

    if (isIOS && isSafari) {
      console.log('iOS Safari detected, showing install prompt with alternative instructions')
      // For iOS Safari, we'll show the prompt after a short delay to ensure user engagement
      setTimeout(() => {
        this.showInstallPrompt = true
      }, 3000)
      this.deferredPrompt = null // iOS Safari doesn't support programmatic install
    }

    // Initialize install prompt features
    this.installControls = initInstallPrompt(
      // onPromptReady
      (prompt) => {
        console.log('Install prompt is ready')
        this.deferredPrompt = prompt
        this.showInstallPrompt = true
      },
      // onInstalled
      () => {
        console.log('PWA was installed')
        this.showInstallPrompt = false
        this.deferredPrompt = null
        this.isAppInstalled = true
        recordInstallation()

        // Show confirmation message
        setTimeout(() => {
          alert(
            'JantungIn berhasil diinstal! Anda sekarang dapat mengaksesnya dari layar utama perangkat Anda.',
          )
        }, 1000)
      }
    )

    // Hide the install button when the PWA is installed
    window.addEventListener('appinstalled', () => {
      this.isAppInstalled = true
      this.showInstallPrompt = false
    })
  },
  methods: {
    async installPWA() {
      console.log('Install button clicked')
      
      if (!this.deferredPrompt) {
        console.log('PWA installation prompt not available')
        this.showManualInstallInstructions()
        return false
      }

      try {
        // Use the utility function to show the prompt
        const success = await showInstallPrompt()
        
        if (success) {
          this.showInstallPrompt = false
          this.isAppInstalled = true
          
          // Track installation if analytics is available
          if (window.gtag) {
            window.gtag('event', 'pwa_install_success', {
              event_category: 'pwa',
              event_label: 'install_success',
              value: 1,
            })
          }

          // Show success message
          setTimeout(() => {
            alert(
              'JantungIn berhasil diinstal! Anda sekarang dapat mengaksesnya dari layar utama perangkat Anda.',
            )
          }, 500)
        }
        
        return success
      } catch (error) {
        console.error('Error during installation:', error)
        return false
      }
    },
    
    dismissPrompt() {
      console.log('Install prompt dismissed')
      this.showInstallPrompt = false

      // Remember choice in session storage for 24 hours
      const now = new Date()
      sessionStorage.setItem('installPromptDismissed', now.toISOString())
    },

    showManualInstallInstructions() {
      console.log('Showing manual install instructions')
      const instructions = this.installInstructions || getBrowserInstallInstructions()
      
      let message = `${instructions.title}\n\n`
      instructions.steps.forEach((step, index) => {
        message += `${index + 1}. ${step}\n`
      })
      
      alert(message)
    },
  },
}</script>

<style scoped>
.install-pwa {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.install-banner {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.install-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
}

.app-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-logo {
  width: 48px;
  height: 48px;
  border-radius: 8px;
}

.app-details h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.app-details p {
  margin: 4px 0 0;
  font-size: 14px;
  color: #666;
}

.install-actions {
  display: flex;
  gap: 12px;
}

.install-btn {
  background-color: #4285f4;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.install-btn:hover {
  background-color: #3367d6;
}

.dismiss-btn {
  background-color: transparent;
  border: 1px solid #dadce0;
  padding: 8px 16px;
  border-radius: 4px;
  color: #5f6368;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dismiss-btn:hover {
  background-color: #f1f3f4;
}

@media (max-width: 600px) {
  .install-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .install-actions {
    margin-top: 12px;
    width: 100%;
    justify-content: flex-end;
  }
}

.install-fab {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 1000;
}

.install-fab button {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  width: 56px;
  height: 56px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.install-fab button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}
</style>

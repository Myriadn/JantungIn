// This file is used to register the service worker
// It's imported in main.js

// Event to track installation status for other components
export const swEvents = {
  installed: false,
  updateAvailable: false,
  registration: null,
  listeners: new Set(),

  addEventListener(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  },

  notifyListeners() {
    this.listeners.forEach((callback) =>
      callback({
        installed: this.installed,
        updateAvailable: this.updateAvailable,
        registration: this.registration,
      }),
    )
  },
}

export async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      // Wait for the page to load fully before registering SW
      window.addEventListener('load', async () => {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none', // Never use cached service worker
        })

        swEvents.registration = registration

        // Check if the service worker was successfully registered
        if (registration.active) {
          console.log('Service worker is active')
          swEvents.installed = true
        } else if (registration.installing) {
          console.log('Service worker is installing...')
        } else if (registration.waiting) {
          console.log('Service worker is waiting')
        }

        console.log('Service worker registered successfully with scope:', registration.scope)
        swEvents.notifyListeners()

        // Handle service worker updates
        registration.onupdatefound = () => {
          const installingWorker = registration.installing
          if (!installingWorker) return

          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New content is available, prompt user to refresh
                console.log('New content is available, please refresh the page')
                swEvents.updateAvailable = true
                swEvents.notifyListeners()
              } else {
                // Content is cached for offline use
                console.log('Content is cached for offline use')
                swEvents.installed = true
                swEvents.notifyListeners()
              }
            }
          }
        }
      })
    } catch (error) {
      console.error('Service worker registration failed:', error)
    }
  } else {
    console.log('Service Worker is not supported in this browser')
  }
}

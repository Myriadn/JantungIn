// This file is used to register the service worker
// It's imported in main.js

// Event to track installation status for other components
export const swEvents = {
  installed: false,
  updateAvailable: false,
  registration: null,
  error: null,
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
        error: this.error,
      }),
    )
  },
}

// Check if SW should be skipped based on URL parameter or localStorage
function shouldSkipServiceWorker() {
  // Check URL parameters first
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.has('noSW') || urlParams.has('skipSW')) {
    // Optionally save this preference
    localStorage.setItem('skipServiceWorker', 'true')
    return true
  }

  // Check localStorage for persisted preference
  return localStorage.getItem('skipServiceWorker') === 'true'
}

export async function registerSW() {
  // Exit early if service workers aren't supported
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker is not supported in this browser')
    return
  }

  // Check if we should skip SW registration
  if (shouldSkipServiceWorker()) {
    console.log('Service Worker registration skipped by user preference')
    return
  }

  // Use a setTimeout to defer SW registration and not block rendering
  setTimeout(async () => {
    try {
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
    } catch (error) {
      console.error('Service worker registration failed:', error)
      swEvents.error = error.message || 'Registration failed'
      swEvents.notifyListeners()

      // Store the error in sessionStorage for debugging
      sessionStorage.setItem(
        'swRegistrationError',
        JSON.stringify({
          message: error.message,
          timestamp: new Date().toISOString(),
        }),
      )
    }
  }, 2000) // Delay registration by 2 seconds to prioritize UI rendering
}

// Function to unregister all service workers (useful for troubleshooting)
export async function unregisterAllServiceWorkers() {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations()
      for (const registration of registrations) {
        await registration.unregister()
        console.log('Service worker unregistered successfully')
      }
      return true
    } catch (error) {
      console.error('Service worker unregistration failed:', error)
      return false
    }
  }
  return false
}

// Function to disable service worker for current session
export function disableServiceWorker() {
  localStorage.setItem('skipServiceWorker', 'true')
  return unregisterAllServiceWorkers()
}

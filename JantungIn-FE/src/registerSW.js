// This file is used to register the service worker
// It's imported in main.js

export async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js')
      console.log('Service worker registered')
    } catch (error) {
      console.error('Service worker registration failed:', error)
    }
  }
}

/**
 * PWA Utilities
 *
 * Utilitas untuk mengelola instalasi dan fungsionalitas PWA
 */

// Global variable to store the deferred install prompt
let deferredInstallPrompt = null

/**
 * Initialize the PWA install listeners
 * @param {Function} onPromptReady - Callback when install prompt is ready
 * @param {Function} onInstalled - Callback when app is installed
 * @returns {Object} - Control functions
 */
export function initInstallPrompt(onPromptReady, onInstalled) {
  // Listen for the beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault()

    // Store the event for later use
    deferredInstallPrompt = e

    // Notify that the prompt is ready
    if (typeof onPromptReady === 'function') {
      onPromptReady(deferredInstallPrompt)
    }
  })

  // Listen for the appinstalled event
  window.addEventListener('appinstalled', (event) => {
    // Clear the deferredInstallPrompt variable
    deferredInstallPrompt = null

    // Mark as installed in localStorage
    localStorage.setItem('pwaInstalled', 'true')
    localStorage.setItem('pwaInstallDate', new Date().toISOString())

    // Call the onInstalled callback
    if (typeof onInstalled === 'function') {
      onInstalled(event)
    }

    // Optional: Track installation
    trackInstallation()
  })

  return {
    showPrompt: showInstallPrompt,
    isPromptAvailable: () => deferredInstallPrompt !== null,
    clearPrompt: () => {
      deferredInstallPrompt = null
    },
  }
}

/**
 * Show the install prompt
 * @returns {Promise<boolean>} - Whether installation was accepted
 */
export async function showInstallPrompt() {
  if (!deferredInstallPrompt) {
    console.log('No installation prompt available')
    return false
  }

  try {
    // Show the install prompt
    deferredInstallPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredInstallPrompt.userChoice

    // Clear the saved prompt as it can only be used once
    deferredInstallPrompt = null

    // Return whether the installation was accepted
    return outcome === 'accepted'
  } catch (error) {
    console.error('Error showing install prompt:', error)
    return false
  }
}

/**
 * Track PWA installation (for analytics)
 */
function trackInstallation() {
  // If Google Analytics is available, track the installation event
  if (window.gtag) {
    window.gtag('event', 'pwa_installed', {
      event_category: 'pwa',
      event_label: 'installation',
      value: 1,
    })
  }

  // Record install status in localStorage for later use
  try {
    localStorage.setItem('pwaInstalled', 'true')
    localStorage.setItem('pwaInstallDate', new Date().toISOString())
  } catch (err) {
    console.error('Failed to save installation status:', err)
  }
}

/**
 * Get browser-specific install instructions
 * @returns {Object} Installation instructions for different browsers
 */
export function getBrowserInstallInstructions() {
  const ua = navigator.userAgent

  // Detect browser
  const isChromium = /Chrome/.test(ua) && /Google Inc/.test(navigator.vendor)
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua)
  const isFirefox = /Firefox/.test(ua)
  const isEdge = /Edg/.test(ua)
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream
  const isAndroid = /Android/.test(ua)

  let instructions = {
    title: 'Instal JantungIn',
    steps: [],
  }

  if (isIOS && isSafari) {
    instructions.steps = [
      'Ketuk ikon "Share" di bagian bawah browser',
      'Gulir ke bawah dan ketuk "Add to Home Screen"',
      'Ketuk "Add" di pojok kanan atas',
    ]
  } else if (isAndroid && isChromium) {
    instructions.steps = [
      'Ketuk ikon menu (⋮) di pojok kanan atas',
      'Pilih "Install app" atau "Add to Home screen"',
      'Ikuti petunjuk untuk menyelesaikan instalasi',
    ]
  } else if (isChromium || isEdge) {
    instructions.steps = [
      'Ketuk ikon menu (⋮) di pojok kanan atas',
      'Pilih "Install JantungIn..." atau "Add to desktop"',
      'Konfirmasi dengan klik "Install"',
    ]
  } else if (isFirefox) {
    instructions.steps = [
      'Ketuk ikon menu (≡) di pojok kanan atas',
      'Pilih "Install app" jika tersedia',
      'Jika tidak tersedia, aplikasi ini mungkin tidak dapat diinstal di browser Firefox versi Anda',
    ]
  } else {
    instructions.steps = [
      'Untuk menginstal aplikasi ini, buka halaman di browser Chrome atau Safari',
      'Ikuti petunjuk instalasi sesuai dengan browser Anda',
    ]
  }

  return instructions
}

/**
 * Check if the app meets installability requirements
 * @returns {Object} Installability status and any missing requirements
 */
export function checkInstallabilityRequirements() {
  const requirements = {
    hasManifest: !!document.querySelector('link[rel="manifest"]'),
    hasServiceWorker: 'serviceWorker' in navigator,
    hasInstallPromptSupport:
      window.BeforeInstallPromptEvent !== undefined || 'onbeforeinstallprompt' in window,
    isSecureContext: window.isSecureContext,
    isStandalone:
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true,
    hasSufficientIcons: false, // Will be set below
    isAlreadyInstalled: localStorage.getItem('pwaInstalled') === 'true',
  }

  // Check for icons in the manifest
  const manifestLink = document.querySelector('link[rel="manifest"]')
  if (manifestLink) {
    fetch(manifestLink.href)
      .then((response) => response.json())
      .then((manifest) => {
        requirements.hasSufficientIcons =
          manifest.icons &&
          manifest.icons.length >= 2 &&
          manifest.icons.some((icon) => parseInt(icon.sizes.split('x')[0]) >= 192)
      })
      .catch((err) => {
        console.error('Failed to fetch manifest:', err)
      })
  }

  return {
    canBeInstalled:
      requirements.hasManifest &&
      requirements.hasServiceWorker &&
      requirements.isSecureContext &&
      !requirements.isStandalone &&
      !requirements.isAlreadyInstalled,
    requirements,
  }
}

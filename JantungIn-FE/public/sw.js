// Service Worker for JantungIn PWA
const CACHE_NAME = 'jantungin-cache-v3'
const API_CACHE = 'jantungin-api-v2'
const OFFLINE_PAGE = '/offline.html'

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  OFFLINE_PAGE,
  '/app.webmanifest',
  '/manifest.webmanifest',
  '/src/main.js',
  '/src/assets/main.css',
  '/src/assets/logo.png',
  '/logo.png',
  '/favicon.ico',
  '/images/apple-touch-icon.png',
  '/images/pwa-192x192.png',
  '/images/pwa-512x512.png',
  '/images/mask-icon.svg',
  // Add new assets to be cached
  '/src/registerSW.js',
  '/src/utils/pwaUtils.js',
  '/src/utils/pwaHelper.js',
  '/src/components/InstallPWA.vue',
  '/src/components/PWAStatus.vue',
  '/src/components/RefreshApp.vue',
  '/src/components/OfflinePage.vue',
]

// Install event - precache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS)
      })
      .then(() => {
        return self.skipWaiting()
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME
            })
            .map((cacheName) => {
              return caches.delete(cacheName)
            }),
        )
      })
      .then(() => {
        return self.clients.claim()
      }),
  )
})

// Network first with cache fallback strategy
async function networkFirstWithCache(request, cacheName) {
  const cache = await caches.open(cacheName)

  try {
    // Try network first
    const networkResponse = await fetch(request)
    // Cache the fresh data if it's a successful response
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    // Network failed, try to return from cache
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    // If nothing in cache, rethrow error
    throw error
  }
}

// Listen for the skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Fetch event - implement different cache strategies based on request type
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // API requests (network first with cache fallback)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstWithCache(event.request, API_CACHE))
    return
  }

  // For navigation requests, try network first then fallback to cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          // If we have a cached version, return it
          if (cachedResponse) {
            return cachedResponse
          }
          // Otherwise, try to return the offline page
          return caches.match(OFFLINE_PAGE)
        })
      }),
    )
    return
  }

  // For assets, use cache first strategy
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return the response from the cached version
      if (response) {
        return response
      }

      // Not in cache - fetch it live
      return fetch(event.request)
        .then((networkResponse) => {
          // Don't cache responses from API endpoints or external resources
          if (
            !event.request.url.includes('/src/') &&
            !event.request.url.includes('/assets/') &&
            !event.request.url.includes('/images/') &&
            event.request.url.startsWith(self.location.origin)
          ) {
            // Clone the response
            const responseToCache = networkResponse.clone()

            // Open cache and add the new response
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }

          return networkResponse
        })
        .catch(() => {
          // If both cache and network fail, show offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/')
          }

          // For image requests, you could return a default offline image
          if (event.request.destination === 'image') {
            return caches.match('/images/offline-image.png')
          }

          return new Response('Network error happened', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' },
          })
        })
    }),
  )
})

// Handle push notifications (if needed in the future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()

    const options = {
      body: data.body,
      icon: '/images/pwa-192x192.png',
      badge: '/images/apple-touch-icon.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/',
      },
    }

    event.waitUntil(self.registration.showNotification('JantungIn', options))
  }
})

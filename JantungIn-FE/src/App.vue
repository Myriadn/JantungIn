<script setup>
import Navbar from '@/components/Navbar.vue'
import NavbarAdmin from '@/components/Navbar-admin.vue'
import OfflinePage from '@/components/OfflinePage.vue'
import InstallPWA from '@/components/InstallPWA.vue'
import RefreshApp from '@/components/RefreshApp.vue'
import PWAStatus from '@/components/PWAStatus.vue'
import AdPopupComponent from '@/components/AdPopupComponent.vue'
import { useRoute } from 'vue-router'
import { computed, ref, onMounted, onUnmounted } from 'vue'

const route = useRoute()
const isOnline = ref(navigator.onLine)
const offlineAlert = ref(false)
const installPwa = ref(null)

// Check if the current route corresponds to an admin page
const isAdminPage = computed(() => {
  // Admin route names - keep this list in sync with router/index.js
  const adminRouteNames = [
    'homeAdmin', // HomeAdminPage
    'diagnoseAdmin', // DiagnoseAdminPage
    'historyAdmin', // HistoryAdminPage
    'newsAdmin', // NewsAdminPage
    'resultAdmin', // ResultAdminPage
    'accountAdmin', // AccountAdminPage
  ]

  // Check if current route name is in the admin routes list
  return adminRouteNames.includes(route.name)
})

// Network status handlers
const handleOnline = () => {
  isOnline.value = true
  offlineAlert.value = false
}

const handleOffline = () => {
  isOnline.value = false
  offlineAlert.value = true
  // Hide alert after 5 seconds
  setTimeout(() => {
    offlineAlert.value = false
  }, 5000)
}

onMounted(() => {
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})
</script>

<template>
  <!-- Application Shell Architecture -->
  <div class="flex flex-col min-h-screen">
    <!-- Static Shell Content (Header) -->
    <header>
      <!-- Show admin navbar for admin pages -->
      <NavbarAdmin v-if="isAdminPage && route.name !== 'admin'" />
      <!-- Show regular navbar for user pages -->
      <Navbar
        v-if="
          !isAdminPage &&
          route.name !== 'login' &&
          route.name !== 'register' &&
          route.name !== 'admin'
        "
      />
    </header>

    <!-- Offline Alert -->
    <div
      v-if="offlineAlert"
      class="bg-yellow-500 text-white text-center py-2 px-4 fixed top-16 left-0 right-0 z-50 transition-all duration-300"
    >
      You're currently offline. Some features may be limited.
    </div>

    <!-- Dynamic Content Area -->
    <main class="flex-grow">
      <!-- Display offline page when offline -->
      <OfflinePage v-if="!isOnline" />

      <!-- Display normal content when online with page transition -->
      <transition name="page" mode="out-in" v-else>
        <router-view />
      </transition>
    </main>

    <!-- Static Shell Content (Footer) -->
    <footer>
      <!-- Footer content if needed -->
    </footer>

    <!-- PWA Components -->
    <InstallPWA ref="installPwa" />
    <RefreshApp />
    <PWAStatus />

    <!-- Ad Popup Component -->
    <AdPopupComponent />
  </div>
</template>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  display: flex;
  flex-direction: column;
}

/* Ensure pages have proper spacing from navbar */
main {
  min-height: calc(100vh - 4rem); /* 4rem = 64px (height of navbar) */
}

/* Page transition animations */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>

<script setup>
import Navbar from '@/components/Navbar.vue'
import NavbarAdmin from '@/components/Navbar-admin.vue'
import OfflinePage from '@/components/OfflinePage.vue'
import { useRoute } from 'vue-router'
import { computed, ref, onMounted, onUnmounted } from 'vue'

const route = useRoute()
const isOnline = ref(navigator.onLine)
const offlineAlert = ref(false)

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
    <main
      :class="[
        isAdminPage ||
        (route.name !== 'login' && route.name !== 'register' && route.name !== 'admin')
          ? 'flex-grow pt-16'
          : 'flex-grow',
      ]"
    >
      <router-view v-if="isOnline" />
      <OfflinePage v-else />
    </main>

    <!-- Static Shell Content (Footer) -->
    <footer class="bg-blue-600 text-white text-xs py-2 text-center mt-auto" v-if="isOnline && route.name !== 'login' && route.name !== 'register' && route.name !== 'admin'">
      JantungIn &copy; 2025 - Heart Health Monitoring App
    </footer>
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
</style>

<script setup>
import Navbar from '@/components/Navbar.vue'
import NavbarAdmin from '@/components/Navbar-admin.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

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
</script>

<template>
  <div class="flex flex-col min-h-screen">
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
    <main
      :class="[
        isAdminPage ||
        (route.name !== 'login' && route.name !== 'register' && route.name !== 'admin')
          ? 'flex-grow pt-20'
          : 'flex-grow',
      ]"
    >
      <router-view />
    </main>
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

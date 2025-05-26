<script setup>
import Navbar from '@/components/Navbar.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Only show navbar on pages other than login and register -->
    <Navbar v-if="route.name !== 'login' && route.name !== 'register'" />
    <main :class="[route.name !== 'login' && route.name !== 'register' ? 'flex-grow pt-20' : 'flex-grow']">
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

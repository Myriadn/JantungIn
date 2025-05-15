<script setup>
import Navbar from '@/components/Navbar.vue'
import LandingPage from '@/components/LandingPage.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <main class="flex-grow pt-20">
      <!-- Konten halaman akan masuk di sini -->
       <LandingPage />
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

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineOptions({
  name: 'NavBar',
})

const menuItems = ref([
  { name: 'News', path: '/news' },
  { name: 'History', path: '/history' },
])

// State untuk menu mobile
const showMobileMenu = ref(false)

// Using vue-router for navigation
const route = useRoute()
const router = useRouter()
</script>

<template>
  <header
    class="bg-gradient-to-r from-blue-600 to-blue-500 text-white fixed top-0 left-0 right-0 z-50 shadow-lg"
  >
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo & Brand Section (Kiri) -->
        <div class="flex items-center gap-2">
          <div class="relative group">
            <div class="relative bg-white rounded-full p-1.5">
              <img src="@/assets/logo.png" class="h-9 w-9" alt="JantungIn Logo" />
            </div>
          </div>
          <div>
            <span class="text-2xl font-bold text-white tracking-tight">JantungIn</span>
            <div class="text-xs text-blue-200 -mt-1">Heart Health Monitoring</div>
          </div>
        </div>

        <!-- Menu Items & Account (Kanan) -->
        <div class="flex items-center">
          <!-- Menu Items -->
          <nav class="hidden md:flex items-center mr-4">
            <router-link
              v-for="item in menuItems"
              :key="item.path"
              :to="item.path"
              class="px-4 py-2 mx-1 font-medium transition-all duration-200 rounded-md hover:bg-blue-700 overflow-hidden relative group"
              :class="{
                'bg-blue-700 shadow-md': route.path === item.path,
              }"
            >
              <span class="relative z-10">{{ item.name }}</span>
              <span
                class="absolute inset-0 bg-white opacity-0 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 group-hover:opacity-10"
              ></span>
            </router-link>
          </nav>

          <!-- Mobile Menu Button -->
          <button
            class="md:hidden flex items-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 mr-2"
            @click="showMobileMenu = !showMobileMenu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <!-- Account Button -->
          <div class="flex items-center">
            <div class="relative group">
              <button
                @click="router.push('/account')"
                class="flex items-center px-3 py-1.5 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-colors shadow-md cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span class="font-medium">Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div
        v-if="showMobileMenu"
        class="md:hidden bg-blue-600 mt-2 pb-3 rounded-b-lg shadow-lg animate-slideDown"
      >
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="block px-4 py-2 text-white hover:bg-blue-700 transition-colors"
          :class="{ 'bg-blue-700': route.path === item.path }"
        >
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Animasi hover */
nav a {
  position: relative;
  overflow: hidden;
}

nav a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: white;
  transition: width 0.3s ease;
}

nav a:hover::after {
  width: 100%;
}

/* Fix untuk UI yang lebih konsisten */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.group:hover .group-hover\:scale-x-100 {
  transform: scaleX(1);
}

/* Animasi untuk menu mobile */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideDown {
  animation: slideDown 0.2s ease-out forwards;
}
</style>

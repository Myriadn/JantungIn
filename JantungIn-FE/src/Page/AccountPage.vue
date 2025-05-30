<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import FooterComponent from '@/components/Footer-component.vue'

defineOptions({
  name: 'AccountPage',
})

const router = useRouter()

// User information (mock data)
const user = ref({
  name: 'Bener Dzero',
  nik: '1234567890123456',
  email: 'bener.dzero@example.com',
  lastLogin: (() => {
    const date = new Date()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const day = date.getDate()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}, ${hours}.${minutes}`
  })(),
})

// Logout function
const logout = () => {
  // In a real app, you would clear tokens or session data here
  router.push('/') // Redirect to login page
}
</script>

<template>
  <div class="account-page">
    <!-- Main section with blue background -->
    <div class="bg-gradient-to-b from-blue-500 via-blue-600 to-indigo-700 min-h-screen">
      <div class="max-w-3xl mx-auto py-8 px-4">
        <!-- Account card -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden mt-12">
          <!-- Header -->
          <div class="text-center pt-8 pb-6">
            <div class="inline-block bg-blue-100 rounded-full p-4 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-12 w-12 text-blue-600"
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
            </div>
            <h2 class="text-2xl font-bold text-gray-800">Account</h2>
          </div>

          <!-- Form Fields -->
          <div class="p-6 pt-0">
            <div class="space-y-4">
              <!-- Name -->
              <div>
                <label class="block text-gray-700 text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  v-model="user.name"
                  readonly
                  class="w-full px-3 py-2 border rounded-md focus:outline-none bg-gray-100 cursor-default"
                />
              </div>

              <!-- NIK -->
              <div>
                <label class="block text-gray-700 text-sm font-medium mb-1">NIK</label>
                <input
                  type="text"
                  v-model="user.nik"
                  readonly
                  class="w-full px-3 py-2 border rounded-md focus:outline-none bg-gray-100 cursor-default"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-gray-700 text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  v-model="user.email"
                  readonly
                  class="w-full px-3 py-2 border rounded-md focus:outline-none bg-gray-100 cursor-default"
                />
              </div>

              <!-- Last Login -->
              <div>
                <label class="block text-gray-700 text-sm font-medium mb-1">Last Login</label>
                <input
                  type="text"
                  v-model="user.lastLogin"
                  readonly
                  class="w-full px-3 py-2 border rounded-md focus:outline-none bg-gray-100 cursor-default"
                />
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-8 flex justify-end">
              <button
                @click="logout"
                class="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Component -->
    <FooterComponent />
  </div>
</template>

<style scoped>
.account-page {
  margin-top: -1rem;
}

/* Form styling */
input:focus {
  outline: none;
}

/* Button hover effects */
button {
  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>

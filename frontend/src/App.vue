<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm" v-if="isAuthenticated">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/dashboard" class="text-xl font-bold text-gray-900">
                SalesForce Dashboard
              </router-link>
            </div>
          </div>
          <div class="flex items-center">
            <button 
              @click="handleLogout"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAuthenticated = ref(false)

onMounted(() => {
  isAuthenticated.value = localStorage.getItem('token') !== null
})

const handleLogout = () => {
  localStorage.removeItem('token')
  isAuthenticated.value = false
  router.push('/login')
}
</script>

<style>
/* Add any global styles here */
</style>

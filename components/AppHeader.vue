<template>
  <header class="bg-green-600 text-white p-3 md:p-4 shadow-md">
    <div class="container mx-auto flex flex-wrap items-center justify-between">
      <!-- Left side: Logo and site name -->
      <NuxtLink to="/" class="flex items-center">
        <img src="/pb-logo.png" alt="Pickleball Matcher Logo" class="h-7 w-7 md:h-8 md:w-8 mr-2 md:mr-3">
        <h1 class="text-xl md:text-2xl font-bold truncate">Pickleball Matcher</h1>
      </NuxtLink>

      <!-- Right side: User profile and logout -->
      <div v-if="isAuthenticated" class="flex items-center space-x-2 md:space-x-4 mt-1 md:mt-0">
        <img v-if="user?.picture" :src="user.picture" alt="Profile" class="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white">
        <span class="font-medium hidden sm:inline">{{ user?.name }}</span>
        <button @click="logout"
          class="bg-green-700 hover:bg-green-800 text-white px-2 py-1 md:px-3 md:py-1 rounded text-sm transition duration-300">
          Logout
        </button>
      </div>
      <NuxtLink v-else to="/login"
        class="bg-green-700 text-white px-3 py-1 md:px-4 md:py-2 rounded hover:bg-green-800 transition duration-300 text-sm md:text-base">
        Login
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const { user, isAuthenticated } = storeToRefs(authStore)
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
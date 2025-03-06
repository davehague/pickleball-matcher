<template>
  <header class="bg-green-600 text-white p-4 shadow-md">
    <div class="container mx-auto flex items-center justify-between">
      <!-- Left side: Logo and site name -->
      <NuxtLink to="/">
        <div class="flex items-center">
          <img src="/pb-logo.png" alt="Pickleball Matcher Logo" class="h-8 w-8 mr-3">
          <h1 class="text-2xl font-bold">Pickleball Matcher</h1>
        </div>
      </NuxtLink>

      <!-- Right side: User profile and logout -->
      <div v-if="isAuthenticated" class="flex items-center space-x-4">
        <img v-if="user?.picture" :src="user.picture" alt="Profile" class="w-8 h-8 rounded-full bg-white">
        <span class="font-medium">{{ user?.name }}</span>
        <button @click="logout"
          class="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded text-sm transition duration-300">
          Logout
        </button>
      </div>
      <NuxtLink v-else to="/login"
        class="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition duration-300">
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
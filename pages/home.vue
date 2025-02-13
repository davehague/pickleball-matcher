<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <img :src="authStore.user?.picture" :alt="authStore.user?.name" class="w-16 h-16 rounded-full">
          <div>
            <h1 class="text-2xl font-bold">Welcome, {{ authStore.user?.name }}!</h1>
            <p class="text-gray-600">{{ authStore.user?.email }}</p>
          </div>
        </div>
        <button @click="handleLogout"
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};
</script>

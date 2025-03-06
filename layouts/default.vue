<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Header (now uses AppHeader component) -->
    <AppHeader />

    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="container mx-auto flex space-x-1">
        <NuxtLink v-for="tab in tabs" :key="tab.id" :to="tab.path" :class="`p-4 font-medium ${activeTab === tab.id
          ? 'text-green-600 border-b-2 border-green-600'
          : 'text-gray-600'
          }`">
          {{ tab.name }}
        </NuxtLink>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow container mx-auto p-4">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white p-4 border-t border-gray-200 text-center text-gray-500 text-sm">
      Pickleball Matcher • Group Play Made Simple
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '~/components/AppHeader.vue'

export default defineComponent({
  name: 'DefaultLayout',
  components: {
    AppHeader
  },
  setup() {
    const route = useRoute()

    const tabs = [
      { id: 'matches', name: 'Matches', path: '/matches' },
      { id: 'availability', name: 'Set Availability', path: '/availability' },
      { id: 'group', name: 'Group', path: '/group' },
      { id: 'profile', name: 'Profile', path: '/profile' }
    ]

    const activeTab = computed(() => {
      // Map the route path to the tab id
      const path = route.path

      if (path === '/') return 'matches'

      // Remove leading slash and potential trailing slashes
      const routePath = path.replace(/^\/|\/$/g, '')

      // Find the matching tab
      const tab = tabs.find(tab => tab.id === routePath)
      return tab ? tab.id : 'matches'
    })

    return {
      tabs,
      activeTab
    }
  }
})
</script>
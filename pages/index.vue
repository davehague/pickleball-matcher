<!-- src/pages/index.vue -->
<template>
  <MatchesPage />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import MatchesPage from './matches.vue'

export default defineComponent({
  name: 'IndexPage',
  components: {
    MatchesPage
  },
  setup() {
    onMounted(async () => {
      try {
        const response = await fetch('/api/database/db-time')
        const data = await response.json()
        console.log('Database response:', data)
      } catch (err) {
        console.error('Error fetching database time:', err)
      }
    })
  }
})
</script>
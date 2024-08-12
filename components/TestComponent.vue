<template>
  <div>
    Test component
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const eventsStore = useAppStore()
</script>

<style scoped>
</style>
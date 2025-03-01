// src/components/LocationPreferences.vue
<template>
    <div>
        <h4 class="text-sm font-medium text-gray-700 mb-2">Location Preferences</h4>
        <div class="space-y-2">
            <LocationPreferenceItem v-for="location in locations" :key="location.id" :location="location"
                @update-preference="$emit('update-preference', location.id, $event)" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { Location } from '~/types/index'
import LocationPreferenceItem from '@/components/LocationPreferenceItem.vue'

export default defineComponent({
    name: 'LocationPreferences',
    components: {
        LocationPreferenceItem
    },
    props: {
        locations: {
            type: Array as PropType<Location[]>,
            required: true
        }
    },
    emits: ['update-preference']
})
</script>
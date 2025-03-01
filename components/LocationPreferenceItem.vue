// src/components/LocationPreferenceItem.vue
<template>
    <div class="flex justify-between items-center p-2 border border-gray-200 rounded">
        <div class="flex items-center">
            <MapPin :size="16" class="text-gray-500 mr-2" />
            <span class="text-sm">{{ location.name }}</span>
        </div>
        <select :value="location.preference"
            @change="$emit('update-preference', ($event.target as HTMLSelectElement).value)"
            class="text-xs px-2 py-1 rounded" :class="preferenceStyles[location.preference].class">
            <option v-for="(style, pref) in preferenceStyles" :key="pref" :value="pref" :class="style.class">
                {{ pref }}
            </option>
        </select>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, computed } from 'vue'
import { MapPin } from 'lucide-vue-next'
import type { Location } from '~/types/index'

export default defineComponent({
    name: 'LocationPreferenceItem',
    components: {
        MapPin
    },
    props: {
        location: {
            type: Object as PropType<Location>,
            required: true
        }
    },
    emits: ['update-preference'],
    setup() {
        const preferenceStyles = {
            'Preferred': {
                class: 'bg-green-100 text-green-800'
            },
            'OK, but not preferred': {
                class: 'bg-yellow-100 text-yellow-800'
            },
            'Do not want to play here': {
                class: 'bg-red-100 text-red-800'
            }
        }

        return {
            preferenceStyles
        }
    }
})
</script>
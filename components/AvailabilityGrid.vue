// src/components/AvailabilityGrid.vue
<template>
    <div class="mb-4">
        <h3 class="text-sm font-medium text-gray-700 mb-2">Select your available time slots:</h3>
        <div class="overflow-x-auto">
            <div class="min-w-max">
                <div class="grid grid-cols-8 gap-2 text-center border-b border-gray-200 pb-2 mb-2">
                    <div class="text-xs font-medium text-gray-500">Time Slot</div>
                    <div v-for="day in days" :key="day" class="text-xs font-medium text-gray-700">
                        {{ day }}
                    </div>
                </div>

                <div v-for="timeSlot in timeSlots" :key="timeSlot"
                    class="grid grid-cols-8 gap-2 mb-1 border-b border-gray-100 pb-1">
                    <div class="text-xs font-medium text-gray-700 flex items-center">
                        {{ timeSlot }}
                    </div>
                    <button v-for="day in days" :key="`${day}-${timeSlot}`" class="p-2 rounded text-xs font-medium"
                        :class="availability[day][timeSlot] ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'"
                        @click="$emit('toggle-availability', day, timeSlot)">
                        <component :is="availability[day][timeSlot] ? CheckIcon : XIcon" :size="14" class="mx-auto" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { Check as CheckIcon, X as XIcon } from 'lucide-vue-next'
import type { Availability } from '~/types/index'

export default defineComponent({
    name: 'AvailabilityGrid',
    components: {
        CheckIcon,
        XIcon
    },
    props: {
        days: {
            type: Array as PropType<string[]>,
            required: true
        },
        timeSlots: {
            type: Array as PropType<string[]>,
            required: true
        },
        availability: {
            type: Object as PropType<Availability>,
            required: true
        }
    },
    setup() {
        return {
            CheckIcon,
            XIcon
        }
    },
    emits: ['toggle-availability']
})
</script>
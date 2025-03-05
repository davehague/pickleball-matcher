<template>
    <div class="flex items-center space-x-2">
        <button class="p-1 text-gray-600 border border-gray-300 rounded-md" @click="previousWeek"
            :disabled="!hasPreviousWeek">
            &lt;
        </button>
        <select class="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm" v-model="localSelectedWeek"
            @change="weekSelected">
            <option v-for="week in availableWeeks" :key="week.id" :value="week.id">
                {{ week.label }}
            </option>
        </select>
        <button class="p-1 text-gray-600 border border-gray-300 rounded-md" @click="nextWeek" :disabled="!hasNextWeek">
            &gt;
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref, computed, watch } from 'vue'
import type { Week } from '~/types'

export default defineComponent({
    name: 'WeekSelector',
    props: {
        selectedWeek: {
            type: Object as PropType<Week>,
            required: true
        },
        availableWeeks: {
            type: Array as PropType<Week[]>,
            required: true
        }
    },
    emits: ['week-change'],
    setup(props, { emit }) {
        // Track the currently selected week by ID for the dropdown
        const localSelectedWeek = ref(props.selectedWeek.id)

        // Update local week when prop changes
        watch(() => props.selectedWeek, (newWeek) => {
            localSelectedWeek.value = newWeek.id
        })

        // Helper to find a week's index
        const currentWeekIndex = computed(() => {
            return props.availableWeeks.findIndex(week => week.id === localSelectedWeek.value)
        })

        // Check if navigation buttons should be enabled
        const hasPreviousWeek = computed(() => currentWeekIndex.value > 0)
        const hasNextWeek = computed(() => currentWeekIndex.value < props.availableWeeks.length - 1)

        // Handler for direct selection
        const weekSelected = () => {
            const week = props.availableWeeks.find(week => week.id === localSelectedWeek.value)
            if (week) {
                emit('week-change', week)
            }
        }

        // Handlers for navigation buttons
        const previousWeek = () => {
            if (hasPreviousWeek.value) {
                const newWeek = props.availableWeeks[currentWeekIndex.value - 1]
                localSelectedWeek.value = newWeek.id
                emit('week-change', newWeek)
            }
        }

        const nextWeek = () => {
            if (hasNextWeek.value) {
                const newWeek = props.availableWeeks[currentWeekIndex.value + 1]
                localSelectedWeek.value = newWeek.id
                emit('week-change', newWeek)
            }
        }

        return {
            localSelectedWeek,
            hasPreviousWeek,
            hasNextWeek,
            weekSelected,
            previousWeek,
            nextWeek
        }
    }
})
</script>
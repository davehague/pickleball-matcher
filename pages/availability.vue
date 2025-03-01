<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-800">Weekly Availability</h2>
            <WeekSelector :selected-week="selectedWeek" :available-weeks="availableWeeks"
                @week-change="handleWeekChange" />
        </div>

        <div class="bg-white rounded-lg shadow p-4">
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">How many times would you like to play per
                    week?</label>
                <select v-model="playFrequency" class="w-full p-2 border border-gray-300 rounded bg-white">
                    <option v-for="option in playFrequencyOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                    </option>
                </select>
            </div>

            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Play preferences:</label>
                <div class="flex flex-wrap gap-3 mb-3">
                    <label class="flex items-center bg-gray-100 p-2 rounded">
                        <input type="checkbox" v-model="avoidConsecutiveDays" class="mr-2" />
                        <span class="text-sm">Avoid consecutive days</span>
                    </label>
                    <label class="flex items-center bg-gray-100 p-2 rounded">
                        <input type="checkbox" v-model="willingToSubstitute" class="mr-2" />
                        <span class="text-sm">Willing to be a substitute</span>
                    </label>
                </div>
            </div>

            <AvailabilityGrid :days="days" :time-slots="timeSlots" :availability="availability"
                @toggle-availability="toggleAvailability" />

            <div class="flex justify-end">
                <button @click="savePreferences"
                    class="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700">
                    Save Preferences
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { Availability, Week } from '~/types/index'

export default defineComponent({
    name: 'AvailabilityPage',
    setup() {
        // Days and time slots
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        const timeSlots = [
            '6:00-7:00 AM', '7:00-8:00 AM', '8:00-9:00 AM', '9:00-10:00 AM',
            '10:00-11:00 AM', '11:00-12:00 PM', '12:00-1:00 PM', '1:00-2:00 PM',
            '2:00-3:00 PM', '3:00-4:00 PM', '4:00-5:00 PM', '5:00-6:00 PM',
            '6:00-7:00 PM', '7:00-8:00 PM', '8:00-9:00 PM', '9:00-10:00 PM'
        ]

        // Available weeks for selection
        const availableWeeks = ref<Week[]>([
            { id: 1, label: 'Feb 26 - Mar 4' },
            { id: 2, label: 'Mar 5 - Mar 11' },
            { id: 3, label: 'Mar 12 - Mar 18' },
            { id: 4, label: 'Mar 19 - Mar 25' }
        ])

        // Selected week
        const selectedWeek = ref<Week>(availableWeeks.value[0])

        // Play preferences
        const playFrequencyOptions = [
            { value: 1, label: '1 time per week' },
            { value: 2, label: '2 times per week' },
            { value: 3, label: '3 times per week' },
            { value: 4, label: '4+ times per week' }
        ]
        const playFrequency = ref(2)
        const avoidConsecutiveDays = ref(false)
        const willingToSubstitute = ref(true)

        // Initialize availability grid with random data
        const generateInitialAvailability = (): Availability => {
            const grid: Availability = {}

            for (const day of days) {
                grid[day] = {}
                for (const slot of timeSlots) {
                    // Randomly set some slots as available
                    grid[day][slot] = Math.random() > 0.7
                }
            }

            return grid
        }

        const availability = ref<Availability>(generateInitialAvailability())

        // Toggle availability for a specific day and time slot
        const toggleAvailability = (day: string, timeSlot: string) => {
            availability.value[day][timeSlot] = !availability.value[day][timeSlot]
        }

        // Handle week change
        const handleWeekChange = (week: Week) => {
            selectedWeek.value = week
            // In a real app, we would fetch data for the selected week
            // For demo purposes, generate new random data
            availability.value = generateInitialAvailability()
        }

        // Save preferences
        const savePreferences = () => {
            // In a real app, this would send data to the server
            console.log('Saving preferences:', {
                week: selectedWeek.value,
                playFrequency: playFrequency.value,
                avoidConsecutiveDays: avoidConsecutiveDays.value,
                willingToSubstitute: willingToSubstitute.value,
                availability: availability.value
            })

            // Show success message (in a real app)
            alert('Preferences saved successfully!')
        }

        return {
            days,
            timeSlots,
            availableWeeks,
            selectedWeek,
            playFrequencyOptions,
            playFrequency,
            avoidConsecutiveDays,
            willingToSubstitute,
            availability,
            toggleAvailability,
            handleWeekChange,
            savePreferences
        }
    }
})
</script>
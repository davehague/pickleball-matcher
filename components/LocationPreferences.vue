// src/components/LocationPreferences.vue
<template>
    <div>
        <h4 class="text-sm font-medium text-gray-700 mb-2">Location Preferences</h4>

        <div v-if="loading" class="flex justify-center py-4">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        </div>

        <div v-else-if="locations.length === 0" class="text-center py-4 text-gray-500">
            No locations available
        </div>

        <div v-else class="space-y-3">
            <div v-for="location in locations" :key="location.id"
                class="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div>
                    <div class="text-sm font-medium text-gray-900">{{ location.name }}</div>
                    <div v-if="location.court_type" class="text-xs text-gray-500">{{ location.court_type }}</div>
                </div>

                <div class="select-wrapper relative">
                    <select :value="location.preference || 'None'"
                        @change="updatePreference(location.id, ($event.target as HTMLSelectElement).value)"
                        class="appearance-none block pl-3 pr-10 py-1.5 text-xs font-medium rounded border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-indigo-500 sm:text-sm"
                        :class="getPreferenceSelectStyle(location.preference || 'None')">
                        <option v-for="option in preferenceOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Location } from '~/types/models';

interface LocationWithPreference extends Location {
    preference?: "Preferred" | "OK" | "Do not want" | "None";
}

interface PreferenceOption {
    label: string;
    value: "Preferred" | "OK" | "Do not want" | "None";
}

const props = defineProps<{
    userId: string;
}>();

const emit = defineEmits<{
    (e: 'update', locationId: string, preference: "Preferred" | "OK" | "Do not want"): void;
}>();

const api = useApi();
const loading = ref(true);
const locations = ref<LocationWithPreference[]>([]);

// Select options for preferences
const preferenceOptions = [
    { label: 'Preferred', value: 'Preferred' },
    { label: 'OK', value: 'OK' },
    { label: 'Do not want', value: 'Do not want' },
    { label: 'No preference', value: 'None' }
];

// Get style for preference select based on current preference
const getPreferenceSelectStyle = (preference: string) => {
    switch (preference) {
        case 'Preferred':
            return 'bg-green-50 text-green-800 border-green-300';
        case 'OK':
            return 'bg-yellow-50 text-yellow-800 border-yellow-300';
        case 'Do not want':
            return 'bg-red-50 text-red-800 border-red-300';
        default:
            return 'bg-gray-50 text-gray-800 border-gray-300';
    }
};

// Update a location preference
const updatePreference = (locationId: string, preferenceValue: string) => {
    // Convert the string value to the correct type
    const preference = preferenceValue as "Preferred" | "OK" | "Do not want" | "None";

    // Find the location and update its preference locally for immediate UI feedback
    const location = locations.value.find(loc => loc.id === locationId);

    if (location) {
        if (preference === 'None') {
            // Remove preference
            location.preference = undefined;
        } else {
            location.preference = preference;
        }
    }

    // Don't emit for "None" as the API doesn't support it (it would delete the preference)
    if (preference !== 'None') {
        // Emit the update event for the parent component to handle the API call
        emit('update', locationId, preference);
    } else {
        // For "None", you might need to handle deletion differently
        // This depends on your API - you might need to add a delete method
        console.log('Preference removed for location:', locationId);
    }
};

// Load all locations and user preferences
const loadLocationsAndPreferences = async () => {
    loading.value = true;
    try {
        // Using the endpoint that fetches locations with preferences
        const response = await api.get<LocationWithPreference[]>('/api/database/locations', {
            params: { withPreferences: 'true', userId: props.userId }
        });

        // Set default preference to "None" for locations without a preference
        console.log('LocationWithPreference response', response);
        locations.value = response.map(loc => ({
            ...loc,
            preference: loc.preference || "None"
        }));
    } catch (error) {
        console.error('Error loading locations and preferences:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(loadLocationsAndPreferences);
</script>

<style scoped>
.select-wrapper select {
    min-width: 120px;
}
</style>
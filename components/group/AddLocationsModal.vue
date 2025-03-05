<template>
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50" @click="$emit('close')"></div>

        <!-- Modal -->
        <div class="relative min-h-screen flex items-center justify-center p-4">
            <div class="relative bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <!-- Header -->
                <div class="p-4 border-b">
                    <h3 class="text-lg font-medium text-gray-900">Add Location</h3>
                    <p class="mt-1 text-sm text-gray-500">
                        Add a location for your group to play at. You can either select an existing location or create a
                        new one.
                    </p>
                </div>

                <!-- Tabs -->
                <div class="border-b border-gray-200">
                    <nav class="flex -mb-px" aria-label="Tabs">
                        <button @click="currentTab = 'existing'" :class="[
                            'w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm',
                            currentTab === 'existing'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        ]">
                            Existing Locations
                        </button>
                        <button @click="currentTab = 'new'" :class="[
                            'w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm',
                            currentTab === 'new'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        ]">
                            New Location
                        </button>
                    </nav>
                </div>

                <!-- Content -->
                <div class="p-4">
                    <!-- Existing Locations Tab -->
                    <div v-if="currentTab === 'existing'">
                        <div v-if="loading" class="flex justify-center py-8">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                        <div v-else>
                            <div class="mb-4">
                                <input v-model="searchTerm" type="text" placeholder="Search locations..."
                                    class="w-full px-3 py-2 border rounded-md" />
                            </div>
                            <div class="max-h-[300px] overflow-y-auto space-y-2">
                                <div v-for="location in filteredLocations" :key="location.id" :class="[
                                    'p-3 border rounded-md hover:bg-gray-50 cursor-pointer',
                                    selectedLocation?.id === location.id ? 'border-blue-500 bg-blue-50' : ''
                                ]" @click="selectLocation(location)">
                                    <div class="font-medium">{{ location.name }}</div>
                                    <div class="text-sm text-gray-600">{{ location.address }}</div>
                                    <div class="text-sm text-gray-600">{{ location.court_type }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- New Location Tab -->
                    <div v-if="currentTab === 'new'" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Name</label>
                            <input v-model="newLocation.name" type="text" required
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Address</label>
                            <input v-model="newLocation.address" type="text" required
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Court Type</label>
                            <input v-model="newLocation.court_type" type="text" required
                                placeholder="indoor, outdoor, indoor/outdoor"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Phone (optional)</label>
                            <input v-model="newLocation.phone" type="tel"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Website URL (optional)</label>
                            <input v-model="newLocation.url" type="url"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Pricing Information
                                (optional)</label>
                            <textarea v-model="newLocation.pricing_info" rows="3"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="px-4 py-3 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                    <button type="button"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        @click="$emit('close')">
                        Cancel
                    </button>
                    <button v-if="currentTab === 'existing'" type="button" :disabled="!selectedLocation" :class="[
                        'px-4 py-2 text-sm font-medium text-white rounded-md',
                        selectedLocation
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-blue-400 cursor-not-allowed'
                    ]" @click="addExistingLocation">
                        Add Selected Location
                    </button>
                    <button v-else type="button" :disabled="!isValidNewLocation" :class="[
                        'px-4 py-2 text-sm font-medium text-white rounded-md',
                        isValidNewLocation
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-blue-400 cursor-not-allowed'
                    ]" @click="createLocation">
                        Create & Add Location
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Location } from '~/types';

const props = defineProps<{
    show: boolean;
    groupId: string;
    existingLocations: Location[];
}>();

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'location-added'): void;
}>();

const api = useApi();
const currentTab = ref('existing');
const loading = ref(true);
const searchTerm = ref('');
const allLocations = ref<Location[]>([]);
const selectedLocation = ref<Location | null>(null);

const newLocation = ref<Partial<Location>>({
    name: '',
    address: '',
    court_type: '',
    phone: '',
    url: '',
    pricing_info: ''
});

const isValidNewLocation = computed(() => {
    return newLocation.value.name &&
        newLocation.value.address &&
        newLocation.value.court_type;
});

const filteredLocations = computed(() => {
    let locations = allLocations.value.filter(loc =>
        !props.existingLocations.some(existing => existing.id === loc.id)
    );

    if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase();
        locations = locations.filter(loc =>
            loc.name.toLowerCase().includes(term) ||
            loc.address.toLowerCase().includes(term)
        );
    }

    return locations;
});

const loadLocations = async () => {
    try {
        const response = await api.get<Location[]>('/api/database/locations');
        allLocations.value = response;
    } catch (error) {
        console.error('Error loading locations:', error);
    } finally {
        loading.value = false;
    }
};

const selectLocation = (location: Location) => {
    selectedLocation.value = location;
};

const addExistingLocation = async () => {
    if (!selectedLocation.value) return;

    try {
        await api.post('/api/database/groups', {
            groupId: props.groupId,
            locationId: selectedLocation.value.id
        });
        emit('location-added');
        emit('close');
    } catch (error) {
        console.error('Error adding location to group:', error);
    }
};

const createLocation = async () => {
    if (!isValidNewLocation.value) return;

    try {
        // First create the location
        const createdLocation = await api.post<Location>('/api/database/locations', newLocation.value);

        // Then add it to the group
        await api.post('/api/database/groups', {
            groupId: props.groupId,
            locationId: createdLocation.id
        });

        emit('location-added');
        emit('close');
    } catch (error) {
        console.error('Error creating and adding location:', error);
    }
};

onMounted(loadLocations);
</script>
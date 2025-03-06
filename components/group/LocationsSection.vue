<template>
    <section class="bg-white rounded-lg shadow p-4">
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-700">Locations</h3>
            <button v-if="isAdmin"
                class="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                @click="openAddLocationsModal">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Location
            </button>
        </div>

        <div v-if="loading" class="flex justify-center items-center p-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>

        <div v-else-if="groupLocations.length === 0" class="text-center py-8">
            <div class="text-gray-500">No locations added yet</div>
        </div>

        <div v-else class="space-y-3">
            <LocationCard v-for="location in groupLocations" :key="location.id" :location="location"
                :show-remove="isAdmin" @remove="handleRemoveLocation" />
        </div>

        <AddLocationsModal v-if="showAddModal" :show="showAddModal" :group-id="groupId"
            :existing-locations="groupLocations" @close="showAddModal = false" @location-added="handleLocationAdded" />
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Location } from '~/types';
import AddLocationsModal from '@/components/group/AddLocationsModal.vue';
import LocationCard from './LocationCard.vue';

const props = defineProps({
    groupId: {
        type: String,
        required: true,
        // Ensure valid string
        validator: (val: unknown) => typeof val === 'string' && val.length > 0
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

const api = useApi();
const loading = ref(true);
const showAddModal = ref(false);
const groupLocations = ref<Location[]>([]);

const openAddLocationsModal = () => {
    showAddModal.value = true;
};

const loadLocations = async () => {
    if (!props.groupId) return; // Skip loading if groupId is not valid

    try {
        loading.value = true;
        const response = await api.get<Location[]>('/api/database/groups', {
            params: {
                groupId: props.groupId,
                type: 'locations'
            }
        });
        groupLocations.value = response;
    } catch (error) {
        console.error('Error loading locations:', error);
    } finally {
        loading.value = false;
    }
};

const handleLocationAdded = async () => {
    await loadLocations();
};

const handleRemoveLocation = async (locationId: string) => {
    if (!props.groupId) return; // Skip if groupId is not valid

    try {
        await api.delete('/api/database/groups', {
            params: {
                groupId: props.groupId,
                locationId
            }
        });
        await loadLocations();
    } catch (error) {
        console.error('Error removing location:', error);
    }
};

// Watch for changes in groupId
watch(() => props.groupId, (newGroupId) => {
    if (newGroupId) {
        loadLocations();
    }
});

onMounted(() => {
    if (props.groupId) {
        loadLocations();
    }
});
</script>
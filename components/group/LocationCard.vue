<template>
    <div class="border border-gray-200 rounded-lg p-4">
        <div class="flex justify-between">
            <div>
                <h4 class="font-medium text-gray-900">{{ location.name }}</h4>
                <p class="text-sm text-gray-600">{{ location.address }}</p>
                <div class="mt-2 space-y-1">
                    <div v-if="location.phone" class="text-sm text-gray-600 flex items-center">
                        <svg class="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {{ location.phone }}
                    </div>
                    <div v-if="location.url" class="text-sm">
                        <svg class="w-4 h-4 mr-1 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <a :href="location.url" target="_blank" class="text-blue-600 hover:underline">
                            Website
                        </a>
                    </div>
                    <div class="text-sm text-gray-600 flex items-center">
                        <svg class="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10" stroke-width="2" />
                            <circle cx="12" cy="12" r="3" fill="currentColor" />
                        </svg>
                        {{ location.court_type }}
                    </div>
                    <div v-if="location.pricing_info" class="text-sm text-gray-600 flex items-center">
                        <svg class="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ location.pricing_info }}
                    </div>
                </div>
            </div>
            <button v-if="showRemove" class="text-gray-400 hover:text-red-600 p-1"
                @click="$emit('remove', location.id)">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Location } from '~/types';

defineProps<{
    location: Location;
    showRemove?: boolean;
}>();

defineEmits<{
    (e: 'remove', locationId: string): void;
}>();
</script>
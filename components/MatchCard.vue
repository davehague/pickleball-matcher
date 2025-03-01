<template>
    <div
        :class="`p-4 rounded-lg border ${match.confirmed ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`">
        <div class="flex justify-between items-start">
            <div>
                <div class="flex items-center text-gray-700 mb-1">
                    <Calendar :size="16" class="mr-1" />
                    <span class="text-sm font-medium">{{ match.date }}</span>
                </div>
                <div class="flex items-center text-gray-700 mb-1">
                    <Clock :size="16" class="mr-1" />
                    <span class="text-sm">{{ match.time }}</span>
                </div>
                <div class="flex items-center text-gray-700">
                    <MapPin :size="16" class="mr-1" />
                    <span class="text-sm">{{ match.location }}</span>
                </div>
                <div v-if="match.isHost && match.confirmed"
                    class="mt-2 inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    <span class="font-medium">You are the host</span>
                    <span class="ml-1 text-xs">(responsible for reservation)</span>
                </div>
            </div>
            <div class="text-right">
                <div
                    :class="`text-xs font-semibold ${match.confirmed ? 'text-green-600' : 'text-yellow-600'} mb-1 px-2 py-1 rounded-full inline-block ${match.confirmed ? 'bg-green-100' : 'bg-yellow-100'}`">
                    {{ match.confirmed ? 'Confirmed' : 'Pending' }}
                </div>
                <div class="flex items-center justify-end text-gray-600 text-sm mt-2">
                    <Users :size="14" class="mr-1" />
                    <span>{{ match.players.join(", ") }}</span>
                </div>
            </div>
        </div>
        <div class="mt-3 flex justify-end space-x-2">
            <template v-if="!match.confirmed && !match.isPast">
                <button class="px-3 py-1 text-xs bg-green-600 text-white rounded shadow-sm hover:bg-green-700"
                    @click="$emit('confirm', match.id)">
                    Confirm
                </button>
                <button class="px-3 py-1 text-xs bg-red-600 text-white rounded shadow-sm hover:bg-red-700"
                    @click="$emit('decline', match.id)">
                    Decline
                </button>
            </template>
            <button
                class="px-3 py-1 text-xs bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-gray-700"
                @click="$emit('message', match.id)">
                Message Group
            </button>
            <button v-if="match.confirmed && !match.isPast"
                class="px-3 py-1 text-xs bg-red-50 border border-red-300 rounded shadow-sm hover:bg-red-100 text-red-700"
                @click="$emit('cancel', match.id)">
                Cancel
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { Calendar, Clock, MapPin, Users } from 'lucide-vue-next'
import type { Match } from '~/types/index'

export default defineComponent({
    name: 'MatchCard',
    components: {
        Calendar,
        Clock,
        MapPin,
        Users
    },
    props: {
        match: {
            type: Object as PropType<Match>,
            required: true
        }
    },
    emits: ['confirm', 'decline', 'message', 'cancel']
})
</script>
<template>
    <div class="bg-white rounded-lg shadow p-4">
        <h3 class="text-lg font-medium text-gray-700 mb-3">Notifications</h3>
        <div class="space-y-2">
            <div v-for="notification in notifications" :key="notification.id"
                :class="`p-3 bg-${notificationColorMap[notification.type]}-50 border-l-4 border-${notificationColorMap[notification.type]}-400 rounded flex items-start`">
                <component :is="notificationIconMap[notification.type]"
                    :class="`text-${notificationColorMap[notification.type]}-500 mr-2 flex-shrink-0 mt-0.5`"
                    :size="18" />
                <div>
                    <p class="text-sm text-gray-700">{{ notification.message }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, computed } from 'vue'
import { AlertCircle, Check } from 'lucide-vue-next'
import type { Notification } from '~/types/index'

export default defineComponent({
    name: 'NotificationsPanel',
    components: {
        AlertCircle,
        Check
    },
    props: {
        notifications: {
            type: Array as PropType<Notification[]>,
            required: true
        }
    },
    setup() {
        // Maps notification type to color scheme
        const notificationColorMap = {
            'warning': 'yellow',
            'success': 'green',
            'info': 'blue',
            'error': 'red'
        }

        // Maps notification type to icon component
        const notificationIconMap = {
            'warning': AlertCircle,
            'success': Check,
            'info': AlertCircle,
            'error': AlertCircle
        }

        return {
            notificationColorMap,
            notificationIconMap
        }
    }
})
</script>
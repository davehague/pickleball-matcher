// src/components/PreferencesSection.vue
<template>
    <div>
        <h4 class="text-sm font-medium text-gray-700 mb-2">Communication Preferences</h4>
        <div class="flex items-center space-x-4 mb-4">
            <label class="flex items-center">
                <input type="checkbox" :checked="emailNotifications"
                    @change="$emit('update-email-notifications', ($event.target as HTMLInputElement).checked)"
                    class="mr-2" />
                <span>Email notifications</span>
            </label>
            <label class="flex items-center">
                <input type="checkbox" :checked="textNotifications"
                    @change="$emit('update-text-notifications', ($event.target as HTMLInputElement).checked)"
                    class="mr-2" />
                <span>Text notifications</span>
            </label>
        </div>

        <h4 class="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
        <div class="grid grid-cols-1 gap-3 mb-4">
            <div class="flex items-center">
                <span class="text-gray-500 w-24">Phone:</span>
                <span>{{ contactInfo.phone }}</span>
            </div>
            <div class="flex items-center">
                <span class="text-gray-500 w-24">Email:</span>
                <span>{{ contactInfo.email }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { ContactInfo } from '~/types/index'

export default defineComponent({
    name: 'PreferencesSection',
    props: {
        emailNotifications: {
            type: Boolean,
            required: true
        },
        textNotifications: {
            type: Boolean,
            required: true
        },
        contactInfo: {
            type: Object as PropType<ContactInfo>,
            required: true
        }
    },
    emits: ['update-email-notifications', 'update-text-notifications']
})
</script>
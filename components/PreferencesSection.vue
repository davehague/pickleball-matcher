// src/components/PreferencesSection.vue
<template>
    <div>
        <h4 class="text-sm font-medium text-gray-700 mb-2">Communication Preferences</h4>
        <div class="space-y-4">
            <!-- Notification Settings -->
            <div class="space-y-3">
                <div class="flex items-center">
                    <input type="checkbox" id="email-notifications" :checked="emailNotifications"
                        @change="$emit('update-email-notifications', ($event.target as HTMLInputElement).checked)"
                        class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded">
                    <label for="email-notifications" class="ml-2 block text-sm text-gray-700">
                        Email notifications
                    </label>
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="text-notifications" :checked="textNotifications"
                        @change="$emit('update-text-notifications', ($event.target as HTMLInputElement).checked)"
                        class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded">
                    <label for="text-notifications" class="ml-2 block text-sm text-gray-700">
                        Text notifications
                    </label>
                </div>
            </div>

            <!-- Contact Information -->
            <div>
                <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" id="phone" :value="phone"
                    @input="$emit('update-phone', ($event.target as HTMLInputElement).value)"
                    placeholder="(555) 123-4567"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                <p class="mt-1 text-xs text-gray-500">Used for text notifications and match coordination</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    emailNotifications: boolean;
    textNotifications: boolean;
    phone: string;
    email: string;
}>();

defineEmits<{
    (e: 'update-email-notifications', value: boolean): void;
    (e: 'update-text-notifications', value: boolean): void;
    (e: 'update-phone', value: string): void;
}>();
</script>
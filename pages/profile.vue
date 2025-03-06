// src/pages/profile.vue
<template>
    <div class="space-y-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Your Profile</h2>

        <div class="bg-white rounded-lg shadow p-4">
            <ProfileHeader :user="user" />

            <div class="space-y-6">
                <!-- Personal Information Section -->
                <div class="border-b border-gray-200 pb-4">
                    <h3 class="text-lg font-medium text-gray-700 mb-3">Personal Information</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input type="text" id="name" v-model="name"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                placeholder="Your name" />
                        </div>
                        <div>
                            <label for="duprRating" class="block text-sm font-medium text-gray-700 mb-1">DUPR
                                Rating</label>
                            <input type="number" id="duprRating" v-model="duprRating" step="0.1" min="1.0" max="8.0"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                placeholder="Your DUPR rating (1.0-8.0)" />
                            <p class="text-xs text-gray-500 mt-1">DUPR ratings typically range from 1.0 to 8.0</p>
                        </div>
                    </div>
                </div>

                <div v-if="locationPreferenceStatus.loading || locationPreferenceStatus.saving" class="py-2">
                    <div class="flex items-center justify-center">
                        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                        <span class="text-sm text-gray-600">
                            {{ locationPreferenceStatus.saving ? 'Saving preferences...' : 'Loading preferences...' }}
                        </span>
                    </div>
                </div>

                <LocationPreferences v-else :user-id="user.id" @update="updateLocationPreference" />

                <PreferencesSection :email-notifications="emailNotifications" :text-notifications="textNotifications"
                    :phone="phone" :email="user.email" @update-email-notifications="updateEmailNotifications"
                    @update-text-notifications="updateTextNotifications" @update-phone="updatePhone" />
            </div>

            <div class="mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-3">
                <!-- Reset button only visible if there are pending changes -->
                <button v-if="hasChanges" @click="resetChanges"
                    class="px-4 py-2 bg-gray-200 text-gray-800 rounded shadow hover:bg-gray-300">
                    Reset Changes
                </button>

                <button @click="saveProfile" class="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
                    :disabled="isSaving || !hasChanges"
                    :class="{ 'opacity-50 cursor-not-allowed': isSaving || !hasChanges }">
                    {{ isSaving ? 'Saving...' : 'Save Profile' }}
                </button>
            </div>

            <!-- Toast notification for success/error -->
            <div v-if="notification.show" class="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg animate-fadeIn"
                :class="notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ notification.message }}
                <button @click="notification.show = false" class="ml-2 text-gray-700">&times;</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { User } from '~/types/models';
import { useAuthStore } from '#imports';

// User profile data
const authStore = useAuthStore();
const user = computed(() => authStore.user!);

// API client
const api = useApi();

// User personal information
const name = ref(user.value.name);
const duprRating = ref(user.value.dupr_rating || null);

// Original personal information values for change detection
const originalName = ref(user.value.name);
const originalDuprRating = ref(user.value.dupr_rating || null);

// Location preferences state
const locationPreferenceStatus = ref({
    loading: false,
    saving: false,
    error: null as Error | null
});
const pendingLocationPreferences = ref<{ locationId: string; preference: "Preferred" | "OK" | "Do not want" }[]>([]);

// User preferences
const emailNotifications = ref(user.value.notification_email);
const textNotifications = ref(user.value.notification_text);
const phone = ref(user.value.phone || '');

// Original values for change detection
const originalEmailNotifications = ref(user.value.notification_email);
const originalTextNotifications = ref(user.value.notification_text);
const originalPhone = ref(user.value.phone || '');

// Saving state
const isSaving = ref(false);

// Notification toast
const notification = ref({
    show: false,
    type: 'success' as 'success' | 'error',
    message: ''
});

// Check if there are pending changes
const hasChanges = computed(() => {
    return pendingLocationPreferences.value.length > 0 ||
        emailNotifications.value !== originalEmailNotifications.value ||
        textNotifications.value !== originalTextNotifications.value ||
        phone.value !== originalPhone.value ||
        name.value !== originalName.value ||
        duprRating.value !== originalDuprRating.value;
});

// Update location preference
const updateLocationPreference = (locationId: string, preference: "Preferred" | "OK" | "Do not want") => {
    // Check if we already have a pending change for this location
    const existingIndex = pendingLocationPreferences.value.findIndex(p => p.locationId === locationId);

    if (existingIndex >= 0) {
        pendingLocationPreferences.value[existingIndex].preference = preference;
    } else {
        pendingLocationPreferences.value.push({ locationId, preference });
    }
};

// Update email notifications setting
const updateEmailNotifications = (value: boolean) => {
    emailNotifications.value = value;
};

// Update text notifications setting
const updateTextNotifications = (value: boolean) => {
    textNotifications.value = value;
};

// Update phone number
const updatePhone = (value: string) => {
    phone.value = value;
};

// Reset all changes
const resetChanges = () => {
    pendingLocationPreferences.value = [];
    emailNotifications.value = originalEmailNotifications.value;
    textNotifications.value = originalTextNotifications.value;
    phone.value = originalPhone.value;
    name.value = originalName.value;
    duprRating.value = originalDuprRating.value;

    // Show notification
    showNotification('success', 'Changes reset successfully');

    // Force a reload of the location preferences component
    locationPreferenceStatus.value.loading = true;
    setTimeout(() => {
        locationPreferenceStatus.value.loading = false;
    }, 100);
};

// Save all profile changes
const saveProfile = async () => {
    isSaving.value = true;

    try {
        // Save location preferences if there are any pending changes
        if (pendingLocationPreferences.value.length > 0) {
            locationPreferenceStatus.value.saving = true;

            await api.post('/api/database/user-location-preferences', {
                userId: user.value.id,
                preferences: pendingLocationPreferences.value
            });

            pendingLocationPreferences.value = [];
        }

        // Save other profile settings if they've changed
        if (
            emailNotifications.value !== originalEmailNotifications.value ||
            textNotifications.value !== originalTextNotifications.value ||
            phone.value !== originalPhone.value ||
            name.value !== originalName.value ||
            duprRating.value !== originalDuprRating.value
        ) {
            const profileUpdates = {
                id: user.value.id,
                notification_email: emailNotifications.value,
                notification_text: textNotifications.value,
                phone: phone.value,
                name: name.value,
                dupr_rating: duprRating.value
            };

            await api.patch('/api/database/users', profileUpdates);

            // Update original values
            originalEmailNotifications.value = emailNotifications.value;
            originalTextNotifications.value = textNotifications.value;
            originalPhone.value = phone.value;
            originalName.value = name.value;
            originalDuprRating.value = duprRating.value;

            // Update the user in auth store
            authStore.updateUser({
                ...user.value,
                notification_email: emailNotifications.value,
                notification_text: textNotifications.value,
                phone: phone.value,
                name: name.value,
                dupr_rating: duprRating.value
            });
        }

        // Show success notification
        showNotification('success', 'Profile updated successfully!');
    } catch (error) {
        console.error('Error saving profile:', error);
        showNotification('error', 'Failed to update profile. Please try again.');
    } finally {
        isSaving.value = false;
        locationPreferenceStatus.value.saving = false;
    }
};

// Show notification toast
const showNotification = (type: 'success' | 'error', message: string) => {
    notification.value = {
        show: true,
        type,
        message
    };

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.value.show = false;
    }, 3000);
};
</script>

<style scoped>
.animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
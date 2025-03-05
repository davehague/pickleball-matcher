// src/pages/profile.vue
<template>
    <div class="space-y-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Your Profile</h2>

        <div class="bg-white rounded-lg shadow p-4">
            <ProfileHeader :user="user!" />

            <div class="space-y-4">
                <LocationPreferences :locations="locations" @update-preference="updateLocationPreference" />

                <PreferencesSection :email-notifications="emailNotifications" :text-notifications="textNotifications"
                    :contact-info="contactInfo" @update-email-notifications="updateEmailNotifications"
                    @update-text-notifications="updateTextNotifications" />
            </div>

            <div class="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                <button @click="saveProfile"
                    class="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700">
                    Update Profile
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Location, ContactInfo } from '~/types'
import type { User } from '~/types'
import { useAuthStore } from '#imports'

// User profile data
let user = ref<User>();
const authStore = useAuthStore();

user.value = authStore.user!;

// Location preferences
const locations = ref<Location[]>([
    { id: 1, name: 'Downtown Courts', preference: 'Preferred' },
    { id: 2, name: 'Sunset Park', preference: 'OK, but not preferred' },
    { id: 3, name: 'Community Center', preference: 'Preferred' },
    { id: 4, name: 'North Side Club', preference: 'Do not want to play here' }
])

// Notification preferences
const emailNotifications = ref(true)
const textNotifications = ref(false)

// Contact information
const contactInfo = ref<ContactInfo>({
    phone: user.value.phone || '',
    email: user.value.email
})

// Update methods
const updateLocationPreference = (locationId: number, newPreference: string) => {
    const location = locations.value.find(loc => loc.id === locationId)
    if (location) {
        location.preference = newPreference
    }
}

const updateEmailNotifications = (value: boolean) => {
    emailNotifications.value = value
}

const updateTextNotifications = (value: boolean) => {
    textNotifications.value = value
}

// Save profile
const saveProfile = () => {
    // In a real app, this would send the updated profile to the server
    console.log('Saving profile:', {
        user: user.value,
        locations: locations.value,
        emailNotifications: emailNotifications.value,
        textNotifications: textNotifications.value,
        contactInfo: contactInfo.value
    })

    // Show success message (in a real app)
    alert('Profile updated successfully!')
}
</script>
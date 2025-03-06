<!-- pages/onboarding.vue -->
<template>
    <div class="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
        <div class="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 mt-8">
            <!-- Progress Bar -->
            <div class="mb-8">
                <div class="flex justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700">
                        Step {{ currentStep }} of {{ totalSteps }}
                    </span>
                    <span class="text-sm font-medium text-gray-700">
                        {{ progressPercentage }}%
                    </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-green-600 h-2 rounded-full" :style="{ width: `${progressPercentage}%` }"></div>
                </div>
            </div>

            <!-- Step Title -->
            <h1 class="text-2xl font-bold text-gray-900 mb-6">
                {{ currentStepTitle }}
            </h1>

            <!-- Step Content -->
            <div v-if="currentStep === 1" class="space-y-6">
                <!-- Step 1: Contact Information -->
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">Your Name</label>
                    <input type="text" id="name" v-model="onboardingData.basicInfo.name" placeholder="Your full name"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                </div>

                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700">Notification Preferences</label>
                    <div class="flex items-center">
                        <input type="checkbox" id="notificationEmail"
                            v-model="onboardingData.basicInfo.notification_email"
                            class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                        <label for="notificationEmail" class="ml-2 block text-sm text-gray-700">Email
                            Notifications</label>
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" id="notificationText"
                            v-model="onboardingData.basicInfo.notification_text"
                            class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                        <label for="notificationText" class="ml-2 block text-sm text-gray-700">Text
                            Notifications</label>
                    </div>
                </div>

                <!-- Phone number field only shown when text notifications are enabled -->
                <div v-if="onboardingData.basicInfo.notification_text" class="ml-4 mb-8 animate-fadeIn">
                    <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number (for text
                        notifications)</label>
                    <input type="tel" id="phone" v-model="onboardingData.basicInfo.phone" placeholder="555-123-4567"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                </div>

                <div>
                    <label for="dupr" class="block text-sm font-medium text-gray-700">DUPR Rating</label>
                    <input type="number" id="dupr" v-model="onboardingData.basicInfo.dupr_rating" step="0.1" min="2.0"
                        max="8.0" placeholder="3.5"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                    <p class="mt-1 text-sm text-gray-500">
                        Your DUPR rating helps others identify players of similar skill level.
                    </p>
                </div>
            </div>

            <div v-else-if="currentStep === 2" class="space-y-6">
                <!-- Step 2: Play Preferences -->
                <div>
                    <label for="playFrequency" class="block text-sm font-medium text-gray-700">How many times per week
                        do you want to play?</label>
                    <select id="playFrequency" v-model="onboardingData.playPreferences.play_frequency"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                        <option value="1">1 time</option>
                        <option value="2">2 times</option>
                        <option value="3">3 times</option>
                        <option value="4">4 or more times</option>
                    </select>
                </div>

                <div class="space-y-4">
                    <div class="flex items-center">
                        <input type="checkbox" id="avoidConsecutiveDays"
                            v-model="onboardingData.playPreferences.avoid_consecutive_days"
                            class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                        <label for="avoidConsecutiveDays" class="ml-2 block text-sm text-gray-700">Avoid consecutive
                            play days</label>
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" id="willingToSubstitute"
                            v-model="onboardingData.playPreferences.willing_to_substitute"
                            class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                        <label for="willingToSubstitute" class="ml-2 block text-sm text-gray-700">Willing to be a
                            substitute player</label>
                    </div>
                </div>
            </div>

            <div v-else-if="currentStep === 3" class="space-y-6">
                <!-- Step 3: Location Preferences -->
                <div v-if="isLoading" class="flex justify-center my-8">
                    <div class="animate-spin h-8 w-8 border-4 border-green-500 rounded-full border-t-transparent"></div>
                </div>
                <div v-else>
                    <p class="text-sm text-gray-500 mb-4">
                        Select your preference for each location. This helps us match you with games at courts you
                        prefer.
                    </p>

                    <!-- Using the LocationPreferences component with the updateLocationPreference event listener -->
                    <LocationPreferences v-if="userId" :user-id="userId" @update="updateLocationPreference" />
                </div>
            </div>

            <div v-else-if="currentStep === 4" class="space-y-6">
                <!-- Step 4: Availability -->
                <p class="text-sm text-gray-500 mb-4">
                    Select the times you're available to play each week. The system will only match you during these
                    times.
                </p>

                <WeekSelector :selected-week="selectedWeekObj" :available-weeks="availableWeeks"
                    @week-change="handleWeekChange"></WeekSelector>

                <AvailabilityGrid :days="days" :time-slots="timeSlots" :availability="availabilityData"
                    @toggle-availability="toggleAvailability"></AvailabilityGrid>
            </div>

            <div v-else-if="currentStep === 5" class="space-y-6">
                <!-- Step 5: Completion -->
                <div class="text-center">
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                        <svg class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 class="mt-2 text-lg font-medium text-gray-900">You're all set!</h3>
                    <p class="mt-1 text-sm text-gray-500">
                        Your profile has been successfully set up. You're now ready to start matching and playing
                        pickleball with your group!
                    </p>
                </div>

                <div class="mt-5 space-y-4">
                    <h4 class="font-medium text-gray-900">What happens next?</h4>
                    <ul class="list-disc pl-5 text-sm text-gray-500 space-y-2">
                        <li>The system will run its matching algorithm nightly to find compatible players</li>
                        <li>You'll receive notifications when matches are proposed</li>
                        <li>Remember to confirm or decline matches within 24 hours</li>
                        <li>The host rotation system ensures everyone takes turns making court reservations</li>
                    </ul>
                </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="mt-8 flex justify-between">
                <button v-if="currentStep > 1 && currentStep < totalSteps" @click="prevStep"
                    class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Back
                </button>
                <div v-else></div>

                <button v-if="currentStep < totalSteps" @click="nextStep"
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    :disabled="isSubmitting">
                    <span v-if="isSubmitting">Processing...</span>
                    <span v-else-if="currentStep === totalSteps - 1">Finish</span>
                    <span v-else>Next</span>
                </button>
                <button v-else @click="goToDashboard"
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Go to Dashboard
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { Check as CheckIcon, X as XIcon } from 'lucide-vue-next';
import type { User, Location, UserLocationPreference, AvailabilitySlot, OnboardingResponse } from '~/types';
import type { Week, Availability } from '@/types';

const router = useRouter();
const authStore = useAuthStore();
const api = useApi();

// State management
const currentStep = ref(1);
const totalSteps = 5;
const isLoading = ref(false);
const isSubmitting = ref(false);
const selectedWeek = ref(new Date());
const locations = ref<Location[]>([]);
const userId = ref<string>('');

// For availability grid
const days = ref(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
const timeSlots = ref([
    '8 AM', '9 AM', '10 AM', '11 AM', '12 PM',
    '1 PM', '2 PM', '3 PM', '4 PM', '5 PM',
    '6 PM', '7 PM', '8 PM', '9 PM'
]);
const availabilityData = ref<Availability>({
    'Mon': {},
    'Tue': {},
    'Wed': {},
    'Thu': {},
    'Fri': {},
    'Sat': {},
    'Sun': {}
});

// Initialize each time slot as false (not available)
for (const day of days.value) {
    availabilityData.value[day] = {};
    for (const timeSlot of timeSlots.value) {
        availabilityData.value[day][timeSlot] = false;
    }
}

// For week selector
const availableWeeks = ref<Week[]>([]);

// For location preferences
const pendingLocationPreferences = ref<{ locationId: string; preference: "Preferred" | "OK" | "Do not want" }[]>([]);

// Generate available weeks (current week + 3 future weeks)
const initializeWeeks = () => {
    const weeks: Week[] = [];
    const today = new Date();

    for (let i = 0; i < 4; i++) {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() + (i * 7));

        // Adjust to start of week (Monday)
        const dayOfWeek = weekStart.getDay(); // 0 = Sunday, 1 = Monday
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to Monday
        weekStart.setDate(weekStart.getDate() + diff);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        const startStr = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const endStr = weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        weeks.push({
            id: i + 1,
            label: `${startStr} - ${endStr}`
        });
    }

    availableWeeks.value = weeks;
};

// Create computed for selected week object
const selectedWeekObj = computed<Week>(() => {
    return availableWeeks.value.find(w => w.id === 1) || { id: 1, label: 'Current Week' };
});

// Computed properties
const progressPercentage = computed(() => {
    return Math.round((currentStep.value / totalSteps) * 100);
});

const currentStepTitle = computed(() => {
    switch (currentStep.value) {
        case 1:
            return 'Your Contact Information';
        case 2:
            return 'Play Preferences';
        case 3:
            return 'Location Preferences';
        case 4:
            return 'Set Your Availability';
        case 5:
            return 'Setup Complete';
        default:
            return '';
    }
});

// Initialize onboarding data
const onboardingData = ref({
    basicInfo: {
        name: '',
        phone: '',
        dupr_rating: undefined as number | undefined,
        notification_email: true,
        notification_text: false
    },
    playPreferences: {
        play_frequency: 2,
        avoid_consecutive_days: false,
        willing_to_substitute: false
    },
    locationPreferences: [] as UserLocationPreference[],
    availability: [] as AvailabilitySlot[]
});

// When text notifications are disabled, clear the phone number
watch(() => onboardingData.value.basicInfo.notification_text, (newValue) => {
    if (!newValue) {
        onboardingData.value.basicInfo.phone = '';
    }
});

// Methods
const nextStep = async () => {
    if (currentStep.value === 4) {
        // Submit the form before moving to completion step
        await submitOnboarding();
    }

    if (currentStep.value < totalSteps) {
        currentStep.value++;
    }
};

const prevStep = () => {
    if (currentStep.value > 1) {
        currentStep.value--;
    }
};

const goToDashboard = () => {
    router.push('/matches');
};

// Update location preference - match the profile.vue approach
const updateLocationPreference = (locationId: string, preference: "Preferred" | "OK" | "Do not want") => {
    // Check if we already have a pending change for this location
    const existingIndex = pendingLocationPreferences.value.findIndex(p => p.locationId === locationId);

    if (existingIndex >= 0) {
        pendingLocationPreferences.value[existingIndex].preference = preference;
    } else {
        pendingLocationPreferences.value.push({ locationId, preference });
    }

    // Also update the onboardingData structure for the API submission
    onboardingData.value.locationPreferences = pendingLocationPreferences.value.map(pref => ({
        user_id: userId.value,
        location_id: pref.locationId,
        preference: pref.preference
    }));
};

const handleWeekChange = (week: Week) => {
    console.log('Week changed:', week);
    // Here you would typically load availability data for the selected week
    // For now, we'll just reset the grid

    // Reset all time slots
    for (const day of days.value) {
        for (const timeSlot of timeSlots.value) {
            availabilityData.value[day][timeSlot] = false;
        }
    }
};

const toggleAvailability = (day: string, timeSlot: string) => {
    availabilityData.value[day][timeSlot] = !availabilityData.value[day][timeSlot];
    updateAvailabilityFromGrid();
};

const updateAvailabilityFromGrid = () => {
    // Convert the grid data to the format needed for the API
    const availabilitySlots: AvailabilitySlot[] = [];

    if (!userId.value) return;

    // Use the first week by default
    const weekStart = new Date();
    const dayOfWeek = weekStart.getDay(); // 0 = Sunday, 1 = Monday
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to Monday
    weekStart.setDate(weekStart.getDate() + diff);

    // Map day strings to day indices (0 = Monday in our database schema)
    const dayIndices: Record<string, number> = {
        'Mon': 0,
        'Tue': 1,
        'Wed': 2,
        'Thu': 3,
        'Fri': 4,
        'Sat': 5,
        'Sun': 6
    };

    // Map time slots to hour indices (0-23)
    const getHourFromTimeSlot = (timeSlot: string): number => {
        const hour = parseInt(timeSlot.split(' ')[0]);
        const isPM = timeSlot.includes('PM');

        if (isPM && hour !== 12) {
            return hour + 12;
        } else if (!isPM && hour === 12) {
            return 0;
        } else {
            return hour;
        }
    };

    for (const day in availabilityData.value) {
        for (const timeSlot in availabilityData.value[day]) {
            if (availabilityData.value[day][timeSlot]) {
                const dayIndex = dayIndices[day];
                const hourSlot = getHourFromTimeSlot(timeSlot);

                availabilitySlots.push({
                    user_id: userId.value,
                    week_starting: weekStart.toISOString().split('T')[0],
                    day_of_week: dayIndex,
                    hour_slot: hourSlot,
                    availability_type: 'Available'
                });
            }
        }
    }

    onboardingData.value.availability = availabilitySlots;
};

const submitOnboarding = async () => {
    if (!userId.value) return;

    isSubmitting.value = true;
    try {
        // Ensure location preferences from the LocationPreferences component are included
        if (pendingLocationPreferences.value.length > 0) {
            onboardingData.value.locationPreferences = pendingLocationPreferences.value.map(pref => ({
                user_id: userId.value,
                location_id: pref.locationId,
                preference: pref.preference
            }));
        }

        const response = await api.post<User>('/api/database/onboarding', onboardingData.value);

        // Update user in auth store if response is a valid User
        if (response && typeof response === 'object' && 'id' in response) {
            authStore.setUser(response as User);
        }

    } catch (error) {
        console.error('Error submitting onboarding data:', error);
    } finally {
        isSubmitting.value = false;
    }
};

// Check if user already onboarded and pre-fill data if available
const checkOnboardingStatus = () => {
    if (!authStore.user) {
        router.push('/login');
        return;
    }

    // Store the user ID for future use
    userId.value = authStore.user.id;

    // Pre-fill name from auth if available
    if (authStore.user.name) {
        onboardingData.value.basicInfo.name = authStore.user.name;
    }

    // Pre-fill other fields if available
    if (authStore.user.phone) {
        onboardingData.value.basicInfo.phone = authStore.user.phone;
        // If they have a phone number, they probably want text notifications
        onboardingData.value.basicInfo.notification_text = true;
    }

    if (authStore.user.dupr_rating) {
        onboardingData.value.basicInfo.dupr_rating = authStore.user.dupr_rating;
    }

    // If user has already set key preferences, redirect to dashboard
    if (
        authStore.user.dupr_rating &&
        'play_frequency' in authStore.user &&
        authStore.user.play_frequency > 0
    ) {
        router.push('/matches');
    }
};

onMounted(() => {
    initializeWeeks();
    checkOnboardingStatus();
});
</script>

<style scoped>
/* Match the profile.vue animation style */
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
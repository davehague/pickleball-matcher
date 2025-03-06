<template>
    <div class="space-y-6">
        <!-- Hosting Info -->
        <HostingResponsibilities :host-date="hostingDate" :responsibilities="hostingResponsibilities" />

        <!-- Pending Matches -->
        <section class="bg-white rounded-lg shadow p-4">
            <h3 class="text-lg font-medium text-gray-700 mb-3">Pending Confirmation</h3>
            <div class="space-y-4">
                <MatchCard v-for="match in pendingMatches" :key="match.id" :match="match" @confirm="confirmMatch"
                    @decline="declineMatch" @message="messageGroup" @cancel="cancelMatch" />
                <div v-if="pendingMatches.length === 0" class="text-center py-4 text-gray-500">
                    No pending matches to confirm
                </div>
            </div>
        </section>

        <!-- Upcoming Matches -->
        <section class="bg-white rounded-lg shadow p-4">
            <h3 class="text-lg font-medium text-gray-700 mb-3">Upcoming Confirmed Matches</h3>
            <div class="space-y-4">
                <MatchCard v-for="match in confirmedMatches" :key="match.id" :match="match" @message="messageGroup"
                    @cancel="cancelMatch" />
                <div v-if="confirmedMatches.length === 0" class="text-center py-4 text-gray-500">
                    No upcoming matches scheduled
                </div>
            </div>
        </section>

        <!-- Notifications -->
        <NotificationsPanel :notifications="notifications" />

        <!-- Past Matches -->
        <section class="bg-white rounded-lg shadow p-4">
            <h3 class="text-lg font-medium text-gray-700 mb-3">Past Matches</h3>
            <div class="space-y-4">
                <MatchCard v-for="match in pastMatches" :key="match.id" :match="match" @message="messageGroup" />
                <div v-if="pastMatches.length === 0" class="text-center py-4 text-gray-500">
                    No past match history available
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import type { Match, Notification } from '~/types';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
    authStore.logout();
    router.push('/');
};

// Current date range for display
const currentDateRange = ref('Feb 26 - Mar 4');

// Hosting information
const hostingDate = ref('Wednesday, Feb 28');
const hostingResponsibilities = ref([
    'Making the court reservation',
    'Confirming the reservation details with the group',
    'Collecting court fees if applicable'
]);

// Sample match data
const allMatches = ref<Match[]>([
    {
        id: 1,
        date: 'Saturday, Mar 2',
        time: '10:00-12:00 PM',
        location: 'Sunset Park',
        players: ['Morgan', 'Casey', 'Riley', 'You'],
        confirmed: false,
        isHost: false
    },
    {
        id: 2,
        date: 'Monday, Mar 4',
        time: '6:00-8:00 PM',
        location: 'Community Center',
        players: ['Jordan', 'Pat', 'Sam', 'You'],
        confirmed: false,
        isHost: false
    },
    {
        id: 3,
        date: 'Wednesday, Feb 28',
        time: '7:00-9:00 PM',
        location: 'Downtown Courts',
        players: ['Alex', 'Jamie', 'Taylor', 'You'],
        confirmed: true,
        isHost: true
    },
    {
        id: 4,
        date: 'Sunday, Feb 25',
        time: '11:00-1:00 PM',
        location: 'Downtown Courts',
        players: ['Dana', 'Chris', 'Robin', 'You'],
        confirmed: true,
        isHost: false,
        isPast: true
    },
    {
        id: 5,
        date: 'Wednesday, Feb 21',
        time: '7:00-9:00 PM',
        location: 'Sunset Park',
        players: ['Morgan', 'Casey', 'Riley', 'You'],
        confirmed: true,
        isHost: false,
        isPast: true
    }
]);

// Sample notifications
const notifications = ref<Notification[]>([
    {
        id: 1,
        type: 'warning',
        message: 'Your availability is set for the next 7 days. Remember to update it regularly.'
    },
    {
        id: 2,
        type: 'success',
        message: 'Your Wednesday match is confirmed. Court fees are $5 per person.'
    }
]);

// Filtered match lists
const pendingMatches = computed(() =>
    allMatches.value.filter(match => !match.confirmed && !match.isPast)
);

const confirmedMatches = computed(() =>
    allMatches.value.filter(match => match.confirmed && !match.isPast)
);

const pastMatches = computed(() =>
    allMatches.value.filter(match => match.isPast)
);

// Actions
const confirmMatch = (matchId: number) => {
    const match = allMatches.value.find(m => m.id === matchId);
    if (match) {
        match.confirmed = true;
    }
};

const declineMatch = (matchId: number) => {
    allMatches.value = allMatches.value.filter(m => m.id !== matchId);
};

const cancelMatch = (matchId: number) => {
    allMatches.value = allMatches.value.filter(m => m.id !== matchId);
};

const messageGroup = (matchId: number) => {
    console.log(`Opening message group for match ${matchId}`);
};
</script>
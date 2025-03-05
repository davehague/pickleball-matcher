<template>
    <div class="space-y-6">

        <!-- Group Info -->
        <section class="bg-white rounded-lg shadow p-4">
            <h3 class="text-lg font-medium text-gray-700 mb-3">Group Information</h3>
            <div v-if="loading" class="flex justify-center items-center p-4">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
            <div v-else class="space-y-4">
                <div>
                    <div class="font-medium text-gray-700">Description</div>
                    <p class="text-gray-600">{{ currentGroup?.description || 'No description available' }}</p>
                </div>
                <div>
                    <div class="font-medium text-gray-700">Created</div>
                    <p class="text-gray-600">{{ formatDate(currentGroup?.created_at) }}</p>
                </div>
            </div>
        </section>

        <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-800">{{ currentGroup?.name }}</h2>
            <div class="text-sm text-gray-500">{{ members.length }} members</div>
        </div>

        <!-- Group Members -->
        <section class="bg-white rounded-lg shadow p-4">
            <h3 class="text-lg font-medium text-gray-700 mb-3">Members</h3>
            <div v-if="loading" class="flex justify-center items-center p-4">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
            <div v-else-if="memberActionInProgress" class="flex justify-center items-center p-4">
                <div class="text-gray-600">Processing...</div>
            </div>
            <div v-else class="grid md:grid-cols-2 gap-3">
                <MemberCard v-for="member in members" :key="member.userDetails.id" :member="member" :is-admin="isAdmin"
                    @remove-member="removeMember" />
            </div>
        </section>

        <template v-if="isAdmin">
            <section class="space-y-6">
                <InvitationForm :group-id="currentGroup?.id" @invitation-sent="handleInvitationSent" />

                <InvitationsList ref="invitationsList" :group-id="currentGroup?.id"
                    @invitation-cancelled="handleInvitationCancelled" />
            </section>
        </template>

        <!-- Group Message Board (Commented for now) -->
        <!-- <GroupChat :messages="messages" @send-message="sendMessage" /> -->

        <!-- Locations Section -->
        <LocationsSection :group-id="currentGroup?.id" :is-admin="isAdmin" />

        <!-- Alert for success/error messages -->
        <div v-if="alert.show"
            :class="`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${alert.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`">
            {{ alert.message }}
            <button @click="alert.show = false" class="ml-2 text-gray-700">&times;</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { ComponentPublicInstance } from 'vue';

import { useAuthStore } from '@/stores/auth';
import type { GroupUser } from '~/types';
import { format } from 'date-fns';
import LocationsSection from '@/components/group/LocationsSection.vue';
import MemberCard from '@/components/MemberCard.vue';
import InvitationForm from '@/components/group/InvitationForm.vue';
import InvitationsList from '@/components/group/InvitationList.vue';

const authStore = useAuthStore();
const currentGroup = computed(() => authStore.currentGroup);

const members = ref<GroupUser[]>([]);
const loading = ref(true);
const memberActionInProgress = ref(false);
const alert = ref({
    show: false,
    type: 'success',
    message: ''
});

const invitationsList = ref<ComponentPublicInstance & { reload: () => Promise<void> } | null>(null);

const api = useApi();

// Compute if current user is admin
const isAdmin = computed(() => {
    if (!members.value.length || !authStore.user) return false;
    const currentUserMember = members.value.find(
        member => member.userDetails.id === authStore.user?.id
    );
    return currentUserMember?.is_admin ?? false;
});

const formatDate = (date?: string | Date) => {
    if (!date) return 'Unknown';
    return format(new Date(date), 'MMMM d, yyyy');
};

const loadMembers = async () => {
    if (!currentGroup.value?.id) {
        console.error('No group ID available');
        return;
    }

    try {
        // Fetch members data
        const response = await api.get<GroupUser[]>('/api/database/groups', {
            params: {
                groupId: currentGroup.value.id,
                type: 'members'
            }
        });
        members.value = response;
    } catch (error) {
        console.error('Error fetching group data:', error);
        showAlert('error', 'Failed to load group members');
    } finally {
        loading.value = false;
    }
};

const removeMember = async (userId: string) => {
    if (!currentGroup.value?.id) {
        console.error('No group ID available');
        return;
    }

    memberActionInProgress.value = true;

    try {
        await api.delete('/api/database/groups', {
            params: {
                groupId: currentGroup.value.id,
                userId: userId
            }
        });

        // Update the members list after successful removal
        members.value = members.value.filter(member => member.userDetails.id !== userId);

        showAlert('success', 'Member removed successfully');
    } catch (error) {
        console.error('Error removing member:', error);
        showAlert('error', 'Failed to remove member');
    } finally {
        memberActionInProgress.value = false;
    }
};

const handleInvitationSent = () => {
    // Reload the invitations list
    if (invitationsList.value) {
        invitationsList.value.reload();
    }

    // Show success message
    showAlert('success', 'Invitation sent successfully');
};

const handleInvitationCancelled = () => {
    // Show success message
    showAlert('success', 'Invitation cancelled');
};

const showAlert = (type: 'success' | 'error', message: string) => {
    alert.value = {
        show: true,
        type,
        message
    };

    // Auto-hide after 3 seconds
    setTimeout(() => {
        alert.value.show = false;
    }, 3000);
};

onMounted(async () => {
    await loadMembers();
});
</script>
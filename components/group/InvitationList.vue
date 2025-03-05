<template>
    <div class="bg-white rounded-lg shadow p-4">
        <h3 class="text-lg font-medium text-gray-700 mb-3">Pending Invitations</h3>
        <div v-if="loading" class="flex justify-center items-center p-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
        <div v-else-if="invitations.length === 0" class="text-gray-500 text-center py-4">
            No pending invitations
        </div>
        <div v-else class="space-y-3">
            <div v-for="invitation in invitations" :key="invitation.id!"
                class="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200">
                <div>
                    <div class="font-medium">{{ invitation.email }}</div>
                    <div class="text-sm text-gray-500">
                        Invited on {{ formatDate(invitation.created_at) }}
                    </div>
                    <div class="text-xs text-gray-400">
                        Expires: {{ formatDate(invitation.expires_at) }}
                    </div>
                </div>
                <button @click="cancelInvitation(invitation.id!)" class="text-red-500 hover:text-red-700"
                    title="Cancel invitation">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import type { GroupInvitation } from '~/types';

const props = defineProps<{
    groupId: string;
}>();

const emit = defineEmits(['invitation-cancelled']);

const invitations = ref<GroupInvitation[]>([]);
const loading = ref(true);

const api = useApi();

const formatDate = (date?: string | Date) => {
    if (!date) return 'Unknown';
    return format(new Date(date), 'MMM d, yyyy');
};

const loadInvitations = async () => {
    if (!props.groupId) return;

    loading.value = true;

    try {
        const response = await api.get<GroupInvitation[]>('/api/database/groups', {
            params: {
                groupId: props.groupId,
                type: 'invitations'
            }
        });

        invitations.value = response;
    } catch (error) {
        console.error('Error loading invitations:', error);
    } finally {
        loading.value = false;
    }
};

const cancelInvitation = async (id: string) => {
    if (!props.groupId) return;

    if (!confirm('Are you sure you want to cancel this invitation?')) return;

    try {
        await api.delete('/api/database/groups', {
            params: {
                groupId: props.groupId,
                invitationId: id
            }
        });

        // Update local list
        invitations.value = invitations.value.filter(inv => inv.id !== id);

        // Notify parent component
        emit('invitation-cancelled');
    } catch (error) {
        console.error('Error cancelling invitation:', error);
        alert('Failed to cancel invitation. Please try again.');
    }
};

onMounted(loadInvitations);

// Expose the reload method to the parent component
defineExpose({
    reload: loadInvitations
});
</script>
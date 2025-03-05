<!-- components/group/InvitationForm.vue -->
<template>
    <div class="bg-white rounded-lg shadow p-4">
        <h3 class="text-lg font-medium text-gray-700 mb-3">Invite New Member</h3>
        <form @submit.prevent="sendInvitation" class="space-y-4">
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" id="email" v-model="email" required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="member@example.com" />
            </div>
            <div class="flex justify-end">
                <button type="submit" :disabled="isSubmitting"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                    <span v-if="isSubmitting">Sending...</span>
                    <span v-else>Send Invitation</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    groupId: string;
}>();

const emit = defineEmits(['invitation-sent']);

const email = ref('');
const isSubmitting = ref(false);

const api = useApi();

const sendInvitation = async () => {
    if (!email.value) return;

    isSubmitting.value = true;

    try {
        await api.post('/api/database/groups', {
            groupId: props.groupId,
            email: email.value
        });

        // Reset form
        email.value = '';

        // Notify parent component
        emit('invitation-sent');
    } catch (error) {
        console.error('Error sending invitation:', error);
        alert('Failed to send invitation. Please try again.');
    } finally {
        isSubmitting.value = false;
    }
};
</script>
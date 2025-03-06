<template>
    <div class="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
        <div class="flex justify-between">
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                    <img v-if="member.userDetails.picture" :src="member.userDetails.picture" alt="Profile"
                        class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
                        <span>{{ getInitials(member.userDetails.name) }}</span>
                    </div>
                </div>
                <div>
                    <div class="font-medium">{{ member.userDetails.name }}</div>
                    <div class="text-sm text-gray-500">{{ member.userDetails.email }}</div>
                </div>
            </div>
            <div class="flex items-center">
                <span v-if="member.is_admin" class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Admin</span>
                <button v-if="isAdmin && !isCurrentUser(member.userDetails.id)" @click="confirmRemove"
                    class="ml-2 text-red-500 hover:text-red-700" title="Remove from group">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import type { GroupUser } from '~/types';

const props = defineProps<{
    member: GroupUser;
    isAdmin: Boolean;
}>();

const emits = defineEmits(['remove-member']);
const authStore = useAuthStore();

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

const isCurrentUser = (userId: string) => {
    return authStore.user?.id === userId;
};

const confirmRemove = () => {
    if (confirm(`Are you sure you want to remove ${props.member.userDetails.name} from the group?`)) {
        emits('remove-member', props.member.userDetails.id);
    }
};
</script>
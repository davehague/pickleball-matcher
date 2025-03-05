<template>
    <div class="flex items-center justify-between border border-gray-200 rounded-lg p-3">
        <div class="flex items-center">
            <div
                class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 font-bold text-sm mr-3">
                {{ getInitials(member.userDetails.name) }}
            </div>
            <div>
                <div class="flex items-center">
                    <div class="font-medium">{{ member.userDetails.name }}</div>
                    <span v-if="member.is_admin" class="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        Admin
                    </span>
                </div>
                <div class="text-sm text-gray-500">
                    <span v-if="member.userDetails.dupr_rating">DUPR {{ member.userDetails.dupr_rating }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { GroupUser } from '~/types';

defineProps<{
    member: GroupUser
}>();

const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('');
};
</script>
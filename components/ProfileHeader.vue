// src/components/ProfileHeader.vue
<template>
    <div class="flex items-center space-x-4 mb-6">
        <div
            class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold">
            {{ getUserInitials }}
        </div>
        <div>
            <h3 class="text-lg font-medium">{{ user.name }}</h3>
            <p class="text-gray-500">{{ user.email }}</p>
            <div class="mt-2 flex items-center">
                <span class="text-green-800 font-medium">DUPR {{ user.dupr_rating || 'N/A' }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, computed } from 'vue'
import type { User } from '~/types/interfaces'

export default defineComponent({
    name: 'ProfileHeader',
    props: {
        user: {
            type: Object as PropType<User>,
            required: true
        }
    },
    setup(props) {
        const getUserInitials = computed(() => {
            if (!props.user.name) return '';
            const nameParts = props.user.name.split(' ');
            return nameParts.length > 1
                ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
                : props.user.name.substring(0, 2).toUpperCase();
        });

        return { getUserInitials };
    }
})
</script>
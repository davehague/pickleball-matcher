// src/components/ProfileHeader.vue
<template>
    <div class="flex items-center space-x-4 mb-6">
        <div
            class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold">
            {{ user.initials }}
        </div>
        <div>
            <h3 class="text-lg font-medium">{{ user.name }}</h3>
            <p class="text-gray-500">{{ user.email }}</p>
            <div class="mt-2 flex items-center">
                <span class="text-green-800 font-medium">DUPR {{ user.dupr }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { User } from '~/types/index'

export default defineComponent({
    name: 'ProfileHeader',
    props: {
        user: {
            type: Object as PropType<User>,
            required: true
        }
    }
})
</script>
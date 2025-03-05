// src/components/MemberCard.vue
<template>
    <div class="flex items-center justify-between border border-gray-200 rounded-lg p-3">
        <div class="flex items-center">
            <div
                class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 font-bold text-sm mr-3">
                {{ getInitials(member.name) }}
            </div>
            <div>
                <div class="flex items-center">
                    <div class="font-medium">{{ member.name }}</div>
                    <span v-if="member.is_admin" class="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        Admin
                    </span>
                </div>
                <div class="text-sm text-gray-500">DUPR {{ member.dupr }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { GroupMember } from '~/types'

export default defineComponent({
    name: 'MemberCard',
    props: {
        member: {
            type: Object as PropType<GroupMember>,
            required: true
        }
    },
    setup() {
        const getInitials = (name: string): string => {
            return name
                .split(' ')
                .map(part => part.charAt(0))
                .join('')
        }

        return {
            getInitials
        }
    }
})
</script>
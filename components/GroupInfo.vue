// src/components/GroupInfo.vue
<template>
    <section class="bg-white rounded-lg shadow p-4">
        <h3 class="text-lg font-medium text-gray-700 mb-3">Group Information</h3>
        <div class="space-y-3">
            <div>
                <div class="text-sm font-medium text-gray-500 mb-1">Created</div>
                <div class="text-sm">{{ groupInfo.created }}</div>
            </div>
            <div>
                <div class="text-sm font-medium text-gray-500 mb-1">Regular Play Locations</div>
                <div class="text-sm">{{ groupInfo.playLocations.join(', ') }}</div>
            </div>
            <div>
                <div class="text-sm font-medium text-gray-500 mb-1">Group Skill Level</div>
                <div class="text-sm">{{ groupInfo.skillLevel }}</div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { GroupInformation } from '~/types'

export default defineComponent({
    name: 'GroupInfo',
    props: {
        groupInfo: {
            type: Object as PropType<GroupInformation>,
            required: true
        }
    }
})
</script>
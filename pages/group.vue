// src/pages/group.vue
<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-800">{{ groupName }}</h2>
            <div class="text-sm text-gray-500">{{ memberCount }} members</div>
        </div>

        <!-- Group Message Board -->
        <!-- <GroupChat :messages="messages" @send-message="sendMessage" /> -->

        <!-- Group Members -->
        <section class="bg-white rounded-lg shadow p-4">
            <h3 class="text-lg font-medium text-gray-700 mb-3">Members</h3>
            <div class="grid md:grid-cols-2 gap-3">
                <MemberCard v-for="member in members" :key="member.id" :member="member" />
            </div>
        </section>

        <!-- Group Info/Settings -->
        <GroupInfo :group-info="groupInfo" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { GroupMember, ChatMessage, GroupInformation } from '~/types/index'

const groupName = ref('Downtown Players')
const memberCount = ref(14)

// Sample chat messages
const messages = ref<ChatMessage[]>([
    {
        id: 1,
        sender: {
            id: 1,
            name: 'John Doe',
            initials: 'JD',
            color: 'blue'
        },
        content: 'Has anyone played at the new courts downtown? Are they worth checking out?',
        timestamp: 'Tuesday, 10:15 AM'
    },
    {
        id: 2,
        sender: {
            id: 2,
            name: 'Sarah Miller',
            initials: 'SM',
            color: 'green'
        },
        content: 'Yes! They\'re amazing. New surfaces and the lighting is great for evening play.',
        timestamp: 'Tuesday, 10:32 AM'
    },
    {
        id: 3,
        sender: {
            id: 3,
            name: 'Tom King',
            initials: 'TK',
            color: 'purple'
        },
        content: 'I can bring extra balls on Thursday if anyone needs some.',
        timestamp: 'Today, 8:22 AM'
    }
])

// Sample group members
const members = ref<GroupMember[]>([
    { id: 1, name: 'John Doe', dupr: 4.2, isAdmin: true },
    { id: 2, name: 'Sarah Miller', dupr: 4.5, isAdmin: false },
    { id: 3, name: 'Tom King', dupr: 3.8, isAdmin: false },
    { id: 4, name: 'Emma Wilson', dupr: 4.0, isAdmin: false },
    { id: 5, name: 'Michael Chen', dupr: 4.7, isAdmin: false },
    { id: 6, name: 'Jessica Lee', dupr: 3.5, isAdmin: false }
])

// Group information
const groupInfo = ref<GroupInformation>({
    created: 'January 15, 2025',
    playLocations: ['Downtown Courts', 'Sunset Park', 'Community Center'],
    skillLevel: 'Intermediate to Advanced (DUPR 3.5-4.7)'
})

// Send a new chat message
const sendMessage = (content: string) => {
    const newMessage: ChatMessage = {
        id: messages.value.length + 1,
        sender: {
            id: 1, // Current user (John Doe)
            name: 'John Doe',
            initials: 'JD',
            color: 'blue'
        },
        content,
        timestamp: 'Just now'
    }

    messages.value.push(newMessage)
}
</script>
// src/components/GroupChat.vue
<template>
    <section class="bg-white rounded-lg shadow p-4">
        <h3 class="text-lg font-medium text-gray-700 mb-3">Group Chat</h3>
        <div class="border border-gray-200 rounded-lg p-4 h-64 overflow-y-auto bg-gray-50">
            <div class="space-y-4">
                <div v-for="message in messages" :key="message.id" class="flex items-start">
                    <div
                        :class="`w-8 h-8 rounded-full bg-${message.sender.color}-100 flex items-center justify-center text-${message.sender.color}-800 font-bold text-xs mr-2 flex-shrink-0`">
                        {{ message.sender.initials }}
                    </div>
                    <div class="bg-white p-3 rounded-lg shadow-sm max-w-md">
                        <div class="font-medium text-sm mb-1">{{ message.sender.name }}</div>
                        <p class="text-sm">{{ message.content }}</p>
                        <div class="text-xs text-gray-500 mt-1">{{ message.timestamp }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-3 flex">
            <input v-model="newMessage" @keyup.enter="sendMessage" type="text" placeholder="Type a message..."
                class="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-green-500" />
            <button @click="sendMessage" class="bg-green-600 text-white px-4 py-2 rounded-r-md">
                Send
            </button>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref } from 'vue'
import type { ChatMessage } from '~/types/index'

export default defineComponent({
    name: 'GroupChat',
    props: {
        messages: {
            type: Array as PropType<ChatMessage[]>,
            required: true
        }
    },
    emits: ['send-message'],
    setup(props, { emit }) {
        const newMessage = ref('')

        const sendMessage = () => {
            if (newMessage.value.trim()) {
                emit('send-message', newMessage.value)
                newMessage.value = ''
            }
        }

        return {
            newMessage,
            sendMessage
        }
    }
})
</script>
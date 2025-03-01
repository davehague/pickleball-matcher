<template>
    <div class="bg-white rounded-lg shadow p-4">
        <h3 class="text-lg font-medium text-gray-700 mb-3">Hosting Responsibilities</h3>
        <div class="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
            <div class="flex items-start">
                <div class="text-blue-500 mr-2 flex-shrink-0 mt-0.5">
                    <Info :size="20" />
                </div>
                <div>
                    <h4 class="text-sm font-medium text-gray-700 mb-1">Your hosting schedule this week</h4>
                    <p class="text-sm text-gray-600">
                        You are the host for <span class="font-medium">{{ hostDate }}</span>.
                        As host, you are responsible for:
                    </p>
                    <ul class="list-disc list-inside mt-1 text-sm text-gray-600 pl-1">
                        <li v-for="(responsibility, index) in responsibilities" :key="index">
                            {{ responsibility }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { Info } from 'lucide-vue-next'

export default defineComponent({
    name: 'HostingResponsibilities',
    components: {
        Info
    },
    props: {
        hostDate: {
            type: String,
            required: true
        },
        responsibilities: {
            type: Array as PropType<string[]>,
            required: true
        }
    }
})
</script>
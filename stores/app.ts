import { defineStore } from 'pinia'
import PersistentDataService from '@/services/PersistentDataService'
import { type User } from '@/types/interfaces'

export const useAppStore = defineStore('app', {
  state: () => ({
    // events: [] as TimelineEvent[]
  }),
  actions: {
    // async fetchEvents() {
    //   try {
    //     this.events = await PersistentDataService.fetchOrderedEvents()
    //   } catch (error) {
    //     console.error('Failed to fetch events:', error)
    //     // Here you might want to set an error state
    //   }
    // },
    // async createEvent(event: NewTimelineEvent) {
    //   try {
    //     await PersistentDataService.createEvent(event)
    //     await this.fetchEvents() // Refresh the events list
    //   } catch (error) {
    //     console.error('Failed to create event:', error)
    //     // Here you might want to set an error state
    //   }
    // }
  },
  getters: {
    // sortedEvents: (state) => {
    //   return [...state.events].sort((a, b) => {
    //     if (a.year !== b.year) return b.year - a.year
    //     if (a.month !== b.month) return (b.month || 0) - (a.month || 0)
    //     return (b.day || 0) - (a.day || 0)
    //   })
    // }
  }
})
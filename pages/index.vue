<!-- src/pages/index.vue -->
<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="bg-gradient-to-b from-green-500 to-green-700 text-white pt-16 pb-20 px-4">
      <div class="container mx-auto max-w-6xl">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold">Pickleball Matcher</h1>
          <button @click="navigateToLogin"
            class="bg-white text-green-700 hover:bg-green-100 font-medium py-2 px-4 rounded-lg transition-colors">
            Sign In
          </button>
        </div>
        <div class="grid md:grid-cols-2 gap-10 items-center">
          <div class="space-y-6">
            <h2 class="text-4xl md:text-5xl font-bold leading-tight">
              Schedule Pickleball Games Without the Hassle
            </h2>
            <p class="text-xl">
              Pickleball Matcher eliminates complex text chains, making it simple to coordinate matches with your group.
            </p>
            <div class="pt-4">
              <button @click="navigateToLogin"
                class="bg-white text-green-700 hover:bg-green-100 font-semibold py-3 px-6 rounded-lg shadow-md transition-colors">
                Get Started
              </button>
            </div>
          </div>
          <div class="hidden md:block">
            <img src="/pb-logo.png" alt="Pickleball players" class="w-full"
              onerror="this.src='https://placehold.co/600x400?text=Pickleball+Matcher'" />
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 px-4 bg-white">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">Core Features</h2>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-gray-800">Availability Management</h3>
            <p class="text-gray-600">
              Set your weekly playing availability with precise hourly slots. Specify how many times per week you want
              to play.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-gray-800">Smart Match Coordination</h3>
            <p class="text-gray-600">
              Automated nightly matching based on player availability. Easy confirm/decline process for proposed
              matches.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-gray-800">Group Communication</h3>
            <p class="text-gray-600">
              Built-in group chat for general announcements and match-specific coordination.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-16 px-4 bg-gray-100">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>

        <div class="grid md:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <span class="text-2xl font-bold text-green-600">1</span>
            </div>
            <h3 class="font-semibold mb-2">Set Your Availability</h3>
            <p class="text-sm text-gray-600">Mark when you're available to play each week</p>
          </div>

          <div class="text-center">
            <div class="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <span class="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 class="font-semibold mb-2">Get Match Proposals</h3>
            <p class="text-sm text-gray-600">Receive automated match suggestions with other players</p>
          </div>

          <div class="text-center">
            <div class="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <span class="text-2xl font-bold text-green-600">3</span>
            </div>
            <h3 class="font-semibold mb-2">Confirm Your Matches</h3>
            <p class="text-sm text-gray-600">Accept matches that work for your schedule</p>
          </div>

          <div class="text-center">
            <div class="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <span class="text-2xl font-bold text-green-600">4</span>
            </div>
            <h3 class="font-semibold mb-2">Play Pickleball!</h3>
            <p class="text-sm text-gray-600">Enjoy more games with less scheduling hassle</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 px-4 bg-green-600 text-white">
      <div class="container mx-auto max-w-4xl text-center">
        <h2 class="text-3xl font-bold mb-6">Ready to Start Playing More Pickleball?</h2>
        <p class="text-xl mb-8">Join your group on Pickleball Matcher today and simplify your game scheduling.</p>
        <button @click="navigateToLogin"
          class="bg-white text-green-700 hover:bg-green-100 font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors">
          Sign Up Now
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { definePageMeta } from '#imports';

// Set this page to use the landing layout
definePageMeta({
  layout: 'landing'
});

const router = useRouter();

const navigateToLogin = () => {
  router.push('/login');
};
</script>
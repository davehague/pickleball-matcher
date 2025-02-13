<template>
    <div class="flex justify-center items-center h-screen bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md">
            <h1 class="text-2xl font-bold mb-4 text-center">Login with Google</h1>
            <p class="mb-6 text-center text-gray-600">Sign in to access your account</p>
            <GoogleSignInButton @success="handleLoginSuccess" @error="handleLoginError" class="w-full">
            </GoogleSignInButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { GoogleSignInButton, type CredentialResponse } from "vue3-google-signin";
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLoginSuccess = async (response: CredentialResponse) => {
    const { credential } = response;

    if (!credential) {
        console.error("No credential found");
        return;
    }

    // Decode the JWT to get user information
    const payload = JSON.parse(atob(credential.split('.')[1]));

    try {
        // First, try to fetch the user
        const fetchUserResponse = await fetch(`/api/database/users?email=${encodeURIComponent(payload.email)}`);

        let userData;

        if (!fetchUserResponse.ok && fetchUserResponse.status === 404) {
            // User doesn't exist, create new user with full Google OAuth data
            const createUserResponse = await fetch('/api/database/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: payload.email,
                    email_verified: payload.email_verified,
                    name: payload.name,
                    picture: payload.picture,
                    given_name: payload.given_name,
                    family_name: payload.family_name,
                    locale: payload.locale
                })
            });

            if (!createUserResponse.ok) {
                throw new Error('Failed to create user');
            }

            userData = await createUserResponse.json();
        } else {
            userData = await fetchUserResponse.json();

            // Update last login
            await fetch('/api/database/users', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: userData.id,
                    last_login: new Date()
                })
            });
        }

        // Set user and token in the store
        authStore.setUser(userData);
        authStore.setAccessToken(credential);

        // Navigate to home page
        router.push('/home');
    } catch (error) {
        console.error("Failed to handle user authentication", error);
        // You might want to show an error message to the user here
    }
};

// handle an error event
const handleLoginError = () => {
    console.error("Login failed");
    // You might want to show an error message to the user here
};

definePageMeta({
    layout: 'landing'
})
</script>
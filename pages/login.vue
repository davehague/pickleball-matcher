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
import type { User, Group } from "~/types";

const authStore = useAuthStore();
const router = useRouter();

const handleLoginSuccess = async (response: CredentialResponse) => {
    const { credential } = response;
    const api = useApi();

    if (!credential) {
        console.error("No credential found");
        return;
    }

    const payload = JSON.parse(atob(credential.split('.')[1]));

    try {
        authStore.setAccessToken(credential);
        console.log("Access token set:", credential);

        let userData: User;
        try {
            const response = await api.get<User>('/api/database/users', {
                params: { email: payload.email }
            });

            // If the API returns an object with statusCode 404, we need to create a new user
            if (response && 'statusCode' in response && response.statusCode === 404) {
                console.log("User not found, creating new user");
                // Create new user
                userData = await api.post<User>('/api/database/users', {
                    email: payload.email,
                    email_verified: payload.email_verified,
                    name: payload.name,
                    picture: payload.picture,
                    given_name: payload.given_name,
                    family_name: payload.family_name,
                    locale: payload.locale
                });
            } else {
                console.log("User found:", response);
                userData = response as User;
            }

            authStore.setUser(userData);

            // Fetch user's groups after successful login/creation
            try {
                const userGroups = await api.get<Group[]>('/api/database/groups', {
                    params: { userId: userData.id }
                });
                console.log("User groups fetched:", userGroups);
                authStore.setGroups(userGroups);

                // Navigate based on group status
                if (userGroups.length === 0) {
                    // If no groups, go to onboarding
                    router.push('/onboarding');
                } else {
                    // Otherwise go to matches
                    router.push('/matches');
                }
            } catch (error) {
                console.error("Error fetching user groups:", error);
                throw error;
            }
        } catch (error) {
            console.error("Error fetching/creating user:", error);
            throw error;
        }
    } catch (error) {
        console.error("Authentication error:", error);
        authStore.logout(); // Clear credentials if anything goes wrong
    }
};

const handleLoginError = () => {
    console.error("Login failed");
    // You might want to show an error message to the user here
};

definePageMeta({
    layout: 'landing'
})
</script>
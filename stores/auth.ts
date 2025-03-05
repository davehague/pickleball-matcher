import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User, Group } from "@/types";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const user = ref<User | null>(null);
    const accessToken = ref<string | null>(null);
    const userGroups = ref<Group[]>([]);

    const isAuthenticated = computed(() => !!user.value && !!accessToken.value);
    const currentGroup = computed(() => userGroups.value[0] || null); // Default to first group

    function setUser(newUser: User) {
      user.value = newUser;
    }

    function setAccessToken(token: string) {
      accessToken.value = token;
    }

    function setGroups(groups: Group[]) {
      userGroups.value = groups;
    }

    function logout() {
      user.value = null;
      accessToken.value = null;
      userGroups.value = [];
    }

    return {
      user,
      accessToken,
      userGroups,
      currentGroup,
      isAuthenticated,
      setUser,
      setAccessToken,
      setGroups,
      logout,
    };
  },
  {
    persist: true,
  } as any
);

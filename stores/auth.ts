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

    const currentGroup = computed(() => {
      const group = userGroups.value[0] || null;
      return group && group.id ? group : null;
    });
    function setUser(newUser: User) {
      user.value = newUser;
    }

    function updateUser(updatedUser: Partial<User>) {
      if (user.value) {
        user.value = { ...user.value, ...updatedUser };
      }
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
      updateUser,
      setAccessToken,
      setGroups,
      logout,
    };
  },
  {
    persist: true,
  } as any
);

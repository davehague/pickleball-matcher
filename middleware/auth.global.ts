// middleware/auth.global.ts

import { useAuthStore } from "~/stores/auth";
import { navigateTo } from "#app";

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  const publicRoutes = ["/"];
  const authRoutes = ["/login"];
  const onboardingRoute = "/onboarding";

  // Allow public routes
  if (publicRoutes.includes(to.path)) {
    return;
  }

  // Allow auth routes when not authenticated
  if (!authStore.isAuthenticated && authRoutes.includes(to.path)) {
    return;
  }

  // Redirect to login if trying to access protected routes while not authenticated
  if (!authStore.isAuthenticated) {
    return navigateTo("/login");
  }

  // Check if user needs to complete onboarding
  const user = authStore.user;
  const needsOnboarding =
    user &&
    (!user.dupr_rating ||
      user.play_frequency === undefined ||
      user.play_frequency === null);

  // If user needs onboarding and isn't on the onboarding page, redirect to onboarding
  if (needsOnboarding && to.path !== onboardingRoute) {
    return navigateTo(onboardingRoute);
  }

  // If user has completed onboarding and is trying to access onboarding page, redirect to home
  if (!needsOnboarding && to.path === onboardingRoute) {
    return navigateTo("/home");
  }

  // Redirect to home if trying to access auth routes while authenticated
  if (authStore.isAuthenticated && authRoutes.includes(to.path)) {
    return navigateTo("/home");
  }
});

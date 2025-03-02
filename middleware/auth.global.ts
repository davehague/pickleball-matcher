import type { User } from "~/types/interfaces";

// auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  // Define route types
  const publicRoutes = ["/"]; // Landing page is public
  const authRoutes = ["/login", "/register"];
  const onboardingRoutes = ["/onboarding"];
  const appRoutes = ["/availability", "/group", "/profile"];

  // Special handling for root path (/) - it's either public landing or main matches page
  if (to.path === "/") {
    // If authenticated, allow access to main app page (matches)
    if (authStore.user && authStore.isAuthenticated) {
      // Check if onboarding is needed
      if (!isOnboardingCompleted(authStore.user)) {
        return navigateTo("/onboarding");
      }
      // Otherwise, allow access to main app page
      return;
    }
    // If not authenticated, allow access to public landing page
    return;
  }

  // Allow access to auth routes if not authenticated
  if (!authStore.isAuthenticated && authRoutes.includes(to.path)) {
    return;
  }

  // Redirect to login if not authenticated (for all protected routes)
  if (!authStore.isAuthenticated) {
    return navigateTo("/login");
  }

  // At this point, user is authenticated

  // Redirect to root (matches) if trying to access auth routes while authenticated
  if (authRoutes.includes(to.path)) {
    return navigateTo("/");
  }

  // If no user data, redirect to login
  if (!authStore.user) {
    return navigateTo("/login");
  }

  // If authenticated, check if onboarding is needed
  if (!isOnboardingCompleted(authStore.user)) {
    // Don't redirect if already going to onboarding
    if (!onboardingRoutes.includes(to.path)) {
      return navigateTo("/onboarding");
    }
  } else if (onboardingRoutes.includes(to.path)) {
    // If onboarded, prevent accessing onboarding again
    return navigateTo("/");
  }
});

// Helper function to check if onboarding is completed
function isOnboardingCompleted(user: User) {
  if (!user) return false;

  // Check for onboarding_completed field
  if ("onboarding_completed" in user) {
    return user.onboarding_completed;
  }

  // Default to false if no onboarding_completed field exists
  return false;
}

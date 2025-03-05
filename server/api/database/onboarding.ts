// server/api/database/onboarding.ts

import { UserService } from "@/server/services/UserService";
import { defineEventHandler, createError, readBody } from "h3";
import { verifyAuth } from "@/server/utils/auth";
import type { OnboardingData, OnboardingResponse } from "~/types";

const userService = new UserService();

export default defineEventHandler(async (event) => {
  try {
    // Validate the user is authenticated
    const authenticatedUser = await verifyAuth(event);

    if (!authenticatedUser || !authenticatedUser.id) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Validate the user ID format
    if (!userService.isValidUUID(authenticatedUser.id)) {
      throw createError({
        statusCode: 400,
        message: `Invalid user ID format: ${authenticatedUser.id}`,
      });
    }

    if (event.method === "POST") {
      const { basicInfo, playPreferences, locationPreferences, availability } =
        await readBody<OnboardingData>(event);

      const updatedUser = await userService.completeOnboarding(
        authenticatedUser.id,
        basicInfo.phone || null,
        basicInfo.dupr_rating || null,
        basicInfo.notification_email,
        basicInfo.notification_text,
        playPreferences.play_frequency,
        playPreferences.avoid_consecutive_days,
        playPreferences.willing_to_substitute,
        locationPreferences,
        availability
      );

      return updatedUser;
    }

    if (event.method === "GET") {
      try {
        // Return data needed for onboarding flow
        const locations = await userService.getLocations();
        const locationPreferences = await userService.getLocationPreferences(
          authenticatedUser.id
        );

        const response: OnboardingResponse = {
          locations,
          locationPreferences,
        };

        return response;
      } catch (error: any) {
        console.error(`[API] Error fetching onboarding data:`, error);
        // Return empty preferences but still provide locations to avoid breaking the UI
        const locations = await userService.getLocations();

        return {
          locations,
          locationPreferences: [],
        };
      }
    }

    throw createError({ statusCode: 405, message: "Method not allowed" });
  } catch (error: any) {
    console.error(`[API] Error in /onboarding:`, error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Server error",
    });
  }
});

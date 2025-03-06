// server/api/database/user-location-preferences.ts

import { defineEventHandler, createError, getQuery, readBody } from "h3";
import { verifyAuth } from "@/server/utils/auth";
import { UserService } from "@/server/services/UserService";
import type { UserLocationPreference } from "~/types";

const userService = new UserService();

export default defineEventHandler(async (event) => {
  try {
    // Validate the user is authenticated
    const authenticatedUser = await verifyAuth(event);

    if (event.method === "GET") {
      const query = getQuery(event) as { userId?: string };
      const userId = query.userId;

      if (!userId) {
        throw createError({
          statusCode: 400,
          message: "User ID is required",
        });
      }

      // Simple security check - users can only access their own preferences
      // Admin bypass would be added here if needed
      if (userId !== authenticatedUser.id) {
        throw createError({
          statusCode: 403,
          message: "Forbidden: You can only access your own preferences",
        });
      }

      const preferences = await userService.getLocationPreferences(userId);
      return preferences;
    }

    if (event.method === "POST") {
      const body = (await readBody(event)) as {
        userId: string;
        preferences: {
          locationId: string;
          preference: "Preferred" | "OK" | "Do not want";
        }[];
      };

      const { userId, preferences } = body;

      if (!userId || !preferences || !Array.isArray(preferences)) {
        throw createError({
          statusCode: 400,
          message: "User ID and preferences array are required",
        });
      }

      // Security check - users can only update their own preferences
      if (userId !== authenticatedUser.id) {
        throw createError({
          statusCode: 403,
          message: "Forbidden: You can only update your own preferences",
        });
      }

      // Format the preferences for the service method
      const formattedPreferences = preferences.map((pref) => ({
        user_id: userId,
        location_id: pref.locationId,
        preference: pref.preference,
      }));

      // Update preferences
      await userService.updateLocationPreferences(userId, formattedPreferences);

      return {
        success: true,
        message: "Location preferences updated successfully",
      };
    }

    throw createError({ statusCode: 405, message: "Method not allowed" });
  } catch (error: any) {
    console.error(`[API] Error in /user-location-preferences:`, error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
});

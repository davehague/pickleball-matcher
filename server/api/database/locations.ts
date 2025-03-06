// server/api/database/locations.ts

import { LocationService } from "@/server/services/LocationService";
import { UserService } from "@/server/services/UserService";
import { defineEventHandler, createError, getQuery, readBody } from "h3";
import { verifyAuth } from "@/server/utils/auth";
import type { Location } from "~/types";

const locationService = new LocationService();
const userService = new UserService();

export default defineEventHandler(async (event) => {
  try {
    // Validate the user is authenticated
    const authenticatedUser = await verifyAuth(event);

    if (event.method === "GET") {
      const query = getQuery(event) as {
        id?: string;
        search?: string;
        withPreferences?: boolean | string;
        userId?: string;
      };

      // Get a specific location by ID
      if (query.id) {
        const location = await locationService.getLocationById(query.id);
        if (!location) {
          throw createError({
            statusCode: 404,
            message: "Location not found",
          });
        }
        return location;
      }

      // Get locations with user preferences
      if (query.withPreferences && query.userId) {
        // Security check - only allow fetching own preferences
        if (query.userId !== authenticatedUser.id) {
          throw createError({
            statusCode: 403,
            message: "You can only access your own preferences",
          });
        }

        return await userService.getLocationsWithPreferences(query.userId);
      }

      // Search locations
      if (query.search) {
        return await locationService.searchLocations(query.search);
      }

      // Get all locations
      return await locationService.getAllLocations();
    }

    if (event.method === "POST") {
      const body = await readBody<Partial<Location>>(event);

      // Validate required fields
      if (!body.name || !body.address || !body.court_type) {
        throw createError({
          statusCode: 400,
          message: "Name, address, and court type are required",
        });
      }

      return await locationService.createLocation(body);
    }

    if (event.method === "PATCH") {
      const body = await readBody<Partial<Location>>(event);

      if (!body.id) {
        throw createError({
          statusCode: 400,
          message: "Location ID is required",
        });
      }

      // Check if location exists
      const existingLocation = await locationService.getLocationById(body.id);
      if (!existingLocation) {
        throw createError({
          statusCode: 404,
          message: "Location not found",
        });
      }

      return await locationService.updateLocation(body.id, body);
    }

    if (event.method === "DELETE") {
      const query = getQuery(event) as { id?: string };

      if (!query.id) {
        throw createError({
          statusCode: 400,
          message: "Location ID is required",
        });
      }

      // Check if location exists
      const existingLocation = await locationService.getLocationById(query.id);
      if (!existingLocation) {
        throw createError({
          statusCode: 404,
          message: "Location not found",
        });
      }

      await locationService.deleteLocation(query.id);
      return { message: "Location deleted successfully" };
    }

    throw createError({ statusCode: 405, message: "Method not allowed" });
  } catch (error: any) {
    console.error(`[API] Error in /locations:`, error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
});

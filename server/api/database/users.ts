// server/api/database/users.ts

import { UserService } from "@/server/services/UserService";
import { defineEventHandler, createError, getQuery, readBody } from "h3";
import { verifyAuth } from "@/server/utils/auth";
import type { User, GoogleUser } from "@/types/interfaces";

const userService = new UserService();

export default defineEventHandler(async (event) => {
  try {
    // Validate the user is authenticated
    const authenticatedUser = await verifyAuth(event);

    let requestedEmail: string | undefined;

    if (event.method === "GET") {
      const query = getQuery(event) as { email?: string };
      requestedEmail = query.email;
    } else if (event.method === "POST") {
      const body = await readBody<GoogleUser | Partial<User>>(event);
      requestedEmail = "email" in body ? body.email : undefined;
    }

    // Single verification for the endpoint
    if (requestedEmail && authenticatedUser.email !== requestedEmail) {
      throw createError({
        statusCode: 403,
        message: "Forbidden: Unauthorized access",
      });
    }

    // Handle the specific methods
    if (event.method === "GET") {
      const query = getQuery(event) as { email?: string };
      const queryEmail = query.email;

      if (!queryEmail) {
        throw createError({
          statusCode: 400,
          message: "Email parameter is required",
        });
      }

      const user = await userService.findByEmail(queryEmail);

      // Instead of throwing an error, just return a 404 status with a null user
      // This prevents error logging while still indicating the user wasn't found
      if (!user) {
        return {
          statusCode: 404,
          body: null,
          message: "User not found",
        };
      }

      return user;
    }

    if (event.method === "POST") {
      const body = await readBody(event);

      // Check if it's a Google user signup
      if ("email_verified" in body) {
        return await userService.createFromGoogle(body as GoogleUser);
      }

      throw createError({
        statusCode: 400,
        message: "Invalid request body",
      });
    }

    if (event.method === "PATCH") {
      const body = await readBody<Partial<User>>(event);
      if (!body.id) {
        throw createError({ statusCode: 400, message: "User ID is required" });
      }
      return await userService.update(body.id, body);
    }

    throw createError({ statusCode: 405, message: "Method not allowed" });
  } catch (error: any) {
    console.error(`[API] Error in /users:`, error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
});

import { UserService } from "@/server/services/UserService";
import { defineEventHandler, createError } from "h3";
import { verifyAuth } from "@/server/utils/auth";
import type { User, GoogleUser } from "@/types/interfaces";

interface UserQueryParams {
  email?: string;
}

const userService = new UserService();

export default defineEventHandler(async (event) => {
  try {
    // Validate the user is authenticated
    const authenticatedUser = await verifyAuth(event);

    let requestedEmail: string | undefined;

    if (event.method === "GET") {
      const { email } = getQuery<UserQueryParams>(event);
      requestedEmail = email;
    } else if (event.method === "POST") {
      const body = await readBody<GoogleUser>(event);
      requestedEmail = body.email;
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
      const { email: queryEmail } = getQuery<UserQueryParams>(event);
      if (!queryEmail) {
        throw createError({
          statusCode: 400,
          message: "Email parameter is required",
        });
      }

      const user = await userService.findByEmail(queryEmail);
      if (!user) {
        throw createError({ statusCode: 404, message: "User not found" });
      }
      return user;
    }

    if (event.method === "POST") {
      const body = await readBody<GoogleUser>(event);
      return await userService.createFromGoogle(body);
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

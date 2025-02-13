import { UserService } from "@/server/services/UserService";
import { H3Event } from "h3";
import type { User, GoogleUser } from "@/types/interfaces";

interface UserQueryParams {
  email?: string;
}

const userService = new UserService();

export default defineEventHandler(async (event: H3Event) => {
  try {
    // GET - Find user by email
    if (event.method === "GET") {
      const { email } = getQuery<UserQueryParams>(event);
      console.log(`[API] GET /users - Searching for email:`, email);

      if (!email) {
        console.log(`[API] GET /users - Missing email parameter`);
        throw createError({
          statusCode: 400,
          message: "Email parameter is required",
        });
      }

      const user = await userService.findByEmail(email);

      if (!user) {
        throw createError({
          statusCode: 404,
          message: "User not found",
        });
      }

      console.log(`[API] GET /users - User found`);
      return user;
    }

    // POST - Create user from Google OAuth data
    if (event.method === "POST") {
      const body = await readBody<GoogleUser>(event);
      console.log(`[API] POST /users - Creating/updating user:`, body.email);

      if (!body.email || !body.name) {
        throw createError({
          statusCode: 400,
          message: "Email and name are required",
        });
      }

      return await userService.createFromGoogle(body);
    }

    // PATCH - Update existing user
    if (event.method === "PATCH") {
      const body = await readBody<Partial<User>>(event);

      if (!body.id) {
        throw createError({
          statusCode: 400,
          message: "User ID is required",
        });
      }

      return await userService.update(body.id, body);
    }

    throw createError({
      statusCode: 405,
      message: "Method not allowed",
    });
  } catch (error: any) {
    console.error(`[API] Error in /users:`, error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
});

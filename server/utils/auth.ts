// server/utils/auth.ts
import { H3Event, createError, getHeader } from "h3";
import { OAuth2Client } from "google-auth-library";
import { UserService } from "@/server/services/UserService";
import { AuthenticatedUser } from "~/types/interfaces";

const client = new OAuth2Client(process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID);
const userService = new UserService();

export async function verifyAuth(event: H3Event): Promise<AuthenticatedUser> {
  const authHeader = getHeader(event, "Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized: Missing token",
    });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.email_verified) {
      throw new Error("Invalid token payload");
    }

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      throw new Error("Token has expired");
    }

    if (
      payload.iss !== "accounts.google.com" &&
      payload.iss !== "https://accounts.google.com"
    ) {
      throw new Error("Invalid token issuer");
    }

    // Google authentication succeeded, now map to our user
    // Find the user in our database by email
    let user = await userService.findByEmail(payload.email);

    // If user doesn't exist, create a new user
    if (!user) {
      const googleUser = {
        email: payload.email,
        name: payload.name || "",
        picture: payload.picture,
      };

      user = await userService.createFromGoogle(googleUser);
    }

    // Return the authenticated user with our database UUID
    return {
      id: user.id, // This is our UUID, not Google's ID
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    throw createError({
      statusCode: 401,
      message: "Unauthorized: Invalid token",
    });
  }
}

// Helper to verify user can access requested resource
export function verifyUserAccess(
  authenticatedEmail: string,
  requestedEmail: string
) {
  if (authenticatedEmail !== requestedEmail) {
    throw createError({
      statusCode: 403,
      message: "Forbidden: Unauthorized access",
    });
  }
}

// Optional: Create a wrapper for protected routes
export function defineProtectedEventHandler(
  handler: (
    event: H3Event,
    authenticatedUser: AuthenticatedUser
  ) => Promise<any>
) {
  return defineEventHandler(async (event: H3Event) => {
    const authenticatedUser = await verifyAuth(event);
    return handler(event, authenticatedUser);
  });
}

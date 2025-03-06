// server/services/UserService.ts

import type {
  User,
  GoogleUser,
  UserLocationPreference,
  AvailabilitySlot,
  Location,
} from "@/types";
import pkg from "pg";
const { Client } = pkg;

// Create a client instance instead of a pool
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

// Connect to the database
client.connect().catch((err) => {
  console.error("Failed to connect to the database:", err);
});

export class UserService {
  // Find a user by email
  async findByEmail(email: string): Promise<User | null> {
    console.log(`[UserService] Finding user by email:`, email);
    try {
      const result = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (result.rows.length === 0) {
        console.log(`[UserService] User not found for email: ${email}`);
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error(`[UserService] Error finding user:`, error);
      throw error;
    }
  }

  // Create a new user from Google auth data
  async createFromGoogle(googleUser: GoogleUser): Promise<User> {
    console.log(`[UserService] Creating user from Google:`, googleUser.email);

    try {
      // Start a transaction
      await client.query("BEGIN");
      try {
        // 1. Create the user with default values
        const userResult = await client.query(
          `INSERT INTO users (
            email, 
            name, 
            picture, 
            notification_email, 
            notification_text, 
            play_frequency, 
            avoid_consecutive_days, 
            willing_to_substitute
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
          RETURNING *`,
          [
            googleUser.email,
            googleUser.name,
            googleUser.picture || null,
            true, // notification_email default to true
            false, // notification_text default to false
            2, // play_frequency default to 2
            false, // avoid_consecutive_days default to false
            false, // willing_to_substitute default to false
          ]
        );

        const newUser = userResult.rows[0];

        // 2. Add user to the default group (Main Pickleball Group)
        const groupResult = await client.query(
          "SELECT id FROM groups WHERE name = $1",
          ["Main Pickleball Group"]
        );

        if (groupResult.rows.length === 0) {
          // Create the default group if it doesn't exist
          const newGroupResult = await client.query(
            "INSERT INTO groups (name, description) VALUES ($1, $2) RETURNING id",
            ["Main Pickleball Group", "Default group for all players"]
          );

          await client.query(
            "INSERT INTO group_members (group_id, user_id, is_admin) VALUES ($1, $2, $3)",
            [newGroupResult.rows[0].id, newUser.id, false]
          );
        } else {
          await client.query(
            "INSERT INTO group_members (group_id, user_id, is_admin) VALUES ($1, $2, $3)",
            [groupResult.rows[0].id, newUser.id, false]
          );
        }

        // 3. Initialize host rotation for the user
        await client.query(
          "INSERT INTO host_rotation (user_id, hosting_count) VALUES ($1, $2)",
          [newUser.id, 0]
        );

        // 4. Set default location preferences to "OK" for all locations
        const locationsResult = await client.query("SELECT id FROM locations");

        for (const location of locationsResult.rows) {
          await client.query(
            "INSERT INTO user_location_preferences (user_id, location_id, preference) VALUES ($1, $2, $3)",
            [newUser.id, location.id, "OK"]
          );
        }

        await client.query("COMMIT");
        return newUser;
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      }
    } catch (error) {
      console.error(`[UserService] Error creating user:`, error);
      throw error;
    }
  }

  // Update a user
  async update(id: string, data: Partial<User>): Promise<User> {
    try {
      const fields = Object.keys(data);
      const values = Object.values(data);

      // Don't update id or timestamps that should be handled by the DB
      const validFields = fields.filter(
        (f) => f !== "id" && f !== "created_at"
      );
      const validValues = validFields.map(
        (f) => data[f as keyof Partial<User>]
      );

      // Add the user id and current timestamp for updated_at
      validValues.push(id);
      validValues.push(new Date());

      const setClause = validFields
        .map((f, i) => `${f} = $${i + 1}`)
        .join(", ");

      const result = await client.query(
        `UPDATE users SET ${setClause}, updated_at = $${validFields.length + 2} 
         WHERE id = $${validFields.length + 1} 
         RETURNING *`,
        validValues
      );

      return result.rows[0];
    } catch (error) {
      console.error(`[UserService] Error updating user:`, error);
      throw error;
    }
  }

  // Complete onboarding for a user
  async completeOnboarding(
    userId: string,
    phone: string | null,
    duprRating: number | null,
    notificationEmail: boolean,
    notificationText: boolean,
    playFrequency: number,
    avoidConsecutiveDays: boolean,
    willingToSubstitute: boolean,
    locationPreferences: UserLocationPreference[],
    availabilitySlots: AvailabilitySlot[]
  ): Promise<User> {
    try {
      await client.query("BEGIN");

      // 1. Update user profile
      const userResult = await client.query(
        `UPDATE users SET 
          phone = $1,
          dupr_rating = $2,
          notification_email = $3,
          notification_text = $4,
          play_frequency = $5,
          avoid_consecutive_days = $6,
          willing_to_substitute = $7,
          onboarding_completed = TRUE,
          updated_at = $8
        WHERE id = $9
        RETURNING *`,
        [
          phone,
          duprRating,
          notificationEmail,
          notificationText,
          playFrequency,
          avoidConsecutiveDays,
          willingToSubstitute,
          new Date(),
          userId,
        ]
      );

      // 2. Update location preferences
      for (const pref of locationPreferences) {
        await client.query(
          `UPDATE user_location_preferences 
           SET preference = $1, updated_at = $2
           WHERE user_id = $3 AND location_id = $4`,
          [pref.preference, new Date(), userId, pref.location_id]
        );
      }

      // 3. Add availability slots
      for (const slot of availabilitySlots) {
        await client.query(
          `INSERT INTO availability 
           (user_id, week_starting, day_of_week, hour_slot, availability_type)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            userId,
            slot.week_starting,
            slot.day_of_week,
            slot.hour_slot,
            slot.availability_type,
          ]
        );
      }

      await client.query("COMMIT");
      return userResult.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(`[UserService] Error completing onboarding:`, error);
      throw error;
    }
  }

  // Find user by ID
  async findById(userId: string): Promise<User | null> {
    console.log(`[UserService] Finding user by ID:`, userId);
    try {
      // First check if the ID is a valid UUID format
      if (!this.isValidUUID(userId)) {
        console.log(`[UserService] Invalid UUID format for user ID: ${userId}`);
        return null;
      }

      const result = await client.query("SELECT * FROM users WHERE id = $1", [
        userId,
      ]);

      if (result.rows.length === 0) {
        console.log(`[UserService] User not found for ID: ${userId}`);
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error(`[UserService] Error finding user by ID:`, error);
      throw error;
    }
  }

  // Get all locations
  async getLocations(): Promise<Location[]> {
    try {
      const result = await client.query(
        "SELECT * FROM locations ORDER BY name"
      );
      return result.rows;
    } catch (error) {
      console.error(`[UserService] Error getting locations:`, error);
      throw error;
    }
  }

  async updateLocationPreferences(
    userId: string,
    preferences: UserLocationPreference[]
  ): Promise<void> {
    console.log(
      `[UserService] Updating location preferences for user:`,
      userId
    );

    try {
      // Start a transaction
      await client.query("BEGIN");

      for (const pref of preferences) {
        // Check if a preference already exists for this user and location
        const existingResult = await client.query(
          "SELECT id FROM user_location_preferences WHERE user_id = $1 AND location_id = $2",
          [userId, pref.location_id]
        );

        if (existingResult.rows.length > 0) {
          // Update existing preference
          await client.query(
            `UPDATE user_location_preferences 
             SET preference = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2`,
            [pref.preference, existingResult.rows[0].id]
          );
        } else {
          // Create new preference
          await client.query(
            `INSERT INTO user_location_preferences 
             (user_id, location_id, preference) 
             VALUES ($1, $2, $3)`,
            [userId, pref.location_id, pref.preference]
          );
        }
      }

      // Commit the transaction
      await client.query("COMMIT");
      console.log(
        `[UserService] Successfully updated location preferences for user: ${userId}`
      );
    } catch (error) {
      // Rollback in case of error
      await client.query("ROLLBACK");
      console.error(
        `[UserService] Error updating location preferences:`,
        error
      );
      throw error;
    }
  }

  // Updated version of your existing getLocationPreferences method for clarity
  async getLocationPreferences(
    userId: string
  ): Promise<UserLocationPreference[]> {
    console.log(`[UserService] Getting location preferences for user:`, userId);

    try {
      // Check if ID is a valid UUID format
      if (!this.isValidUUID(userId)) {
        console.log(
          `[UserService] Invalid UUID format for user ID in location preferences: ${userId}`
        );
        return [];
      }

      const result = await client.query(
        `SELECT * FROM user_location_preferences WHERE user_id = $1`,
        [userId]
      );

      console.log(
        `[UserService] Retrieved ${result.rows.length} location preferences for user: ${userId}`
      );
      return result.rows;
    } catch (error) {
      console.error(`[UserService] Error getting location preferences:`, error);
      throw error;
    }
  }

  // Method to get locations with user preferences
  async getLocationsWithPreferences(userId: string): Promise<any[]> {
    console.log(
      `[UserService] Getting locations with preferences for user:`,
      userId
    );

    try {
      const result = await client.query(
        `SELECT l.*, ulp.preference
         FROM locations l
         LEFT JOIN user_location_preferences ulp 
           ON l.id = ulp.location_id AND ulp.user_id = $1
         ORDER BY l.name`,
        [userId]
      );

      return result.rows;
    } catch (error) {
      console.error(
        `[UserService] Error getting locations with preferences:`,
        error
      );
      throw error;
    }
  }

  // Helper method to validate UUID format
  isValidUUID(uuid: string): boolean {
    // UUID format regex pattern
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidPattern.test(uuid);
  }

  // When your application is shutting down:
  async close() {
    await client.end();
  }
}

// server/services/LocationService.ts

import type { Location } from "~/types";
import pkg from "pg";
const { Client } = pkg;

// Create a client instance
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

// Connect to the database
client.connect().catch((err) => {
  console.error("Failed to connect to the database:", err);
});

export class LocationService {
  // Get all locations
  async getAllLocations(): Promise<Location[]> {
    console.log(`[LocationService] Getting all locations`);
    try {
      const result = await client.query(
        `SELECT * FROM locations ORDER BY name ASC`
      );
      return result.rows;
    } catch (error) {
      console.error(`[LocationService] Error getting all locations:`, error);
      throw error;
    }
  }

  // Get a single location by ID
  async getLocationById(id: string): Promise<Location | null> {
    console.log(`[LocationService] Getting location by ID:`, id);
    try {
      const result = await client.query(
        `SELECT * FROM locations WHERE id = $1`,
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error(`[LocationService] Error getting location by ID:`, error);
      throw error;
    }
  }

  // Create a new location
  async createLocation(location: Partial<Location>): Promise<Location> {
    console.log(`[LocationService] Creating new location:`, location.name);
    try {
      const result = await client.query(
        `INSERT INTO locations (
          name, 
          address, 
          phone, 
          url, 
          court_type, 
          pricing_info
        ) VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *`,
        [
          location.name,
          location.address,
          location.phone || null,
          location.url || null,
          location.court_type,
          location.pricing_info || null,
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error(`[LocationService] Error creating location:`, error);
      throw error;
    }
  }

  // Update an existing location
  async updateLocation(
    id: string,
    location: Partial<Location>
  ): Promise<Location> {
    console.log(`[LocationService] Updating location:`, id);
    try {
      const fields = Object.keys(location);
      const values = Object.values(location);

      // Don't update id or timestamps
      const validFields = fields.filter(
        (f) => !["id", "created_at"].includes(f)
      );
      const validValues = validFields.map(
        (f) => location[f as keyof Partial<Location>]
      );

      // Add id as the last parameter
      validValues.push(id);

      const setClause = validFields
        .map((f, i) => `${f} = $${i + 1}`)
        .join(", ");

      const result = await client.query(
        `UPDATE locations 
         SET ${setClause},
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $${validFields.length + 1}
         RETURNING *`,
        validValues
      );
      return result.rows[0];
    } catch (error) {
      console.error(`[LocationService] Error updating location:`, error);
      throw error;
    }
  }

  // Delete a location
  async deleteLocation(id: string): Promise<void> {
    console.log(`[LocationService] Deleting location:`, id);
    try {
      await client.query(`DELETE FROM locations WHERE id = $1`, [id]);
    } catch (error) {
      console.error(`[LocationService] Error deleting location:`, error);
      throw error;
    }
  }

  // Search locations by name or address
  async searchLocations(searchTerm: string): Promise<Location[]> {
    console.log(`[LocationService] Searching locations:`, searchTerm);
    try {
      const result = await client.query(
        `SELECT * FROM locations 
         WHERE name ILIKE $1 OR address ILIKE $1
         ORDER BY name ASC`,
        [`%${searchTerm}%`]
      );
      return result.rows;
    } catch (error) {
      console.error(`[LocationService] Error searching locations:`, error);
      throw error;
    }
  }

  // When your application is shutting down:
  async close() {
    await client.end();
  }
}

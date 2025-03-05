// server/services/GroupService.ts

import type {
  Group,
  Location,
  GroupUser,
  GroupMember,
  GroupLocation,
  User,
  GroupInvitation,
} from "~/types";
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

export class GroupService {
  // Get all groups for a user
  async getGroupsForUser(userId: string): Promise<Group[]> {
    console.log(`[GroupService] Getting groups for user:`, userId);
    try {
      const result = await client.query(
        `SELECT g.* 
         FROM groups g 
         JOIN group_members gm ON g.id = gm.group_id 
         WHERE gm.user_id = $1`,
        [userId]
      );
      return result.rows;
    } catch (error) {
      console.error(`[GroupService] Error getting groups for user:`, error);
      throw error;
    }
  }

  // Get all locations for a group
  async getLocationsForGroup(groupId: string): Promise<Location[]> {
    console.log(`[GroupService] Getting locations for group:`, groupId);
    try {
      const result = await client.query(
        `SELECT l.* 
         FROM locations l 
         JOIN group_locations gl ON l.id = gl.location_id 
         WHERE gl.group_id = $1`,
        [groupId]
      );
      return result.rows;
    } catch (error) {
      console.error(`[GroupService] Error getting locations for group:`, error);
      throw error;
    }
  }

  // Get all members for a group
  async getMembersForGroup(groupId: string): Promise<GroupUser[]> {
    console.log(`[GroupService] Getting members for group:`, groupId);
    try {
      const result = await client.query(
        `SELECT gm.is_admin, u.* 
         FROM group_members gm 
         JOIN users u ON u.id = gm.user_id 
         WHERE gm.group_id = $1`,
        [groupId]
      );

      // Transform the results to match the GroupUser interface
      return result.rows.map((row) => ({
        is_admin: row.is_admin,
        userDetails: {
          id: row.id,
          email: row.email,
          name: row.name,
          phone: row.phone,
          dupr_rating: row.dupr_rating,
          picture: row.picture,
          // Include other user fields as needed
        } as User,
      }));
    } catch (error) {
      console.error(`[GroupService] Error getting members for group:`, error);
      throw error;
    }
  }

  // Create a new group
  async createGroup(group: Group): Promise<Group> {
    console.log(`[GroupService] Creating new group:`, group.name);
    try {
      const result = await client.query(
        `INSERT INTO groups (name, description) 
         VALUES ($1, $2) 
         RETURNING *`,
        [group.name, group.description]
      );
      return result.rows[0];
    } catch (error) {
      console.error(`[GroupService] Error creating group:`, error);
      throw error;
    }
  }

  // Update an existing group
  async updateGroup(group: Group): Promise<Group> {
    console.log(`[GroupService] Updating group:`, group.id);
    try {
      const result = await client.query(
        `UPDATE groups 
         SET name = $1, 
             description = $2, 
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $3 
         RETURNING *`,
        [group.name, group.description, group.id]
      );
      return result.rows[0];
    } catch (error) {
      console.error(`[GroupService] Error updating group:`, error);
      throw error;
    }
  }

  // Add a location to a group
  async addGroupLocation(groupLocation: GroupLocation): Promise<GroupLocation> {
    console.log(
      `[GroupService] Adding location to group:`,
      groupLocation.groupId
    );
    try {
      const result = await client.query(
        `INSERT INTO group_locations (group_id, location_id) 
         VALUES ($1, $2) 
         RETURNING *`,
        [groupLocation.groupId, groupLocation.locationId]
      );
      return {
        id: result.rows[0].id,
        groupId: result.rows[0].group_id,
        locationId: result.rows[0].location_id,
        createdAt: result.rows[0].created_at,
        updatedAt: result.rows[0].updated_at,
      };
    } catch (error) {
      console.error(`[GroupService] Error adding group location:`, error);
      throw error;
    }
  }

  // Remove a location from a group
  async removeGroupLocation(groupLocation: GroupLocation): Promise<void> {
    console.log(
      `[GroupService] Removing location from group:`,
      groupLocation.groupId
    );
    try {
      await client.query(
        `DELETE FROM group_locations 
         WHERE group_id = $1 AND location_id = $2`,
        [groupLocation.groupId, groupLocation.locationId]
      );
    } catch (error) {
      console.error(`[GroupService] Error removing group location:`, error);
      throw error;
    }
  }

  // Add a member to a group
  async addGroupMember(
    groupId: string,
    groupMember: GroupMember
  ): Promise<GroupMember> {
    console.log(`[GroupService] Adding member to group:`, groupId);
    try {
      const result = await client.query(
        `INSERT INTO group_members (group_id, user_id, is_admin) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [groupId, groupMember.user_id, groupMember.is_admin]
      );
      return result.rows[0];
    } catch (error) {
      console.error(`[GroupService] Error adding group member:`, error);
      throw error;
    }
  }

  // Remove a member from a group
  async removeGroupMember(groupId: string, userId: string): Promise<void> {
    console.log(`[GroupService] Removing member from group:`, groupId);
    try {
      await client.query(
        `DELETE FROM group_members 
         WHERE group_id = $1 AND user_id = $2`,
        [groupId, userId]
      );
    } catch (error) {
      console.error(`[GroupService] Error removing group member:`, error);
      throw error;
    }
  }

  // Update a group member's details
  async updateGroupMember(groupMember: GroupMember): Promise<GroupMember> {
    console.log(`[GroupService] Updating group member:`, groupMember.id);
    try {
      const result = await client.query(
        `UPDATE group_members 
         SET is_admin = $1, 
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2 
         RETURNING *`,
        [groupMember.is_admin, groupMember.id]
      );
      return result.rows[0];
    } catch (error) {
      console.error(`[GroupService] Error updating group member:`, error);
      throw error;
    }
  }

  async getGroupInvitations(groupId: string): Promise<GroupInvitation[]> {
    console.log(`[GroupService] Getting invitations for group:`, groupId);
    try {
      const result = await client.query(
        `SELECT gi.*, u.name as invited_by_name 
         FROM group_invitations gi
         JOIN users u ON gi.invited_by = u.id 
         WHERE gi.group_id = $1`,
        [groupId]
      );
      return result.rows;
    } catch (error) {
      console.error(`[GroupService] Error getting group invitations:`, error);
      throw error;
    }
  }

  // Create a new invitation
  async createGroupInvitation(
    invitation: GroupInvitation
  ): Promise<GroupInvitation> {
    console.log(`[GroupService] Creating invitation for:`, invitation.email);
    try {
      // Set expiration date to 7 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const result = await client.query(
        `INSERT INTO group_invitations 
         (group_id, email, invited_by, status, expires_at) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (group_id, email) DO UPDATE
         SET invited_by = $3, status = $4, expires_at = $5, created_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [
          invitation.group_id,
          invitation.email,
          invitation.invited_by,
          "Pending",
          expiresAt,
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error(`[GroupService] Error creating invitation:`, error);
      throw error;
    }
  }

  // Delete an invitation
  async deleteGroupInvitation(id: string): Promise<void> {
    console.log(`[GroupService] Deleting invitation:`, id);
    try {
      await client.query(`DELETE FROM group_invitations WHERE id = $1`, [id]);
    } catch (error) {
      console.error(`[GroupService] Error deleting invitation:`, error);
      throw error;
    }
  }

  // Process an invitation (accept or reject)
  async processInvitation(
    token: string,
    action: "accept" | "reject",
    userId?: string
  ): Promise<{ groupId: string; success: boolean }> {
    console.log(`[GroupService] Processing invitation with token:`, token);
    try {
      // Begin transaction
      await client.query("BEGIN");

      // Get the invitation
      const invitationResult = await client.query(
        `SELECT * FROM group_invitations WHERE token = $1 AND status = 'Pending'`,
        [token]
      );

      if (invitationResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return { groupId: "", success: false };
      }

      const invitation = invitationResult.rows[0];

      // Update invitation status
      await client.query(
        `UPDATE group_invitations SET status = $1 WHERE id = $2`,
        [action === "accept" ? "Accepted" : "Rejected", invitation.id]
      );

      // If accepting, add user to group_members
      if (action === "accept" && userId) {
        await client.query(
          `INSERT INTO group_members (group_id, user_id, is_admin) 
           VALUES ($1, $2, false) 
           ON CONFLICT (group_id, user_id) DO NOTHING`,
          [invitation.group_id, userId]
        );
      }

      // Commit transaction
      await client.query("COMMIT");

      return { groupId: invitation.group_id, success: true };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(`[GroupService] Error processing invitation:`, error);
      throw error;
    }
  }

  // When your application is shutting down:
  async close() {
    await client.end();
  }
}

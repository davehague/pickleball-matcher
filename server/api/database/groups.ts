// server/api/database/groups.ts

import { GroupService } from "@/server/services/GroupService";
import { defineEventHandler, createError, getQuery, readBody } from "h3";
import { verifyAuth } from "@/server/utils/auth";
import type { Group, GroupLocation, GroupMember } from "~/types";

const groupService = new GroupService();

export default defineEventHandler(async (event) => {
  try {
    // Validate the user is authenticated
    const authenticatedUser = await verifyAuth(event);

    if (event.method === "GET") {
      const query = getQuery(event) as {
        userId?: string;
        groupId?: string;
        type?: string;
      };

      // If no query parameters, throw error
      if (!query.userId && !query.groupId) {
        throw createError({
          statusCode: 400,
          message: "Either userId or groupId parameter is required",
        });
      }

      // Get groups for a user
      if (query.userId) {
        // Verify user is requesting their own data
        if (query.userId !== authenticatedUser.id) {
          throw createError({
            statusCode: 403,
            message: "Forbidden: Can only request your own groups",
          });
        }
        return await groupService.getGroupsForUser(query.userId);
      }

      // Get data for a specific group
      if (query.groupId) {
        // Verify user is a member of the requested group
        const userGroups = await groupService.getGroupsForUser(
          authenticatedUser.id
        );
        if (!userGroups.some((group) => group.id === query.groupId)) {
          throw createError({
            statusCode: 403,
            message: "Forbidden: Not a member of this group",
          });
        }

        switch (query.type) {
          case "locations":
            return await groupService.getLocationsForGroup(query.groupId);
          case "members":
            return await groupService.getMembersForGroup(query.groupId);
          default:
            throw createError({
              statusCode: 400,
              message: "Invalid type parameter for group query",
            });
        }
      }
    }

    if (event.method === "POST") {
      const body = await readBody(event);

      // Create new group
      if ("name" in body) {
        return await groupService.createGroup(body as Group);
      }

      // Add location to group
      if ("locationId" in body && "groupId" in body) {
        return await groupService.addGroupLocation(body as GroupLocation);
      }

      // Add member to group
      if ("user_id" in body && "group_id" in body) {
        // Verify user is an admin of the group
        const groupMembers = await groupService.getMembersForGroup(
          body.group_id
        );
        const isAdmin = groupMembers.some(
          (member) =>
            member.userDetails.id === authenticatedUser.id && member.is_admin
        );

        if (!isAdmin) {
          throw createError({
            statusCode: 403,
            message: "Forbidden: Only group admins can add members",
          });
        }

        return await groupService.addGroupMember(
          body.group_id,
          body as GroupMember
        );
      }

      throw createError({
        statusCode: 400,
        message: "Invalid request body",
      });
    }

    if (event.method === "PATCH") {
      const body = await readBody(event);

      // Update group
      if ("name" in body) {
        // Verify user is an admin of the group
        const groupMembers = await groupService.getMembersForGroup(body.id);
        const isAdmin = groupMembers.some(
          (member) =>
            member.userDetails.id === authenticatedUser.id && member.is_admin
        );

        if (!isAdmin) {
          throw createError({
            statusCode: 403,
            message: "Forbidden: Only group admins can update group details",
          });
        }

        return await groupService.updateGroup(body as Group);
      }

      // Update group member
      if ("user_id" in body && "group_id" in body) {
        // Verify user is an admin of the group
        const groupMembers = await groupService.getMembersForGroup(
          body.group_id
        );
        const isAdmin = groupMembers.some(
          (member) =>
            member.userDetails.id === authenticatedUser.id && member.is_admin
        );

        if (!isAdmin) {
          throw createError({
            statusCode: 403,
            message: "Forbidden: Only group admins can update member roles",
          });
        }

        return await groupService.updateGroupMember(body as GroupMember);
      }

      throw createError({
        statusCode: 400,
        message: "Invalid request body",
      });
    }

    if (event.method === "DELETE") {
      const query = getQuery(event) as {
        groupId?: string;
        userId?: string;
        locationId?: string;
      };

      if (!query.groupId) {
        throw createError({
          statusCode: 400,
          message: "groupId parameter is required",
        });
      }

      // Verify user is an admin of the group
      const groupMembers = await groupService.getMembersForGroup(query.groupId);
      const isAdmin = groupMembers.some(
        (member) =>
          member.userDetails.id === authenticatedUser.id && member.is_admin
      );

      if (!isAdmin) {
        throw createError({
          statusCode: 403,
          message: "Forbidden: Only group admins can perform this action",
        });
      }

      // Remove location from group
      if (query.locationId) {
        await groupService.removeGroupLocation({
          id: "", // Not needed for removal
          groupId: query.groupId,
          locationId: query.locationId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return { message: "Location removed from group" };
      }

      // Remove member from group
      if (query.userId) {
        await groupService.removeGroupMember(query.groupId, query.userId);
        return { message: "Member removed from group" };
      }

      throw createError({
        statusCode: 400,
        message: "Either userId or locationId parameter is required",
      });
    }

    throw createError({ statusCode: 405, message: "Method not allowed" });
  } catch (error: any) {
    console.error(`[API] Error in /groups:`, error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
});

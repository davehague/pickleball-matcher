// types/models.ts - Database-aligned model interfaces

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  dupr_rating?: number | null;
  notification_email: boolean;
  notification_text: boolean;
  play_frequency: number;
  avoid_consecutive_days: boolean;
  willing_to_substitute: boolean;
  picture?: string | null;
  created_at?: Date | string;
  updated_at?: Date | string;
  onboarding_completed?: boolean;
}

export interface GoogleUser {
  email: string;
  email_verified?: boolean;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
  sub?: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  phone?: string;
  url?: string;
  court_type: string;
  pricing_info?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface UserLocationPreference {
  id?: string;
  user_id: string;
  location_id: string;
  preference: "Preferred" | "OK" | "Do not want";
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface AvailabilitySlot {
  id?: string;
  user_id: string;
  week_starting: Date | string;
  day_of_week: number; // 0-6 (Monday-Sunday)
  hour_slot: number; // 0-23
  availability_type: "Available" | "Preferred" | "Unavailable";
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface Match {
  id: string;
  location_id: string;
  date: string | Date;
  time: string;
  status: "Proposed" | "Confirmed" | "Completed" | "Cancelled";
  host_user_id?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface MatchPlayer {
  id?: string;
  match_id: string;
  user_id: string;
  confirmation_status: "Pending" | "Confirmed" | "Declined";
  is_substitute: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface GroupMember {
  id?: string;
  group_id: string;
  user_id: string;
  is_admin: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface GroupLocation {
  id: string;
  groupId: string;
  locationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HostRotation {
  id?: string;
  user_id: string;
  last_hosted_date?: Date | string;
  hosting_count: number;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface ChatMessage {
  id: string;
  group_id: string;
  user_id: string;
  message: string;
  created_at: Date | string;
}

export interface MatchMessage {
  id: string;
  match_id: string;
  user_id: string;
  message: string;
  created_at: Date | string;
}

export interface GroupInvitation {
  id?: string;
  group_id: string;
  email: string;
  invited_by: string;
  status: "Pending" | "Accepted" | "Rejected" | "Expired";
  token?: string;
  created_at?: Date | string;
  expires_at?: Date | string;
}

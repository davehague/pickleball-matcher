// types/interfaces.ts - Updated to match the DB schema while maintaining compatibility

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  dupr_rating?: number;
  notification_email: boolean;
  notification_text: boolean;
  play_frequency: number;
  avoid_consecutive_days: boolean;
  willing_to_substitute: boolean;
  picture?: string;
  organization_id?: number; // For backward compatibility
  created_at?: Date | string;
  updated_at?: Date | string;
  last_login?: Date | string;
}

export interface GoogleUser {
  email: string;
  email_verified?: boolean;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  phone?: string;
  url?: string;
  is_indoor: boolean;
  pricing_info?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface LocationPreference {
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

export interface HostRotation {
  id?: string;
  user_id: string;
  last_hosted_date?: Date | string;
  hosting_count: number;
  created_at?: Date | string;
  updated_at?: Date | string;
}

// For the onboarding flow
export interface OnboardingData {
  // Step 1: Basic Info
  basicInfo: {
    phone?: string;
    dupr_rating?: number;
    notification_email: boolean;
    notification_text: boolean;
  };

  // Step 2: Play Preferences
  playPreferences: {
    play_frequency: number;
    avoid_consecutive_days: boolean;
    willing_to_substitute: boolean;
  };

  // Step 3: Location Preferences
  locationPreferences: LocationPreference[];

  // Step 4: Availability
  availability: AvailabilitySlot[];
}

// API response types
export interface OnboardingResponse {
  locations: Location[];
  locationPreferences: LocationPreference[];
}

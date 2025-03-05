// types/display.ts - UI/display interfaces

import type {
  AvailabilitySlot,
  Group,
  GroupMember,
  User,
  UserLocationPreference,
} from "./models";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  groups?: GroupWithDetails[];
}

export interface GroupUser {
  is_admin: boolean;
  userDetails: User;
}

export interface GroupWithDetails {
  group: Group;
  members: User[];
  locations: Location[];
}

export interface Availability {
  [day: string]: {
    [timeSlot: string]: boolean;
  };
}

export interface MatchDisplay {
  id: string;
  date: string;
  time: string;
  location: string;
  players: string[];
  confirmed: boolean;
  isHost: boolean;
  isPast?: boolean;
}

export interface Notification {
  id: number;
  type: "success" | "warning" | "info" | "error";
  message: string;
}

export interface Week {
  id: number;
  label: string;
}

export interface AvailabilityGrid {
  [day: string]: {
    [timeSlot: string]: boolean;
  };
}

export interface ChatSender {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface ChatMessageDisplay {
  id: string;
  sender: ChatSender;
  content: string;
  timestamp: string;
}

export interface GroupInformation {
  created: string;
  playLocations: string[];
  skillLevel: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
}

// Onboarding types
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
  locationPreferences: UserLocationPreference[];

  // Step 4: Availability
  availability: AvailabilitySlot[];
}

export interface OnboardingResponse {
  locations: Location[];
  locationPreferences: UserLocationPreference[];
}

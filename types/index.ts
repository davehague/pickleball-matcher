// src/types/index.ts

// Match related types
export interface Match {
  id: number;
  date: string;
  time: string;
  location: string;
  players: string[];
  confirmed: boolean;
  isHost: boolean;
  isPast?: boolean;
}

// Notification types
export interface Notification {
  id: number;
  type: "success" | "warning" | "info" | "error";
  message: string;
}

// Week availability types
export interface Week {
  id: number;
  label: string;
}

// Availability grid types
export interface Availability {
  [day: string]: {
    [timeSlot: string]: boolean;
  };
}

// Group member types
export interface GroupMember {
  id: number;
  name: string;
  dupr: number;
  isAdmin: boolean;
}

// Chat message types
export interface ChatSender {
  id: number;
  name: string;
  initials: string;
  color: string;
}

export interface ChatMessage {
  id: number;
  sender: ChatSender;
  content: string;
  timestamp: string;
}

// Group information types
export interface GroupInformation {
  created: string;
  playLocations: string[];
  skillLevel: string;
}

export interface Location {
  id: number;
  name: string;
  preference: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
}

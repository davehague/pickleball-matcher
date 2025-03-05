// src/fixtures/index.ts
import type {
  Match,
  Notification,
  Week,
  GroupMember,
  ChatMessage,
  Location,
  ContactInfo,
  User,
} from "../types";

// Sample matches
export const matches: Match[] = [
  {
    id: 1,
    date: "Saturday, Mar 2",
    time: "10:00-12:00 PM",
    location: "Sunset Park",
    players: ["Morgan", "Casey", "Riley", "You"],
    confirmed: false,
    isHost: false,
  },
  {
    id: 2,
    date: "Monday, Mar 4",
    time: "6:00-8:00 PM",
    location: "Community Center",
    players: ["Jordan", "Pat", "Sam", "You"],
    confirmed: false,
    isHost: false,
  },
  {
    id: 3,
    date: "Wednesday, Feb 28",
    time: "7:00-9:00 PM",
    location: "Downtown Courts",
    players: ["Alex", "Jamie", "Taylor", "You"],
    confirmed: true,
    isHost: true,
  },
  {
    id: 4,
    date: "Sunday, Feb 25",
    time: "11:00-1:00 PM",
    location: "Downtown Courts",
    players: ["Dana", "Chris", "Robin", "You"],
    confirmed: true,
    isHost: false,
    isPast: true,
  },
  {
    id: 5,
    date: "Wednesday, Feb 21",
    time: "7:00-9:00 PM",
    location: "Sunset Park",
    players: ["Morgan", "Casey", "Riley", "You"],
    confirmed: true,
    isHost: false,
    isPast: true,
  },
];

// Sample notifications
export const notifications: Notification[] = [
  {
    id: 1,
    type: "warning",
    message:
      "Your availability is set for the next 7 days. Remember to update it regularly.",
  },
  {
    id: 2,
    type: "success",
    message: "Your Wednesday match is confirmed. Court fees are $5 per person.",
  },
];

// Sample weeks for availability selection
export const availableWeeks: Week[] = [
  { id: 1, label: "Feb 26 - Mar 4" },
  { id: 2, label: "Mar 5 - Mar 11" },
  { id: 3, label: "Mar 12 - Mar 18" },
  { id: 4, label: "Mar 19 - Mar 25" },
];

// Sample group members
export const groupMembers: GroupMember[] = [
  { id: 1, name: "John Doe", dupr: 4.2, status: "online", isAdmin: true },
  { id: 2, name: "Sarah Miller", dupr: 4.5, status: "online", isAdmin: false },
  { id: 3, name: "Tom King", dupr: 3.8, status: "online", isAdmin: false },
  { id: 4, name: "Emma Wilson", dupr: 4.0, status: "offline", isAdmin: false },
  { id: 5, name: "Michael Chen", dupr: 4.7, status: "offline", isAdmin: false },
  { id: 6, name: "Jessica Lee", dupr: 3.5, status: "offline", isAdmin: false },
];

// Sample chat messages
export const chatMessages: ChatMessage[] = [
  {
    id: 1,
    sender: {
      id: 1,
      name: "John Doe",
      initials: "JD",
      color: "blue",
    },
    content:
      "Has anyone played at the new courts downtown? Are they worth checking out?",
    timestamp: "Tuesday, 10:15 AM",
  },
  {
    id: 2,
    sender: {
      id: 2,
      name: "Sarah Miller",
      initials: "SM",
      color: "green",
    },
    content:
      "Yes! They're amazing. New surfaces and the lighting is great for evening play.",
    timestamp: "Tuesday, 10:32 AM",
  },
  {
    id: 3,
    sender: {
      id: 3,
      name: "Tom King",
      initials: "TK",
      color: "purple",
    },
    content: "I can bring extra balls on Thursday if anyone needs some.",
    timestamp: "Today, 8:22 AM",
  },
];

// Sample user profile
export const user: User = {
  name: "John Doe",
  email: "john.doe@example.com",
  dupr: 4.2,
  initials: "JD",
};

// Sample location preferences
export const locationPreferences: Location[] = [
  { id: 1, name: "Downtown Courts", preference: "Preferred" },
  { id: 2, name: "Sunset Park", preference: "OK, but not preferred" },
  { id: 3, name: "Community Center", preference: "Preferred" },
  { id: 4, name: "North Side Club", preference: "Do not want to play here" },
];

// Sample contact information
export const contactInfo: ContactInfo = {
  phone: "(555) 123-4567",
  email: "john.doe@example.com",
};

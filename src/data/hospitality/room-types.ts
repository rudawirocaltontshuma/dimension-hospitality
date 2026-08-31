import type { RoomType } from "./types";

export const ROOM_TYPES: RoomType[] = [
  {
    id: "standard",
    name: "Standard",
    tagline: "Comfortable essentials",
    description: "A bright, efficiently laid out room with everything needed for a restful stay.",
    baseRate: 129,
    maxAdults: 2,
    maxChildren: 1,
    sizeSqm: 24,
    bedConfig: "1 Queen or 2 Twin",
    amenities: ["Free Wi-Fi", "Smart TV", "Air conditioning", "Work desk"],
    totalRooms: 26,
  },
  {
    id: "deluxe",
    name: "Deluxe",
    tagline: "Extra space, elevated comfort",
    description: "Spacious rooms with upgraded furnishings and a dedicated seating area.",
    baseRate: 189,
    maxAdults: 2,
    maxChildren: 2,
    sizeSqm: 32,
    bedConfig: "1 King or 2 Queen",
    amenities: ["Free Wi-Fi", "Smart TV", "Minibar", "Rain shower", "Lounge chair"],
    totalRooms: 20,
  },
  {
    id: "executive",
    name: "Executive",
    tagline: "Designed for business travel",
    description: "Premium rooms with a private workspace, lounge access, and skyline views.",
    baseRate: 259,
    maxAdults: 2,
    maxChildren: 1,
    sizeSqm: 38,
    bedConfig: "1 King",
    amenities: ["Executive lounge access", "Espresso machine", "Bathtub", "Priority check-in"],
    totalRooms: 12,
  },
  {
    id: "suite",
    name: "Suite",
    tagline: "A residence away from home",
    description: "A separate living area, premium finishes, and panoramic views for extended comfort.",
    baseRate: 389,
    maxAdults: 3,
    maxChildren: 2,
    sizeSqm: 58,
    bedConfig: "1 King + Sofa bed",
    amenities: ["Separate living room", "Dining area", "Butler service", "Jacuzzi", "Skyline view"],
    totalRooms: 10,
  },
  {
    id: "family",
    name: "Family",
    tagline: "Built for the whole crew",
    description: "Connecting layouts and extra sleeping space designed for families and small groups.",
    baseRate: 229,
    maxAdults: 4,
    maxChildren: 3,
    sizeSqm: 46,
    bedConfig: "2 Queen + Bunk",
    amenities: ["Connecting rooms available", "Kids amenity kit", "Game console", "Extra bedding"],
    totalRooms: 10,
  },
];

export function getRoomType(typeId: string) {
  return ROOM_TYPES.find((type) => type.id === typeId) ?? ROOM_TYPES[0];
}

export const TOTAL_ROOM_COUNT = ROOM_TYPES.reduce((sum, type) => sum + type.totalRooms, 0);

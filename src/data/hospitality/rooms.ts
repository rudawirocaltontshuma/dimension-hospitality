import type { Rng } from "./rng";
import { ROOM_TYPES } from "./room-types";
import { daysFromToday, isoDate } from "./today";
import type { HousekeepingStatus, Room, RoomStatus } from "./types";

const VIEWS = ["City view", "Courtyard view", "Pool view", "Garden view", "Ocean view", "Skyline view"] as const;

// Each room type occupies a curated band of floors so the property feels laid out with intent.
const FLOOR_BANDS: Record<string, number[]> = {
  standard: [1, 2, 3],
  family: [1, 2],
  deluxe: [3, 4, 5],
  executive: [5, 6],
  suite: [6, 7],
};

const BASE_STATUS_WEIGHTS: [RoomStatus, number][] = [
  ["Available", 0.58],
  ["Cleaning", 0.19],
  ["Maintenance", 0.14],
  ["Out of Service", 0.09],
];

function pickHousekeeping(rng: Rng, status: RoomStatus): HousekeepingStatus {
  if (status === "Cleaning") return "Cleaning";
  if (status === "Maintenance" || status === "Out of Service") return "Maintenance";
  return rng.weightedPick<HousekeepingStatus>([
    ["Clean", 0.5],
    ["Inspected", 0.3],
    ["Dirty", 0.2],
  ]);
}

/**
 * Generates the base room inventory. Occupancy (status "Occupied" + occupantGuestId) is
 * reconciled afterwards in dataset.ts once reservations exist, so every occupied room maps
 * to a real, currently checked-in reservation instead of being independently randomized.
 */
export function generateRooms(rng: Rng): Room[] {
  const rooms: Room[] = [];
  const floorCounters: Record<number, number> = {};

  for (const type of ROOM_TYPES) {
    const floors = FLOOR_BANDS[type.id] ?? [1];

    for (let i = 0; i < type.totalRooms; i++) {
      const floor = floors[i % floors.length];
      floorCounters[floor] = (floorCounters[floor] ?? 0) + 1;
      const sequence = floorCounters[floor];
      const number = `${floor}${sequence.toString().padStart(2, "0")}`;

      const status = rng.weightedPick(BASE_STATUS_WEIGHTS);
      const rateJitter = rng.pick([-10, -5, 0, 0, 5, 10, 15]);
      const lastCleanedOffset =
        status === "Maintenance" || status === "Out of Service" ? rng.int(3, 10) : rng.int(0, 2);

      rooms.push({
        id: `room-${type.id}-${number}`,
        number,
        floor,
        typeId: type.id,
        rate: type.baseRate + rateJitter,
        status,
        housekeeping: pickHousekeeping(rng, status),
        view: rng.pick(VIEWS),
        occupantGuestId: null,
        lastCleaned: isoDate(daysFromToday(-lastCleanedOffset)),
        notes:
          status === "Out of Service" ? rng.pick(["Deep clean scheduled", "Awaiting parts", "Renovation"]) : undefined,
      });
    }
  }

  return rooms;
}

import type { Rng } from "./rng";
import { daysFromToday, isoDate } from "./today";
import type { HousekeepingPriority, HousekeepingTask, Room, StaffMember } from "./types";

const NOTES_POOL = [
  "Standard turndown service.",
  "Guest requested extra towels.",
  "Deep clean requested by supervisor.",
  "Checkout clean - full inspection required.",
  "Late check-out, clean after 1pm.",
  "",
  "",
  "",
];

function priorityForRoom(room: Room): HousekeepingPriority {
  if (room.housekeeping === "Maintenance") return "High";
  if (room.status === "Occupied" && room.housekeeping === "Dirty") return "High";
  if (room.housekeeping === "Cleaning") return "Urgent";
  if (room.housekeeping === "Dirty") return "Medium";
  return "Low";
}

export function generateHousekeeping(rng: Rng, rooms: Room[], staff: StaffMember[]): HousekeepingTask[] {
  const housekeepers = staff.filter((member) => member.department === "Housekeeping");
  const activeRooms = rooms.filter((room) => room.housekeeping !== "Clean");

  return activeRooms.map((room, index) => {
    const housekeeper = rng.bool(0.85) ? housekeepers[index % housekeepers.length] : null;

    return {
      id: `hk-${room.id}`,
      roomId: room.id,
      housekeeperId: housekeeper?.id ?? null,
      priority: priorityForRoom(room),
      status: room.housekeeping,
      lastCleaned: room.lastCleaned,
      notes: rng.pick(NOTES_POOL),
    };
  });
}

export function generateCleaningHistory(rng: Rng, rooms: Room[]) {
  return Array.from({ length: 14 }, (_, dayIndex) => {
    const date = daysFromToday(-13 + dayIndex);
    const roomsCleaned = Math.round(rooms.length * (0.55 + rng.float(-0.08, 0.1)));
    const inspected = Math.round(roomsCleaned * (0.85 + rng.float(-0.05, 0.05)));

    return {
      date: isoDate(date),
      roomsCleaned,
      inspected,
    };
  });
}

import type { Rng } from "./rng";
import { daysFromToday, isoDate } from "./today";
import type {
  MaintenanceCategory,
  MaintenanceIssue,
  MaintenancePriority,
  MaintenanceStatus,
  Room,
  StaffMember,
} from "./types";

const ISSUE_TITLES: Record<MaintenanceCategory, string[]> = {
  Electrical: ["Flickering bathroom light", "Power outlet not working", "Bedside lamp short-circuiting"],
  Plumbing: ["Leaking bathroom faucet", "Slow draining shower", "Toilet running continuously", "Low water pressure"],
  HVAC: ["Air conditioning not cooling", "Thermostat unresponsive", "Unusual noise from AC unit"],
  Furniture: ["Wardrobe door off its hinge", "Desk chair wobbling", "Curtain rail detached"],
  Electronics: [
    "TV not powering on",
    "Smart TV losing signal",
    "Room safe malfunctioning",
    "Wi-Fi access point offline",
  ],
  Structural: ["Window seal letting in draft", "Ceiling water stain", "Balcony door sticking"],
};

const CATEGORY_WEIGHTS: [MaintenanceCategory, number][] = [
  ["Plumbing", 0.24],
  ["HVAC", 0.22],
  ["Electrical", 0.18],
  ["Electronics", 0.16],
  ["Furniture", 0.12],
  ["Structural", 0.08],
];

const PRIORITY_WEIGHTS: [MaintenancePriority, number][] = [
  ["Low", 0.28],
  ["Medium", 0.36],
  ["High", 0.24],
  ["Critical", 0.12],
];

export function generateMaintenance(rng: Rng, rooms: Room[], staff: StaffMember[], count: number): MaintenanceIssue[] {
  const maintenanceStaff = staff.filter((member) => member.department === "Maintenance");
  const outOfServiceRooms = rooms.filter((room) => room.status === "Out of Service" || room.status === "Maintenance");
  const otherRooms = rng.shuffle(rooms.filter((room) => !outOfServiceRooms.includes(room)));
  const roomPool = [...outOfServiceRooms, ...otherRooms];

  const issues: MaintenanceIssue[] = [];

  for (let i = 0; i < count; i++) {
    const room = roomPool[i % roomPool.length];
    const category = rng.weightedPick(CATEGORY_WEIGHTS);
    const priority = rng.weightedPick(PRIORITY_WEIGHTS);
    const isCurrentlyOutOfService = room.status === "Out of Service" || room.status === "Maintenance";

    const status: MaintenanceStatus = isCurrentlyOutOfService
      ? rng.weightedPick<MaintenanceStatus>([
          ["Reported", 0.25],
          ["Assigned", 0.3],
          ["In Progress", 0.35],
          ["Completed", 0.1],
        ])
      : rng.weightedPick<MaintenanceStatus>([
          ["Completed", 0.7],
          ["In Progress", 0.1],
          ["Assigned", 0.1],
          ["Reported", 0.1],
        ]);

    const dateReportedOffset = status === "Completed" ? rng.int(3, 60) : rng.int(0, 5);
    const dateReported = daysFromToday(-dateReportedOffset);
    const assignedStaffId = status === "Reported" ? null : rng.pick(maintenanceStaff).id;
    const dateResolved = status === "Completed" ? isoDate(daysFromToday(-rng.int(0, dateReportedOffset))) : null;

    issues.push({
      id: `maint-${String(i + 1).padStart(3, "0")}`,
      title: rng.pick(ISSUE_TITLES[category]),
      roomId: room.id,
      category,
      priority,
      assignedStaffId,
      dateReported: isoDate(dateReported),
      dateResolved,
      status,
      description: `${rng.pick(ISSUE_TITLES[category])} reported in room ${room.number}. Guest comfort and safety prioritized before rebooking the room.`,
    });
  }

  return issues.sort((a, b) => (a.dateReported < b.dateReported ? 1 : -1));
}

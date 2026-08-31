import { rooms, SERVICES_CATALOG } from "@/data/hospitality";

export type RequestStatus = "Pending" | "In Progress" | "Completed";
export type RequestPriority = "Low" | "Medium" | "High";

export interface GuestRequest {
  id: string;
  roomNumber: string;
  request: string;
  priority: RequestPriority;
  status: RequestStatus;
  requestedAt: string;
}

const NOTES = [
  "Extra towels and pillows",
  "Late check-out until 2pm",
  "Airport transfer for tomorrow morning",
  "Extra bed for a child",
  "Room service - breakfast at 8am",
  "Laundry pickup before noon",
  "Spa appointment reschedule",
  "Quiet room away from elevator",
];

const TIMES = ["7:45 AM", "8:10 AM", "8:32 AM", "9:05 AM", "9:40 AM", "10:15 AM", "10:50 AM", "11:20 AM"];
const PRIORITIES: RequestPriority[] = ["Medium", "Low", "High", "Medium", "Low", "High", "Medium", "Low"];
const STATUSES: RequestStatus[] = [
  "Pending",
  "In Progress",
  "Pending",
  "Completed",
  "In Progress",
  "Pending",
  "Completed",
  "Pending",
];

export const initialGuestRequests: GuestRequest[] = NOTES.map((note, index) => ({
  id: `req-${index + 1}`,
  roomNumber: rooms[(index * 9 + 3) % rooms.length].number,
  request: `${note} · ${SERVICES_CATALOG[index % SERVICES_CATALOG.length].name}`,
  priority: PRIORITIES[index],
  status: STATUSES[index],
  requestedAt: TIMES[index],
}));

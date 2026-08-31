import { differenceInCalendarDays, parseISO } from "date-fns";

import { generateInvoices } from "./billing";
import { generateGuests } from "./guests";
import { generateCleaningHistory, generateHousekeeping } from "./housekeeping";
import { generateMaintenance } from "./maintenance";
import { generateReservations } from "./reservations";
import { createRng } from "./rng";
import { ROOM_TYPES } from "./room-types";
import { generateRooms } from "./rooms";
import { SERVICES_CATALOG } from "./services-catalog";
import { generateStaff } from "./staff";
import { daysFromToday, isoDate, TODAY, TODAY_ISO } from "./today";
import type { BookingSource, HotelService, Room, RoomTypeId } from "./types";

const SEED = 7_301_994;
const rng = createRng(SEED);

export const roomTypes = ROOM_TYPES;

const baseRooms = generateRooms(rng);
export const guests = generateGuests(rng, 48);
export const staff = generateStaff(rng);
export const reservations = generateReservations(rng, baseRooms, guests, 104);

const todayIso = TODAY_ISO;
const checkedInByRoom = new Map(reservations.filter((r) => r.status === "Checked In").map((r) => [r.roomId, r]));

export const rooms: Room[] = baseRooms.map((room) => {
  const activeReservation = checkedInByRoom.get(room.id);
  if (!activeReservation) return room;

  return {
    ...room,
    status: "Occupied",
    occupantGuestId: activeReservation.guestId,
    housekeeping: rng.weightedPick<Room["housekeeping"]>([
      ["Clean", 0.5],
      ["Dirty", 0.35],
      ["Inspected", 0.15],
    ]),
  };
});

export const maintenanceIssues = generateMaintenance(rng, rooms, staff, 22);
export const housekeepingTasks = generateHousekeeping(rng, rooms, staff);
export const cleaningHistory = generateCleaningHistory(rng, rooms);
export const invoices = generateInvoices(rng, reservations);

const serviceStats = new Map<string, { requests: number; revenue: number }>();
for (const reservation of reservations) {
  for (const charge of reservation.services) {
    const daysAgo = differenceInCalendarDays(TODAY, parseISO(charge.date));
    if (daysAgo < 0 || daysAgo > 30) continue;
    const stat = serviceStats.get(charge.serviceId) ?? { requests: 0, revenue: 0 };
    stat.requests += charge.quantity;
    stat.revenue += charge.amount;
    serviceStats.set(charge.serviceId, stat);
  }
}

export const services: HotelService[] = SERVICES_CATALOG.map((entry) => {
  const stat = serviceStats.get(entry.id);
  return {
    ...entry,
    requests30d: stat?.requests ?? rng.int(4, 14),
    revenue30d: Math.round(stat?.revenue ?? rng.int(220, 980)),
    status: rng.bool(0.9) ? "Active" : "Paused",
    avgRating: rng.float(4.0, 4.9, 1),
  };
});

// ---------- Selectors ----------

const guestById = new Map(guests.map((g) => [g.id, g]));
const roomById = new Map(rooms.map((r) => [r.id, r]));
const reservationById = new Map(reservations.map((r) => [r.id, r]));
const staffById = new Map(staff.map((s) => [s.id, s]));
const serviceById = new Map(services.map((s) => [s.id, s]));
const invoiceByReservationId = new Map(invoices.map((i) => [i.reservationId, i]));

export function getGuest(id: string | null | undefined) {
  return id ? guestById.get(id) : undefined;
}
export function getRoom(id: string | null | undefined) {
  return id ? roomById.get(id) : undefined;
}
export function getReservation(id: string | null | undefined) {
  return id ? reservationById.get(id) : undefined;
}
export function getStaffMember(id: string | null | undefined) {
  return id ? staffById.get(id) : undefined;
}
export function getService(id: string | null | undefined) {
  return id ? serviceById.get(id) : undefined;
}
export function getInvoiceForReservation(reservationId: string) {
  return invoiceByReservationId.get(reservationId);
}
export function reservationsForGuest(guestId: string) {
  return reservations.filter((r) => r.guestId === guestId);
}
export function reservationsForRoom(roomId: string) {
  return reservations.filter((r) => r.roomId === roomId);
}
export function maintenanceForRoom(roomId: string) {
  return maintenanceIssues.filter((m) => m.roomId === roomId);
}
export function roomsOfType(typeId: RoomTypeId) {
  return rooms.filter((r) => r.typeId === typeId);
}

// ---------- Aggregates ----------

const ACTIVE_RESERVATION_STATUSES = new Set(["Confirmed", "Pending", "Checked In", "Checked Out"]);

function isBillable(status: string) {
  return status === "Checked In" || status === "Checked Out";
}

export function countRoomsByStatus() {
  const counts: Record<string, number> = {
    Available: 0,
    Occupied: 0,
    Cleaning: 0,
    Maintenance: 0,
    "Out of Service": 0,
  };
  for (const room of rooms) counts[room.status]++;
  return counts;
}

export function occupancyRate() {
  const counts = countRoomsByStatus();
  return Math.round((counts.Occupied / rooms.length) * 1000) / 10;
}

export function availableRoomsCount() {
  return countRoomsByStatus().Available;
}

export function roomsCleaningCount() {
  return rooms.filter((r) => r.housekeeping === "Cleaning").length;
}

export function todaysArrivals() {
  return reservations.filter((r) => r.checkIn === todayIso && ACTIVE_RESERVATION_STATUSES.has(r.status));
}

export function todaysDepartures() {
  return reservations.filter((r) => r.checkOut === todayIso && ACTIVE_RESERVATION_STATUSES.has(r.status));
}

export function inHouseGuests() {
  return reservations.filter((r) => r.status === "Checked In");
}

export function pendingReservationsCount() {
  return reservations.filter((r) => r.status === "Pending").length;
}

export function reservationsInWindow(daysBack: number, daysForward: number) {
  const start = daysFromToday(-daysBack);
  const end = daysFromToday(daysForward);
  return reservations.filter((r) => {
    const checkIn = parseISO(r.checkIn);
    return checkIn >= start && checkIn <= end;
  });
}

export function revenueForReservation(reservationId: string) {
  const reservation = getReservation(reservationId);
  if (!reservation) return 0;
  const roomCharges = reservation.rate * reservation.nights;
  const serviceCharges = reservation.services.reduce((sum, s) => sum + s.amount, 0);
  return roomCharges + serviceCharges;
}

export function revenueLast30Days() {
  return reservations
    .filter(
      (r) =>
        isBillable(r.status) &&
        differenceInCalendarDays(TODAY, parseISO(r.checkIn)) <= 30 &&
        differenceInCalendarDays(TODAY, parseISO(r.checkIn)) >= 0,
    )
    .reduce((sum, r) => sum + revenueForReservation(r.id), 0);
}

export function averageDailyRate() {
  const active = reservations.filter((r) => isBillable(r.status));
  if (active.length === 0) return 0;
  return Math.round(active.reduce((sum, r) => sum + r.rate, 0) / active.length);
}

export function revPAR() {
  return Math.round(((averageDailyRate() * occupancyRate()) / 100) * 10) / 10;
}

export interface RoomTypePerformanceEntry {
  typeId: RoomTypeId;
  name: string;
  totalRooms: number;
  occupied: number;
  occupancyPct: number;
  revenue: number;
  adr: number;
  bookings: number;
}

export function roomTypePerformance(): RoomTypePerformanceEntry[] {
  return roomTypes.map((type) => {
    const typeRooms = roomsOfType(type.id);
    const occupied = typeRooms.filter((r) => r.status === "Occupied").length;
    const typeReservations = reservations.filter(
      (r) => r.typeId === type.id && isBillable(r.status) && differenceInCalendarDays(TODAY, parseISO(r.checkIn)) <= 45,
    );
    const revenue = typeReservations.reduce((sum, r) => sum + revenueForReservation(r.id), 0);
    const adr = typeReservations.length
      ? Math.round(typeReservations.reduce((sum, r) => sum + r.rate, 0) / typeReservations.length)
      : type.baseRate;

    return {
      typeId: type.id,
      name: type.name,
      totalRooms: type.totalRooms,
      occupied,
      occupancyPct: Math.round((occupied / type.totalRooms) * 1000) / 10,
      revenue,
      adr,
      bookings: typeReservations.length,
    };
  });
}

export function guestSourceBreakdown() {
  const counts = new Map<BookingSource, number>();
  for (const reservation of reservations) {
    if (reservation.status === "Cancelled") continue;
    counts.set(reservation.source, (counts.get(reservation.source) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([source, value]) => ({ source, value }));
}

export interface DailyArrivalPoint {
  date: string;
  label: string;
  arrivals: number;
  departures: number;
}

export function dailyArrivalsDepartures(daysBack: number, daysForward: number): DailyArrivalPoint[] {
  const points: DailyArrivalPoint[] = [];
  for (let offset = -daysBack; offset <= daysForward; offset++) {
    const date = daysFromToday(offset);
    const iso = isoDate(date);
    points.push({
      date: iso,
      label: date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" }),
      arrivals: reservations.filter((r) => r.checkIn === iso && ACTIVE_RESERVATION_STATUSES.has(r.status)).length,
      departures: reservations.filter((r) => r.checkOut === iso && ACTIVE_RESERVATION_STATUSES.has(r.status)).length,
    });
  }
  return points;
}

export function invoicesSummary() {
  return invoices.reduce(
    (acc, invoice) => {
      acc.roomCharges += invoice.roomCharges;
      acc.serviceCharges += invoice.serviceCharges;
      acc.taxes += invoice.taxes;
      acc.discounts += invoice.discount;
      acc.total += invoice.total;
      if (invoice.status === "Paid") acc.paid += invoice.total;
      if (invoice.status === "Pending") acc.pending += invoice.total;
      if (invoice.status === "Overdue") acc.overdue += invoice.total;
      if (invoice.status === "Refunded") acc.refunded += invoice.total;
      return acc;
    },
    {
      roomCharges: 0,
      serviceCharges: 0,
      taxes: 0,
      discounts: 0,
      total: 0,
      paid: 0,
      pending: 0,
      overdue: 0,
      refunded: 0,
    },
  );
}

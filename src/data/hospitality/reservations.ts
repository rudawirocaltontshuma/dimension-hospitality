import type { Rng } from "./rng";
import { getRoomType } from "./room-types";
import { SERVICES_CATALOG } from "./services-catalog";
import { daysFromToday, isoDate, isoDateTime, TODAY } from "./today";
import type { BookingSource, Guest, Reservation, ReservationStatus, Room, RoomTypeId, TimelineEvent } from "./types";

const SOURCE_WEIGHTS: [BookingSource, number][] = [
  ["Direct", 0.28],
  ["Booking.com", 0.24],
  ["Expedia", 0.16],
  ["Corporate", 0.14],
  ["Travel Agent", 0.1],
  ["Walk-in", 0.08],
];

const NIGHT_WEIGHTS: [number, number][] = [
  [1, 0.16],
  [2, 0.26],
  [3, 0.22],
  [4, 0.14],
  [5, 0.1],
  [6, 0.06],
  [7, 0.06],
];

const NOTE_POOL = [
  "Requested early check-in.",
  "Requested late check-out.",
  "High floor room requested.",
  "Celebrating a birthday during the stay.",
  "Traveling with a service animal.",
  "Booked via a corporate travel account.",
  "Connecting rooms requested.",
  "Quiet room away from the elevator requested.",
  "",
  "",
  "",
  "",
];

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function classifyStatus(rng: Rng, checkIn: Date, checkOut: Date): ReservationStatus {
  const today = TODAY;

  if (checkOut < today) {
    return rng.weightedPick<ReservationStatus>([
      ["Checked Out", 0.86],
      ["No-show", 0.06],
      ["Cancelled", 0.08],
    ]);
  }

  if (checkIn.getTime() === today.getTime()) {
    return rng.weightedPick<ReservationStatus>([
      ["Checked In", 0.42],
      ["Confirmed", 0.38],
      ["Pending", 0.12],
      ["No-show", 0.08],
    ]);
  }

  if (checkIn < today && checkOut.getTime() === today.getTime()) {
    return rng.weightedPick<ReservationStatus>([
      ["Checked In", 0.55],
      ["Checked Out", 0.45],
    ]);
  }

  if (checkIn < today && checkOut > today) {
    return "Checked In";
  }

  return rng.weightedPick<ReservationStatus>([
    ["Confirmed", 0.62],
    ["Pending", 0.28],
    ["Cancelled", 0.1],
  ]);
}

function buildTimeline(
  rng: Rng,
  reservation: {
    guestName: string;
    status: ReservationStatus;
    createdAt: Date;
    checkIn: Date;
    checkOut: Date;
  },
): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  let seq = 0;
  const push = (label: string, timestamp: Date, actor: string) => {
    seq++;
    events.push({ id: `tl-${seq}`, label, timestamp: isoDateTime(timestamp), actor });
  };

  push("Reservation created", reservation.createdAt, reservation.guestName);

  if (reservation.status === "Cancelled") {
    push("Reservation cancelled", addDays(reservation.createdAt, rng.int(0, 3)), "Front Desk");
    return events;
  }

  push("Booking confirmed", addDays(reservation.createdAt, rng.int(0, 1)), "Reservations System");

  if (reservation.status === "No-show") {
    push("Marked as no-show", reservation.checkIn, "Front Desk");
    return events;
  }

  if (reservation.status === "Checked In" || reservation.status === "Checked Out") {
    push("Guest checked in", reservation.checkIn, "Front Desk");
  }

  if (reservation.status === "Checked Out") {
    push("Guest checked out", reservation.checkOut, "Front Desk");
  }

  return events;
}

export function generateReservations(rng: Rng, rooms: Room[], guests: Guest[], count: number): Reservation[] {
  const roomIntervals = new Map<string, [number, number][]>();
  const reservations: Reservation[] = [];

  function hasOverlap(roomId: string, start: number, end: number) {
    const intervals = roomIntervals.get(roomId);
    if (!intervals) return false;
    return intervals.some(([s, e]) => start < e && end > s);
  }

  function reserveRoom(roomId: string, start: number, end: number) {
    const intervals = roomIntervals.get(roomId) ?? [];
    intervals.push([start, end]);
    roomIntervals.set(roomId, intervals);
  }

  const roomsByType = new Map<RoomTypeId, Room[]>();
  for (const room of rooms) {
    const list = roomsByType.get(room.typeId) ?? [];
    list.push(room);
    roomsByType.set(room.typeId, list);
  }

  for (let i = 0; i < count; i++) {
    const checkInOffset = rng.int(-35, 26);
    const nights = rng.weightedPick(NIGHT_WEIGHTS);
    const checkIn = daysFromToday(checkInOffset);
    const checkOut = daysFromToday(checkInOffset + nights);

    const typeId = rng.weightedPick<RoomTypeId>([
      ["standard", 0.34],
      ["deluxe", 0.26],
      ["executive", 0.16],
      ["suite", 0.12],
      ["family", 0.12],
    ]);
    const roomType = getRoomType(typeId);
    const candidates = rng.shuffle(roomsByType.get(typeId) ?? rooms);
    const start = checkIn.getTime();
    const end = checkOut.getTime();
    const room = candidates.find((candidate) => !hasOverlap(candidate.id, start, end)) ?? candidates[0];
    reserveRoom(room.id, start, end);

    const guest = rng.pick(guests);
    const status = classifyStatus(rng, checkIn, checkOut);
    const leadTime = checkInOffset > 0 ? rng.int(1, Math.min(60, checkInOffset + 1)) : rng.int(1, 45);
    const createdAt = addDays(checkIn, -leadTime);
    const source = rng.weightedPick(SOURCE_WEIGHTS);
    let rateAdjustment = rng.float(-0.03, 0.07);
    if (source === "Corporate") rateAdjustment = -0.08;
    else if (source === "Direct") rateAdjustment = 0;
    const rate = Math.round(room.rate * (1 + rateAdjustment));
    const adults = rng.int(1, roomType.maxAdults);
    const children = rng.bool(0.28) ? rng.int(1, roomType.maxChildren) : 0;

    const isBillable = status === "Checked In" || status === "Checked Out";
    const services =
      isBillable && rng.bool(0.62)
        ? Array.from({ length: rng.int(1, 4) }, (_, index) => {
            const catalogItem = rng.pick(SERVICES_CATALOG);
            const quantity = rng.int(1, 3);
            const dayOffset = rng.int(0, Math.max(nights - 1, 0));
            return {
              id: `${room.id}-svc-${i}-${index}`,
              serviceId: catalogItem.id,
              date: isoDate(addDays(checkIn, dayOffset)),
              quantity,
              amount: catalogItem.price * quantity,
            };
          })
        : [];

    const reservationId = `res-${String(i + 1).padStart(4, "0")}`;

    reservations.push({
      id: reservationId,
      code: `RSV-${(2200 + i).toString()}`,
      guestId: guest.id,
      roomId: room.id,
      typeId,
      checkIn: isoDate(checkIn),
      checkOut: isoDate(checkOut),
      nights,
      adults,
      children,
      rate,
      status,
      source,
      createdAt: isoDateTime(createdAt),
      notes: rng.pick(NOTE_POOL),
      services,
      timeline: buildTimeline(rng, { guestName: guest.name, status, createdAt, checkIn, checkOut }),
    });
  }

  return reservations.sort((a, b) => a.checkIn.localeCompare(b.checkIn));
}

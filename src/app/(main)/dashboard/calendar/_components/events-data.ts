import { addDays, parseISO } from "date-fns";

import { getGuest, getRoom, getRoomType, type ReservationStatus, reservations } from "@/data/hospitality";

const STATUS_COLORS: Record<ReservationStatus, string> = {
  Confirmed: "#2563eb",
  Pending: "#d97706",
  "Checked In": "#16a34a",
  "Checked Out": "#71717a",
  Cancelled: "#dc2626",
  "No-show": "#ea580c",
};

const VISIBLE_STATUSES = new Set<ReservationStatus>(["Confirmed", "Pending", "Checked In", "Checked Out"]);

export const hospitalityEvents = reservations
  .filter((reservation) => VISIBLE_STATUSES.has(reservation.status))
  .map((reservation) => {
    const guest = getGuest(reservation.guestId);
    const room = getRoom(reservation.roomId);
    const roomType = getRoomType(reservation.typeId);
    const color = STATUS_COLORS[reservation.status];

    return {
      id: reservation.id,
      title: `${guest?.name ?? "Guest"} · Rm ${room?.number ?? "—"}`,
      start: reservation.checkIn,
      // FullCalendar's `end` is exclusive for all-day events; nudge one day forward.
      end: addDays(parseISO(reservation.checkOut), 1).toISOString().slice(0, 10),
      allDay: true,
      backgroundColor: color,
      borderColor: color,
      extendedProps: {
        code: reservation.code,
        roomType: roomType.name,
        status: reservation.status,
      },
    };
  });

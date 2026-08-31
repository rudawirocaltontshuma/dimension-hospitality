"use client";

import * as React from "react";

import { differenceInCalendarDays, parseISO } from "date-fns";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  daysFromToday,
  getGuest,
  isoDate,
  RESERVATION_STATUS_META,
  type ReservationStatus,
  type RoomTypeId,
  reservationsForRoom,
  roomsOfType,
  roomTypes,
} from "@/data/hospitality";

const DAYS_BACK = 3;
const DAYS_FORWARD = 17;
const TOTAL_DAYS = DAYS_BACK + DAYS_FORWARD + 1;

const VISIBLE_STATUSES = new Set<ReservationStatus>(["Confirmed", "Pending", "Checked In", "Checked Out"]);

const range = Array.from({ length: TOTAL_DAYS }, (_, i) => daysFromToday(-DAYS_BACK + i));
const rangeStart = range[0];

export function ReservationTimeline() {
  const [typeId, setTypeId] = React.useState<RoomTypeId>(roomTypes[3]?.id ?? roomTypes[0].id);
  const rooms = roomsOfType(typeId);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <Select value={typeId} onValueChange={(value) => setTypeId(value as RoomTypeId)}>
          <SelectTrigger size="sm" className="w-48">
            <span className="text-muted-foreground">Room type:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {roomTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-3 text-muted-foreground text-xs">
          {(["Confirmed", "Pending", "Checked In", "Checked Out"] as ReservationStatus[]).map((status) => (
            <div key={status} className="flex items-center gap-1.5">
              <span className={`size-2 rounded-full ${RESERVATION_STATUS_META[status].dotClass}`} />
              {status}
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <div className="min-w-[900px]">
          <div
            className="grid border-b bg-muted/40 text-xs"
            style={{ gridTemplateColumns: `140px repeat(${TOTAL_DAYS}, minmax(44px, 1fr))` }}
          >
            <div className="border-r px-2 py-2 font-medium">Room</div>
            {range.map((date) => {
              const isToday = differenceInCalendarDays(date, rangeStart) === DAYS_BACK;
              return (
                <div
                  key={date.toISOString()}
                  className={`border-r px-1 py-2 text-center last:border-r-0 ${isToday ? "bg-primary/10 font-medium text-foreground" : "text-muted-foreground"}`}
                >
                  <div>{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
                  <div className="tabular-nums">{date.getDate()}</div>
                </div>
              );
            })}
          </div>

          {rooms.map((room) => {
            const roomReservations = reservationsForRoom(room.id).filter((r) => VISIBLE_STATUSES.has(r.status));

            return (
              <div
                key={room.id}
                className="grid border-b last:border-b-0"
                style={{ gridTemplateColumns: `140px repeat(${TOTAL_DAYS}, minmax(44px, 1fr))` }}
              >
                <div className="truncate border-r px-2 py-2.5 text-sm">{room.number}</div>
                <div className="relative col-span-full grid" style={{ gridColumn: `2 / span ${TOTAL_DAYS}` }}>
                  <div
                    className="pointer-events-none grid h-full"
                    style={{ gridTemplateColumns: `repeat(${TOTAL_DAYS}, minmax(44px, 1fr))` }}
                  >
                    {range.map((date, index) => (
                      <div
                        key={date.toISOString()}
                        className={index === DAYS_BACK ? "border-primary/20 border-r bg-primary/5" : "border-r"}
                      />
                    ))}
                  </div>
                  <div
                    className="absolute inset-0 grid items-center"
                    style={{ gridTemplateColumns: `repeat(${TOTAL_DAYS}, minmax(44px, 1fr))` }}
                  >
                    {roomReservations.map((reservation) => {
                      const start = Math.max(0, differenceInCalendarDays(parseISO(reservation.checkIn), rangeStart));
                      const end = Math.min(
                        TOTAL_DAYS,
                        differenceInCalendarDays(parseISO(reservation.checkOut), rangeStart),
                      );
                      if (end <= 0 || start >= TOTAL_DAYS) return null;
                      const guest = getGuest(reservation.guestId);
                      const meta = RESERVATION_STATUS_META[reservation.status];

                      return (
                        <div
                          key={reservation.id}
                          title={`${guest?.name ?? "Guest"} · ${reservation.code}`}
                          className={`mx-0.5 truncate rounded px-1.5 py-1 text-[10px] leading-tight ${meta.badgeClass}`}
                          style={{ gridColumn: `${start + 1} / ${end + 1}` }}
                        >
                          {guest?.name ?? "Guest"}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {rooms.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-sm">No rooms of this type.</div>
          ) : null}
        </div>
      </div>
      <p className="text-muted-foreground text-xs">
        {isoDate(rangeStart)} &ndash; {isoDate(range[range.length - 1])}
      </p>
    </div>
  );
}
